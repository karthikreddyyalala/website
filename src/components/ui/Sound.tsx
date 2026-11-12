"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Interface sound. Off until the visitor turns it on, and remembered after
 * that. Every sound is synthesized with the Web Audio API, so there are no
 * audio files to download, and all of them are short and quiet: they confirm
 * what the visitor just did and never play on their own.
 */

type Name = "tick" | "tap" | "open" | "close" | "swap" | "count" | "success";

const KEY = "sound";
const CHANGE = "sound:change";

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let enabled = false;
const last: Partial<Record<Name, number>> = {};

// The least time between two plays of the same sound, in ms. Several things
// can ask for one at once (three figures counting together, a fast pointer).
const GAP: Record<Name, number> = { tick: 45, tap: 60, open: 150, close: 150, swap: 240, count: 58, success: 600 };

/** One enveloped tone: a fast attack and an exponential decay, optionally gliding in pitch. */
function tone(freq: number, o: { dur: number; gain: number; to?: number; at?: number; type?: OscillatorType }) {
  if (!ctx || !out) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const t = ctx.currentTime + (o.at ?? 0);
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(o.gain, t + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(amp).connect(out);
  osc.start(t);
  osc.stop(t + o.dur + 0.03);
}

const C5 = 523.25;
const G5 = 783.99;

const SOUNDS: Record<Name, (p: number) => void> = {
  // Pointer arrives on a control: a very quiet, very short tick.
  tick: () => tone(2100, { to: 1500, dur: 0.035, gain: 0.045 }),
  // A press: a low soft thump with a faint click on top.
  tap: () => {
    tone(190, { to: 70, dur: 0.09, gain: 0.08 });
    tone(1400, { to: 900, dur: 0.02, gain: 0.04 });
  },
  // Command menu: a rising fifth to open, the same falling to close.
  open: () => {
    tone(C5, { dur: 0.16, gain: 0.07 });
    tone(G5, { dur: 0.24, gain: 0.07, at: 0.07 });
  },
  close: () => {
    tone(G5, { dur: 0.14, gain: 0.055 });
    tone(C5, { dur: 0.22, gain: 0.055, at: 0.06 });
  },
  // The showcase stage changes project: one soft glass note.
  swap: () => {
    tone(660, { dur: 0.22, gain: 0.05 });
    tone(990, { dur: 0.28, gain: 0.028, at: 0.02 });
  },
  // A figure counting up: ticks that climb in pitch with progress p (0 to 1).
  count: (p) => tone(900 + p * 700, { dur: 0.03, gain: 0.032 }),
  // Something finished (copied, count complete, sound switched on): a rising major chord.
  success: () => [1046.5, 1318.5, 1568].forEach((f, i) => tone(f, { dur: 0.5, gain: 0.055, at: i * 0.07 })),
};

/** Builds the audio graph on first use. Must run inside a click or key press, or the browser keeps it silent. */
function wake() {
  if (!enabled) return;
  try {
    if (!ctx) {
      ctx = new AudioContext();
      out = ctx.createGain();
      out.gain.value = 1.5; // overall level: peaks land around a tenth of full scale
      out.connect(ctx.destination);
      // A faint single echo, so the sounds have a little air instead of stopping dead.
      const echo = ctx.createDelay();
      const feedback = ctx.createGain();
      const tail = ctx.createBiquadFilter();
      const wet = ctx.createGain();
      echo.delayTime.value = 0.11;
      feedback.gain.value = 0.22;
      tail.type = "lowpass";
      tail.frequency.value = 2400;
      wet.gain.value = 0.22;
      out.connect(echo).connect(tail).connect(feedback).connect(echo);
      tail.connect(wet).connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    enabled = false; // no audio on this device; stay silent
  }
}

/** Plays a sound if the visitor has sound on. Safe to call from anywhere; does nothing otherwise. */
export function play(name: Name, progress = 0) {
  if (!enabled || !ctx || ctx.state !== "running") return;
  const now = performance.now();
  if (now - (last[name] ?? 0) < GAP[name]) return;
  last[name] = now;
  try {
    SOUNDS[name](progress);
  } catch {}
}

/** Turns sound on or off. Call from a click or key press. */
export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) {
    wake();
    // Confirm it with a sound, once the context is running.
    void ctx?.resume().then(() => play("success"));
  }
  window.dispatchEvent(new Event(CHANGE));
}

export const toggleSound = () => setSound(!enabled);

const CONTROL = "a, button, summary, [role='option']";

/** Mount once. Restores the saved choice and gives every link and button its hover tick and press sound. */
export function SoundFx() {
  useEffect(() => {
    try {
      enabled = localStorage.getItem(KEY) === "on";
    } catch {}
    if (enabled) window.dispatchEvent(new Event(CHANGE));

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let hovered: Element | null = null;
    const down = (e: Event) => {
      wake();
      if ((e.target as Element).closest?.(CONTROL)) play("tap");
    };
    const over = (e: Event) => {
      const el = (e.target as Element).closest?.(CONTROL) ?? null;
      if (el && el !== hovered) play("tick");
      hovered = el;
    };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("keydown", wake, true);
    if (fine) window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("keydown", wake, true);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return null;
}

/** The on/off control. `label` shows the words beside the icon; without it the button is icon only. */
export function SoundToggle({ className = "", label = false }: { className?: string; label?: boolean }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(enabled);
    sync();
    window.addEventListener(CHANGE, sync);
    return () => window.removeEventListener(CHANGE, sync);
  }, []);

  const Icon = on ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label ? undefined : "Interface sound"}
      title={on ? "Turn sound off" : "Turn sound on"}
      onClick={toggleSound}
      className={className}
    >
      <Icon aria-hidden className="h-4 w-4" />
      {label && (on ? "Sound on" : "Sound off")}
    </button>
  );
}
