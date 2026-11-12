"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { Check, Copy } from "lucide-react";
import { play } from "./Sound";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Aurora: the page backdrop                                          */
/* ------------------------------------------------------------------ */

// Slow, soft light on a near-black ground. The four colors come from the
// --aurora-* tokens in globals.css, so the palette lives in one place.
// Rendered at low resolution (it is soft by nature) so it costs very little.
const AURORA = `
precision highp float; uniform vec2 r; uniform float t; uniform float s;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y; p.y+=s;
 vec2 q=vec2(fbm(p*1.1+t*.04),fbm(p*1.1+vec2(5.2,1.3)-t*.03));
 float f=fbm(p*1.4+q*1.7);
 vec3 c=c0;
 c=mix(c,c1,smoothstep(.42,.82,f)*.75);
 c=mix(c,c2,smoothstep(.58,.92,fbm(p*1.05-q+t*.025))*.6);
 c+=c3*pow(smoothstep(.66,.97,fbm(p*1.9+q*2.-t*.02)),2.)*.1;
 gl_FragColor=vec4(c,1.);}`;

function tokenColor(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/** Fixed, full-screen animated backdrop behind the whole page. Draws nothing without WebGL. */
export function Aurora() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;
    const prog = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"],
      [gl.FRAGMENT_SHADER, AURORA],
    ] as const) {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uS = gl.getUniformLocation(prog, "s");
    ["base", "a", "b", "c"].forEach((key, i) =>
      gl.uniform3f(gl.getUniformLocation(prog, `c${i}`), ...tokenColor(`--aurora-${key}`))
    );

    let raf = 0;
    const draw = (ms: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, ms / 1000 + 20);
      // The light drifts as you scroll, so the page feels like one continuous space.
      gl.uniform1f(uS, window.scrollY * 0.00035);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (ms: number) => {
      // The "Pause motion" control in the footer sets data-motion="off".
      if (document.documentElement.dataset.motion !== "off") draw(ms);
      raf = requestAnimationFrame(loop);
    };
    const size = () => {
      // A third of screen resolution: the image is all soft gradients.
      canvas.width = Math.ceil(window.innerWidth / 3);
      canvas.height = Math.ceil(window.innerHeight / 3);
      draw(performance.now());
    };
    size();
    window.addEventListener("resize", size);
    const still = reduced();
    if (still) window.addEventListener("scroll", size, { passive: true });
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("scroll", size);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}

/* ------------------------------------------------------------------ */
/* Glass light                                                        */
/* ------------------------------------------------------------------ */

/**
 * A soft highlight that follows the pointer across every glass card, like
 * light moving over real glass. Sets --mx/--my on the cards near the pointer;
 * the highlight itself is drawn in CSS (.card::after). Mouse only.
 */
