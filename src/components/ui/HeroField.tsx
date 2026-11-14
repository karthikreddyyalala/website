"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's signal field: the one WebGL context on the page.
 *
 * A fragment shader tiles the plate with routed lines, the way traces run on
 * a schematic: every cell joins its four edges in two chamfered elbows, so
 * the lines connect into long continuous routes. Short packets of the signal
 * colour travel along them, in patches that drift, and the routes near the
 * pointer light up.
 *
 * This file is only ever loaded on screens 768px and wider, with motion
 * allowed and Save-Data off (see FieldSlot). It draws at about 30 frames a
 * second, at no more than 1.5x device pixels, and stops while it is off
 * screen or the tab is hidden. Colours come from the theme's tokens.
 */

const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float cell;
uniform vec3 ink; uniform vec3 sig; uniform vec3 pap;

float h21(vec2 p){ p=fract(p*vec2(234.34,435.345)); p+=dot(p,p+34.23); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.)); }

// Distance to an elbow from the top edge to the right edge of a unit cell,
// with a 45-degree chamfer, and how far along it the nearest point is (0 to 1).
vec2 elbow(vec2 p){
  vec2 b=vec2(.5,.75), c=vec2(.75,.5);
  float d=seg(p,vec2(.5,1.),b), u=(1.-clamp((p.y-.75)/.25,0.,1.))*.25;
  float d2=seg(p,b,c);
  if(d2<d){ d=d2; u=.25+clamp(dot(p-b,c-b)/dot(c-b,c-b),0.,1.)*.3536; }
  float d3=seg(p,c,vec2(1.,.5));
  if(d3<d){ d=d3; u=.6036+clamp((p.x-.75)/.25,0.,1.)*.25; }
  return vec2(d,u/.8536);
}

void main(){
  vec2 uv=gl_FragCoord.xy/cell;
  vec2 id=floor(uv), f=fract(uv);
  float aa=1.1/cell;

  // Two tile types, chosen per cell; the second is the mirror of the first.
  if(h21(id)<.5) f.x=1.-f.x;
  vec2 e1=elbow(f), e2=elbow(1.-f);
  float d=min(e1.x,e2.x);
  float u=e1.x<e2.x?e1.y:e2.y;
  // Flow runs top/bottom to left/right in even cells and back in odd ones,
  // which makes it continuous along every route.
  if(mod(id.x+id.y,2.)>.5) u=1.-u;

  float near=smoothstep(260.,0.,length(gl_FragCoord.xy-m));
  float patch=smoothstep(.52,.74,vn(id*.21+vec2(t*.05,-t*.03)));
  float live=max(patch,near);

  float line=smoothstep(.6/cell+aa,.6/cell,d);
  float packet=smoothstep(.2,.0,abs(fract(u-t*.42)-.5)-.07)*smoothstep(1.1/cell+aa,1.1/cell,d);

  // A measured dot at every half cell, matching the page's grid.
  vec2 g=abs(fract(uv*2.)-.5);
  float dotm=smoothstep(1.3/cell,.6/cell,length(g)/2.);

  // A via where two routes pass, on some cells.
  float via=0.;
  if(h21(id+7.3)>.8){ float rr=abs(length(f-vec2(.625))-.085); via=smoothstep(.7/cell+aa,.7/cell,rr); }

  vec3 col=pap;
  col=mix(col,ink,dotm*.1);
  col=mix(col,ink,line*(.2+near*.3));
  col=mix(col,ink,via*.5);
  col=mix(col,sig,packet*live*.95);
  gl_FragColor=vec4(col,1.);
}`;

function token(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  const v = parseInt(hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex, 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const prog = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"],
      [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);

    let raf = 0;
    let poll = 0;
    let last = 0;
    let visible = true;
    let dead = false;
    let dpr = 1;
    const mouse = [-9999, -9999];
    const loc: Record<string, WebGLUniformLocation | null> = {};

    const colours = () => {
      gl.uniform3f(loc.ink, ...token("--ink"));
      gl.uniform3f(loc.sig, ...token("--signal"));
      gl.uniform3f(loc.pap, ...token("--sheet"));
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(loc.r, canvas.width, canvas.height);
      gl.uniform1f(loc.cell, 56 * dpr);
    };
    const frame = (ms: number) => {
      raf = 0;
      if (dead || !visible || document.hidden) return;
      if (ms - last >= 32) {
        last = ms;
        gl.uniform1f(loc.t, ms / 1000);
        gl.uniform2f(loc.m, mouse[0], mouse[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        canvas.dataset.ready = "";
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && !dead) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      mouse[0] = (e.clientX - box.left) * dpr;
      mouse[1] = (box.bottom - e.clientY) * dpr;
    };

    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });

    // Where the browser can compile in the background, wait for it without blocking.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const ready = () => {
      if (dead) return;
      if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
        poll = window.setTimeout(ready, 50);
        return;
      }
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      for (const name of ["r", "t", "m", "cell", "ink", "sig", "pap"]) loc[name] = gl.getUniformLocation(prog, name);
      colours();
      size();
      watch.observe(canvas);
      window.addEventListener("resize", size);
      window.addEventListener("theme:change", colours);
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("visibilitychange", wake);
      wake();
    };
    ready();

    return () => {
      dead = true;
      window.clearTimeout(poll);
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("theme:change", colours);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", wake);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="field-canvas" />;
}
