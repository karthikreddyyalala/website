"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Interface sound. Off until the visitor turns it on, and remembered after
 * that. Every sound is synthesized with the Web Audio API, so there are no
 * audio files to download.
 *
 * The rules it follows: a sound confirms something the visitor did on
 * purpose and always has a visible twin; hovering, scrolling and typing are
 * silent; a cue lasts about as long as its action. The one exception is the
 * Avis figures, which tick as they count up, once per visit.
 */

type Name = "tap" | "open" | "close" | "count" | "success";

const KEY = "sound";
const CHANGE = "sound:change";

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let enabled = false;
const last: Partial<Record<Name, number>> = {};

// The least time between two plays of the same sound, in ms. Several things
// can ask for one at once (three figures counting together, a fast pointer).
const GAP: Record<Name, number> = { tap: 60, open: 150, close: 150, count: 58, success: 600 };

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
  osc.onended = () => amp.disconnect();
  osc.start(t);
  osc.stop(t + o.dur + 0.03);
}

let noise: AudioBuffer | null = null;

/**
 * A physical-sounding click: a few milliseconds of noise through a band-pass
 * filter. A plain oscillator blip reads as a beep; this reads as a switch.
 */
function click(gain: number, ms = 8, band = 4000) {
  if (!ctx || !out) return;
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  const t = ctx.currentTime;
  src.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = band;
  filter.Q.value = 3;
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
  src.connect(filter).connect(amp).connect(out);
  src.onended = () => amp.disconnect();
  src.start(t);
  src.stop(t + ms / 1000 + 0.01);
}

const C5 = 523.25;
const G5 = 783.99;

const SOUNDS: Record<Name, (p: number) => void> = {
  // A press: a crisp switch click with a soft low thud under it, about 70ms in all.
  tap: () => {
    click(0.3);
    tone(150, { to: 64, dur: 0.07, gain: 0.07 });
  },
  // Command menu: a rising fifth to open, the same falling to close.
  open: () => {
    tone(C5, { dur: 0.14, gain: 0.07 });
    tone(G5, { dur: 0.2, gain: 0.07, at: 0.06 });
  },
  close: () => {
    tone(G5, { dur: 0.12, gain: 0.055 });
    tone(C5, { dur: 0.18, gain: 0.055, at: 0.05 });
  },
  // A figure counting up: soft ticks that climb in pitch with progress p (0 to 1).
  count: (p) => click(0.12, 6, 2600 + p * 2600),
  // Something finished (copied, count complete, sound switched on): a tone that
  // steps up, the way a confirmation does, then rings briefly.
  success: () => {
    tone(660, { to: 990, dur: 0.06, gain: 0.07 });
    tone(990, { dur: 0.34, gain: 0.06, at: 0.055 });
    tone(1485, { dur: 0.3, gain: 0.02, at: 0.06 });
  },
};

/** Builds the audio graph on first use. Must run inside a click or key press, or the browser keeps it silent. */
function wake() {
  if (!enabled) return;
  try {
    if (!ctx) {
      ctx = new AudioContext();
      out = ctx.createGain();
      out.gain.value = 2; // overall level: peaks stay well under a quarter of full scale
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

/** Mount once. Restores the saved choice and gives every link and button its press sound. Hovering is silent. */
export function SoundFx() {
  useEffect(() => {
    try {
      enabled = localStorage.getItem(KEY) === "on";
    } catch {}
    if (enabled) window.dispatchEvent(new Event(CHANGE));

    const down = (e: Event) => {
      wake();
      if ((e.target as Element).closest?.(CONTROL)) play("tap");
    };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("keydown", wake, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("keydown", wake, true);
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
