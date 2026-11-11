"use client";

import { useEffect, useRef } from "react";

// Tuning knobs.
const LINES = 9; // contour lines across the height range
const SCALE = 1.5; // terrain zoom; higher = busier
const DRIFT = 0.035; // how fast the terrain shifts
const MAX_DPR = 1.5; // cap pixel density so a background never dominates the GPU

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

/*
 * Animated topographic map: isolines of a slowly shifting noise field, every
 * fifth line in the accent color. The terrain rises a little under the
 * pointer, so the lines bend around it.
 */
const FRAG = `#version 300 es
precision highp float;
uniform vec2 res;
uniform float time;
uniform vec3 pointer; // xy in px, z = strength
uniform vec3 lineColor;
uniform vec3 accentColor;
out vec4 color;

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / res.y;
  vec3 q = vec3(uv * ${SCALE.toFixed(2)}, time * ${DRIFT.toFixed(3)});
  float h = noise(q) * 0.7 + noise(q * 2.1 + 7.3) * 0.3;

  vec2 d = (gl_FragCoord.xy - pointer.xy) / res.y;
  h += pointer.z * 0.16 * exp(-dot(d, d) * 9.0);

  float level = h * ${LINES.toFixed(1)};
  float edge = abs(fract(level - 0.5) - 0.5) / fwidth(level);
  float major = step(mod(floor(level + 0.5), 5.0), 0.5);
  float line = 1.0 - smoothstep(0.0, mix(1.1, 1.6, major), edge);

  float alpha = line * mix(0.2, 0.6, major);
  color = vec4(mix(lineColor, accentColor, major) * alpha, alpha);
}`;

function cssColor(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Live WebGL backdrop. Fills its positioned parent. Draws nothing (and the
 * page looks as before) if WebGL2 is missing. Pauses when scrolled off-screen
 * and shows a single still frame under prefers-reduced-motion.
 */
export function Contour({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const program = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, VERT],
      [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle that covers the whole canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("res");
    const uTime = u("time");
    const uPointer = u("pointer");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let dpr = 1;
    // Pointer in canvas px; eased so the bend follows smoothly and fades out when the mouse leaves.
    const goal = { x: 0, y: 0, on: 0 };
    const eased = { x: 0, y: 0, on: 0 };

    const draw = (ms: number) => {
      eased.x += (goal.x - eased.x) * 0.08;
      eased.y += (goal.y - eased.y) * 0.08;
      eased.on += (goal.on - eased.on) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ms / 1000);
      gl.uniform3f(uPointer, eased.x, eased.y, eased.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (ms: number) => {
      draw(ms);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (still) draw(0);
      else if (visible) raf = requestAnimationFrame(loop);
    };

    const theme = () => {
      gl.uniform3f(u("lineColor"), ...cssColor("--text"));
      gl.uniform3f(u("accentColor"), ...cssColor("--accent"));
      if (still) draw(0);
    };
    theme();
    const themeWatch = new MutationObserver(theme);
    themeWatch.observe(document.documentElement, { attributeFilter: ["data-theme"] });

    const sizeWatch = new ResizeObserver(() => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (still) draw(0);
    });
    sizeWatch.observe(canvas);

    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewWatch.observe(canvas);

    // Listen on the window: the canvas sits behind the content and never gets pointer events.
    const move = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      goal.x = (e.clientX - box.left) * dpr;
      goal.y = (box.bottom - e.clientY) * dpr;
      goal.on = e.clientY < box.bottom ? 1 : 0;
    };
    const leave = () => (goal.on = 0);
    if (!still) {
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      sizeWatch.disconnect();
      viewWatch.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
