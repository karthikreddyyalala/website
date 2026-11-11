"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";

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
      draw(ms);
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
 *   --x  exit:  0 until its top leaves the top of the screen, then up to 1
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
        el.style.setProperty("--x", clamp01(-b.top / (b.height * 0.75)).toFixed(3));
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
/* Depth and tilt                                                     */
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
      layers.forEach((l) => (l.style.translate = `${-dx * +l.dataset.depth!}px ${-dy * +l.dataset.depth!}px`));
    };
    const leave = () => layers.forEach((l) => (l.style.translate = "0 0"));
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

/** Tilts its content in 3D toward the pointer. Mouse only; flat on touch and under reduced motion. */
export function Tilt({ children, className = "", max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (reduced() || !window.matchMedia("(hover: hover)").matches) return;
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--ry", `${((e.clientX - b.left) / b.width - 0.5) * 2 * max}deg`);
      el.style.setProperty("--rx", `${(0.5 - (e.clientY - b.top) / b.height) * 2 * max}deg`);
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
