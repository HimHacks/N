import React, { useEffect, useRef } from 'react';

export interface LumenInteractiveShaderProps {
  className?: string;
  style?: React.CSSProperties;
}

// User specified exact color palette translations:
// Pink -> Deep Emerald: #043e2e / [0.016, 0.243, 0.180]
// Light Blue -> Emerald: #059669 / [0.020, 0.588, 0.412]
// Purple -> Biscotti Cream: #eed9c4 / [0.933, 0.851, 0.769]
// Orange-yellowish -> Graphite Enamel: #242b2e / [0.141, 0.169, 0.180]
// Orange -> Mint Lacquer: #4ade80 / [0.290, 0.870, 0.500]

const VERT_SHADER = `
attribute vec2 position;
varying vec2 v;
void main() {
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    // Helper to compile shaders
    const createShader = (glCtx: WebGLRenderingContext, type: number, src: string) => {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.error('Shader compile error:', glCtx.getShaderInfoLog(s));
        glCtx.deleteShader(s);
        return null;
      }
      return s;
    };

    const vert = createShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen quad geometry
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const u_t = gl.getUniformLocation(program, 't');
    const u_r = gl.getUniformLocation(program, 'r');
    const u_c = gl.getUniformLocation(program, 'c');
    const u_ci = gl.getUniformLocation(program, 'ci');
    const u_pal_base = gl.getUniformLocation(program, 'u_pal_base');
    const u_pal_warm = gl.getUniformLocation(program, 'u_pal_warm');
    const u_pal_mid = gl.getUniformLocation(program, 'u_pal_mid');
    const u_pal_cool = gl.getUniformLocation(program, 'u_pal_cool');
    const u_pal_cursor = gl.getUniformLocation(program, 'u_pal_cursor');
    const u_pal_rgScale = gl.getUniformLocation(program, 'u_pal_rgScale');
    const u_brightness = gl.getUniformLocation(program, 'u_brightness');

    // Set colors matching user specification:
    // Pink -> Deep Emerald: [0.016, 0.243, 0.180]
    // Purple -> Biscotti Cream: [0.933, 0.851, 0.769]
    // Orange-yellowish -> Graphite Enamel: [0.141, 0.169, 0.180]
    // Orange -> Mint Lacquer: [0.290, 0.870, 0.500]
    // Cursor glow (Light Blue -> Emerald): [0.020, 0.588, 0.412]
    gl.uniform3f(u_pal_base, 0.016, 0.243, 0.180);   // Deep Emerald
    gl.uniform3f(u_pal_warm, 0.933, 0.851, 0.769);   // Biscotti Cream
    gl.uniform3f(u_pal_mid, 0.141, 0.169, 0.180);    // Graphite Enamel
    gl.uniform3f(u_pal_cool, 0.290, 0.870, 0.500);   // Mint Lacquer
    gl.uniform3f(u_pal_cursor, 0.020, 0.588, 0.412); // Emerald
    gl.uniform3f(u_pal_rgScale, 1.0, 1.0, 1.0);
    gl.uniform1f(u_brightness, 1.08);

    // Interactive state (cursor tracking & fluid wake)
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let targetIntensity = 0.0;
    let currentIntensity = 0.0;
    let lastMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY; // Flip Y for WebGL
      targetIntensity = 1.0;
      lastMoveTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = window.innerHeight - e.touches[0].clientY;
        targetIntensity = 1.0;
        lastMoveTime = performance.now();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let animId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.0006; // Calm natural fluid flow

      // Decay cursor interaction smoothly
      if (now - lastMoveTime > 120) {
        targetIntensity = 0.0;
      }
      currentIntensity += (targetIntensity - currentIntensity) * 0.06;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      gl.uniform1f(u_t, elapsed);
      gl.uniform2f(u_r, canvas.width, canvas.height);
      gl.uniform2f(u_c, mouseX * dpr, mouseY * dpr);
      gl.uniform1f(u_ci, currentIntensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block ${className}`}
      style={{
        ...style,
      }}
    />
  );
};

export default LumenInteractiveShader;