export function GlassLight() {
  useEffect(() => {
    if (reduced() || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>(".card").forEach((card) => {
        const b = card.getBoundingClientRect();
        // Skip cards that are off-screen or far from the pointer.
        if (b.bottom < 0 || b.top > innerHeight || x < b.left - 300 || x > b.right + 300) return;
        card.style.setProperty("--mx", `${x - b.left}px`);
        card.style.setProperty("--my", `${y - b.top}px`);
      });
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Scrolling                                                          */
/* ------------------------------------------------------------------ */

/**
 * Momentum scrolling: the page eases to a stop instead of halting dead, and
 * nav links glide to their section. Wheel and trackpad only; touch keeps the
 * phone's own scrolling. Off under reduced motion. Anything marked
 * data-lenis-prevent (the video dialog, the hands-free panel) scrolls natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    // Anchor jumps respect the scroll-padding-top set on <html>, which clears the nav bar.
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
    return () => lenis.destroy();
  }, []);

  return null;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll-linked motion that works in every browser. Each element with a
 * data-scroll attribute gets three CSS variables, updated once per frame
 * while it is on screen:
 *   --e  enter: 0 as its top reaches the bottom of the screen, 1 once it is well in
 *   --p  pass:  0 to 1 across its whole trip through the screen
 *   --x  exit:  0 until its bottom edge comes up into the screen, then up to 1
 *               (so a tall block never fades while you are still reading it)
 * The CSS in globals.css turns those into movement. Without this script (or
 * under reduced motion) the variables keep their defaults: everything at rest.
 */
export function ScrollFx() {
  useEffect(() => {
    if (reduced()) return;
    const onScreen = new Set<HTMLElement>();
    let raf = 0;

    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      onScreen.forEach((el) => {
        const b = el.getBoundingClientRect();
        el.style.setProperty("--e", clamp01((vh - b.top) / (vh * 0.42)).toFixed(3));
        el.style.setProperty("--p", clamp01((vh - b.top) / (vh + b.height)).toFixed(3));
        // The hero's scene runs on distance scrolled, so it is exactly at rest at the top of the page.
        const exit = el.dataset.scroll === "hero" ? window.scrollY / (vh * 0.8) : (vh - b.bottom) / (vh * 0.85);
        el.style.setProperty("--x", clamp01(exit).toFixed(3));
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target as HTMLElement) : onScreen.delete(e.target as HTMLElement)));
        queue();
      },
      { rootMargin: "10% 0px" }
    );
    document.querySelectorAll<HTMLElement>("[data-scroll]").forEach((el) => watch.observe(el));
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    return () => {
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Depth                                                              */
/* ------------------------------------------------------------------ */

/** Children with a data-depth attribute drift with the pointer, deeper values moving further. */
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (reduced() || !window.matchMedia("(hover: hover)").matches) return;
    const layers = el.querySelectorAll<HTMLElement>("[data-depth]");
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const dx = (e.clientX - b.left) / b.width - 0.5;
      const dy = (e.clientY - b.top) / b.height - 0.5;
      // Variables, not translate itself: CSS adds the scroll scene's offset to them (see [data-depth]).
      layers.forEach((l) => {
        l.style.setProperty("--tx", `${-dx * +l.dataset.depth!}px`);
        l.style.setProperty("--ty", `${-dy * +l.dataset.depth!}px`);
      });
    };
    const leave = () =>
      layers.forEach((l) => {
        l.style.removeProperty("--tx");
        l.style.removeProperty("--ty");
      });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pause control                                                      */
/* ------------------------------------------------------------------ */

/**
 * Stops everything that loops on its own (the backdrop light, the ticker,
 * the pipeline pulses), for anyone who finds constant movement distracting.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "off" : "on";
  }, [paused]);

  // The command menu can flip this too.
  useEffect(() => {
    const flip = () => setPaused((v) => !v);
    window.addEventListener("motion:toggle", flip);
    return () => window.removeEventListener("motion:toggle", flip);
  }, []);

  return (
    <button type="button" aria-pressed={paused} onClick={() => setPaused((v) => !v)} className={className}>
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Small living details                                               */
/* ------------------------------------------------------------------ */

/** Copies text to the clipboard and says so for a moment. */
export function CopyButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(
          () => {
            setCopied(true);
            play("success");
          },
          () => {}
        )
      }
      className={className}
    >
      {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned showcase                                                    */
/* ------------------------------------------------------------------ */

/**
 * The stage of a pinned showcase. Inside the nearest [data-showcase], it
 * watches which [data-project] crosses the middle of the screen and marks
 * that project, its [data-slide] and its [data-tick] as active; CSS does the
 * rest. The first is active in the HTML, so it also reads without JavaScript.
 */
export function ShowcaseStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>("[data-showcase]");
    if (!root) return;
    const groups = ["[data-project]", "[data-slide]", "[data-tick]"].map((q) => [...root.querySelectorAll(q)]);
    let current = 0;
    const activate = (i: number) => {
      if (i === current) return;
      current = i;
      groups.forEach((g) => g.forEach((el, k) => el.toggleAttribute("data-active", k === i)));
    };

    root.setAttribute("data-live", ""); // from here on, the projects that are not active dim
    // A zero-height line across the middle of the screen: exactly one project crosses it at a time.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && activate(groups[0].indexOf(e.target))),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    groups[0].forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.removeAttribute("data-live");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic buttons                                                   */
/* ------------------------------------------------------------------ */

/** Anything marked data-magnetic leans toward the pointer when it comes close, and springs back when it leaves. */
export function Magnetic() {
  useEffect(() => {
    if (reduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")];
    const move = (e: PointerEvent) =>
      els.forEach((el) => {
        const b = el.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        const near = Math.abs(dx) < b.width / 2 + 60 && Math.abs(dy) < b.height / 2 + 60;
        el.style.translate = near ? `${(dx * 0.16).toFixed(1)}px ${(dy * 0.26).toFixed(1)}px` : "";
      });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      els.forEach((el) => (el.style.translate = ""));
    };
  }, []);

  return null;
}
