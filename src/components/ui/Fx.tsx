"use client";

import { useEffect, useRef, type ReactNode } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Aurora: the page backdrop                                          */
/* ------------------------------------------------------------------ */

// Slow blue and teal light on a blue-black sky. Rendered at low resolution
// (it is soft by nature) so it costs very little, and paused when the tab is hidden.
const AURORA = `
precision highp float; uniform vec2 r; uniform float t; uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y; p.y+=s;
 vec2 q=vec2(fbm(p*1.1+t*.04),fbm(p*1.1+vec2(5.2,1.3)-t*.03));
 float f=fbm(p*1.4+q*1.7);
 vec3 c=vec3(.022,.03,.047);
 c=mix(c,vec3(.07,.24,.62),smoothstep(.42,.82,f)*.55);
 c=mix(c,vec3(.05,.55,.52),smoothstep(.58,.92,fbm(p*1.05-q+t*.025))*.4);
 c+=vec3(1.,.42,.16)*pow(smoothstep(.66,.97,fbm(p*1.9+q*2.-t*.02)),2.)*.12;
 gl_FragColor=vec4(c,1.);}`;

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
/* Agent graph: the hero centerpiece                                  */
/* ------------------------------------------------------------------ */

type Node3 = { x: number; y: number; z: number; name?: string };

/**
 * A slowly rotating 3D network: the named agents in a ring, a cloud of small
 * nodes around them, and orange message pulses travelling agent to agent in
 * pipeline order. Turns with the pointer. Pauses off-screen; one still frame
 * under reduced motion.
 */
export function AgentGraph({ agents, className = "" }: { agents: string[]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const N = agents.length;

    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const nodes: Node3[] = agents.map((name, i) => {
      const a = (i / N) * Math.PI * 2;
      return { x: Math.cos(a) * 0.62, y: Math.sin(a * 1.3) * 0.22, z: Math.sin(a) * 0.62, name };
    });
    for (let i = 0; i < 70; i++) {
      const a = rnd() * Math.PI * 2;
      const b = Math.acos(2 * rnd() - 1);
      const R = 0.85 + rnd() * 0.4;
      nodes.push({ x: R * Math.sin(b) * Math.cos(a), y: R * Math.cos(b) * 0.8, z: R * Math.sin(b) * Math.sin(a) });
    }
    const edges: [number, number, boolean][] = [];
    for (let i = 0; i < N; i++) edges.push([i, (i + 1) % N, true]);
    for (let i = N; i < nodes.length; i++) {
      const near = nodes
        .map((n, j) => [j, (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 + (n.z - nodes[i].z) ** 2] as const)
        .filter(([j]) => j !== i)
        .sort((a, b) => a[1] - b[1]);
      edges.push([i, near[0][0], false], [i, near[1][0], false]);
    }

    const m = { x: 0.5, y: 0.5 };
    const goal = { x: 0.5, y: 0.5 };
    let raf = 0;
    let visible = false;
    const still = reduced();

    const draw = (ms: number) => {
      const t = ms / 1000 + 12;
      m.x += (goal.x - m.x) * 0.06;
      m.y += (goal.y - m.y) * 0.06;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W * 0.5;
      const cy = H * 0.5;
      const S = Math.min(W, H) * 0.4;
      const yaw = t * 0.13 + (m.x - 0.5) * 1.6;
      const pitch = 0.32 + (m.y - 0.5) * 0.7;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const P = nodes.map((n) => {
        const x = n.x * cyw - n.z * syw;
        const z0 = n.x * syw + n.z * cyw;
        const y = n.y * cp - z0 * sp;
        const z = n.y * sp + z0 * cp;
        const k = 2.6 / (2.6 + z);
        return { sx: cx + x * S * k, sy: cy + y * S * k, k, z };
      });

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      for (const [a, b, main] of edges) {
        const A = P[a], B = P[b], d = (A.k + B.k) / 2;
        ctx.strokeStyle = main ? `rgba(207,230,255,${0.55 * d})` : `rgba(150,185,230,${0.17 * d * d})`;
        ctx.lineWidth = (main ? 2 : 1) * dpr * d;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(B.sx, B.sy);
        ctx.stroke();
      }
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < 2; j++) {
          const A = P[i], B = P[(i + 1) % N];
          const f = (t * 0.32 + j * 0.5 + i * 0.13) % 1;
          const x = A.sx + (B.sx - A.sx) * f;
          const y = A.sy + (B.sy - A.sy) * f;
          const k = A.k + (B.k - A.k) * f;
          ctx.fillStyle = "rgba(255,91,46,0.22)";
          ctx.beginPath();
          ctx.arc(x, y, 11 * dpr * k, 0, 7);
          ctx.fill();
          ctx.fillStyle = "#ff7d55";
          ctx.beginPath();
          ctx.arc(x, y, 4 * dpr * k, 0, 7);
          ctx.fill();
        }
      }
      ctx.font = `600 ${13 * dpr}px ${getComputedStyle(canvas).fontFamily}`;
      P.map((p, i) => [p, i] as const)
        .sort((a, b) => b[0].z - a[0].z)
        .forEach(([p, i]) => {
          if (i < N) {
            ctx.fillStyle = "#0a0f18";
            ctx.strokeStyle = "#eaf3ff";
            ctx.lineWidth = 3 * dpr * p.k;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 9 * dpr * p.k, 0, 7);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = `rgba(234,243,255,${0.55 + 0.45 * Math.min(1, p.k)})`;
            ctx.fillText(nodes[i].name!, p.sx + 16 * dpr * p.k, p.sy + 4 * dpr);
          } else {
            ctx.fillStyle = `rgba(175,208,245,${0.38 * p.k * p.k})`;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 2.6 * dpr * p.k, 0, 7);
            ctx.fill();
          }
        });
    };
    const loop = (ms: number) => {
      draw(ms);
      raf = requestAnimationFrame(loop);
    };

    const sizeWatch = new ResizeObserver(() => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(performance.now());
    });
    sizeWatch.observe(canvas);
    const viewWatch = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) raf = requestAnimationFrame(loop);
    });
    viewWatch.observe(canvas);

    const move = (e: PointerEvent) => {
      goal.x = e.clientX / window.innerWidth;
      goal.y = e.clientY / window.innerHeight;
    };
    if (!still) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      sizeWatch.disconnect();
      viewWatch.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [agents]);

  return <canvas ref={ref} aria-hidden className={`mono block h-full w-full ${className}`} />;
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
