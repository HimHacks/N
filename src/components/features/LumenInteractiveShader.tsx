import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface LumenInteractiveShaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const VERT_SHADER = `
attribute vec2 position;
varying vec2 v;
void main(){
  v = position;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Exact upstream GLSL extracted from https://rbp-shader-template.vercel.app/
const FRAG_SHADER = `
precision mediump float;
varying vec2 v;
uniform float t;
uniform vec2 r;
uniform vec2 c;
uniform float ci;

uniform vec3 u_pal_base;
uniform vec3 u_pal_warm;
uniform vec3 u_pal_mid;
uniform vec3 u_pal_cool;
uniform vec3 u_pal_cursor;
uniform vec3 u_pal_rgScale;
uniform float u_brightness;

float h(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float n(vec2 u){
  vec2 i = floor(u);
  vec2 f = fract(u);
  f = f * f * (3.0 - 2.0 * f);
  float a = h(i);
  float b = h(i + vec2(1.0, 0.0));
  float c = h(i + vec2(0.0, 1.0));
  float d = h(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float m(vec2 u){
  return (n(u) * 0.5 + n(u * 2.0) * 0.25) * 1.06667;
}

void main(){
  vec2 uv = (v * 0.5 + 0.5) * r / r.x;

  vec2 cn = c / r.x;
  vec2 toC = uv - cn;
  float dC = length(toC);
  float fall = exp(-dC * 9.0) * ci;

  vec2 sh = vec2(
    n(uv * 6.0 + vec2(t * 0.9, 0.0)),
    n(uv * 6.0 + vec2(0.0, t * 1.1))
  ) - 0.5;
  vec2 disp = sh * fall * 0.55;

  uv = uv * 5.0 + disp * 5.0;

  vec2 d1 = vec2( 0.18,  0.07) * t;
  vec2 d2 = vec2(-0.13,  0.21) * t;
  vec2 d3 = vec2( 0.09, -0.16) * t;

  float a = m(uv + d1);
  vec3 col = mix(u_pal_base, u_pal_warm, a * 2.5);

  float b = m(uv + a * 2.4 + d2);
  col = mix(col, u_pal_mid, b * 1.5);

  float dd = m(uv + b * 3.5 + d3);
  col = mix(col, u_pal_cool, dd);

  col += u_pal_cursor * fall;

  col *= u_pal_rgScale;
  gl_FragColor = vec4(col * u_brightness, 1.0);
}
`;

export const LumenInteractiveShader: React.FC<LumenInteractiveShaderProps> = ({
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use exact upstream OGL Renderer
    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Exact upstream geometry: Triangle
    const geometry = new Triangle(gl);

    // Calibrated vibrant green contrast matching user specifications:
    // Pink -> Deep Emerald [0.04, 0.75, 0.45]
    // Light Blue -> Mint/Emerald [0.05, 0.65, 0.35]
    // Purple -> Biscotti Cream [0.88, 0.82, 0.65]
    // Orange-yellowish -> Graphite [0.12, 0.18, 0.15]
    // Base: Deep dark green forest [0.015, 0.08, 0.045]
    const program = new Program(gl, {
      vertex: VERT_SHADER,
      fragment: FRAG_SHADER,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        t: { value: 0 },
        r: { value: [1, 1] },
        c: { value: [0, 0] },
        ci: { value: 0 },
        u_pal_base: { value: [0.015, 0.08, 0.045] },
        u_pal_warm: { value: [0.04, 0.75, 0.45] },
        u_pal_mid: { value: [0.88, 0.82, 0.65] },
        u_pal_cool: { value: [0.05, 0.65, 0.35] },
        u_pal_cursor: { value: [0.12, 0.45, 0.35] },
        u_pal_rgScale: { value: [1.0, 1.0, 1.0] },
        u_brightness: { value: 2.5 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Resize handling matching upstream
    let resizeReq = 0;
    let lastW = 0;
    let lastH = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;
        renderer.setSize(w, h);
        program.uniforms.r.value[0] = canvas.width;
        program.uniforms.r.value[1] = canvas.height;
        renderer.render({ scene: mesh });
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => {
      if (!resizeReq) {
        resizeReq = requestAnimationFrame(() => {
          resizeReq = 0;
          handleResize();
        });
      }
    });
    resizeObserver.observe(container);

    // Pointer tracking matching upstream
    let k = [0, 0];
    let M = [0, 0];
    let T = 0;
    let E = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        T = 0;
        return;
      }
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      k[0] = x;
      k[1] = canvas.height - y;
      T = 1;
    };

    const handlePointerLeave = () => {
      T = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    // 60fps delta-timed animation loop from upstream
    let animId = 0;
    const N = performance.now();
    let P = N;
    const R = 1000 / 60;

    const frameLoop = () => {
      animId = requestAnimationFrame(frameLoop);
      const now = performance.now();
      const dt = now - P;
      if (dt < R - 1) return;
      P = now - (dt % R);

      const pointerFactor = 1 - Math.pow(0.88, dt / R);
      M[0] += (k[0] - M[0]) * pointerFactor;
      M[1] += (k[1] - M[1]) * pointerFactor;

      const intensityFactor = 1 - Math.pow(0.94, dt / R);
      E += (T - E) * intensityFactor;

      program.uniforms.t.value = (now - N) * 0.001;
      program.uniforms.c.value[0] = M[0];
      program.uniforms.c.value[1] = M[1];
      program.uniforms.ci.value = E;

      renderer.render({ scene: mesh });
    };

    animId = requestAnimationFrame(frameLoop);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
        animId = 0;
      } else if (!animId) {
        P = performance.now();
        animId = requestAnimationFrame(frameLoop);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(resizeReq);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{
        ...style,
      }}
    />
  );
};

export default LumenInteractiveShader;
