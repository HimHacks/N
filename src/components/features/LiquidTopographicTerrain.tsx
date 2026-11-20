import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidTerrainProps {
  intensity?: number;
  isTouched?: boolean;
}

const terrainVertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uTouch;

  // Simplex-style 2D procedural noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Multi-octave harmonic liquid waves
    float elevation1 = snoise(uv * 3.5 + uTime * 0.18) * 0.45;
    float elevation2 = snoise(uv * 7.0 - uTime * 0.28) * 0.18;
    float elevation3 = sin(length(uv - vec2(0.5)) * 18.0 - uTime * 2.0) * 0.12;
    
    float totalElevation = (elevation1 + elevation2 + elevation3) * uIntensity;
    
    // Dip on touch to simulate electrostatic potential well
    if (uTouch > 0.05) {
      float dist = length(uv - vec2(0.5));
      totalElevation -= exp(-dist * dist * 12.0) * 0.65 * uTouch;
    }
    
    pos.z += totalElevation;
    vElevation = totalElevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uTouch;

  void main() {
    // Topographic contour isolines calculation
    float lineDensity = 42.0;
    float contour = fract((vElevation + 0.8) * lineDensity);
    float isLine = smoothstep(0.85, 0.95, contour);

    // Deep obsidian & electric cyan palette
    vec3 deepBase = vec3(0.02, 0.03, 0.06);
    vec3 cyanLine = vec3(0.04, 0.78, 0.92);
    vec3 indigoLine = vec3(0.39, 0.40, 0.95);
    vec3 roseWell = vec3(0.96, 0.24, 0.38);

    // Color gradient across height
    vec3 contourColor = mix(cyanLine, indigoLine, smoothstep(-0.4, 0.6, vElevation));
    
    // Localized ground shunt in red/rose on touch
    if (uTouch > 0.05) {
      float dist = length(vUv - vec2(0.5));
      float shuntInfluence = exp(-dist * dist * 14.0) * uTouch;
      contourColor = mix(contourColor, roseWell, shuntInfluence);
    }

    // Blend base with topographic glow isolines
    vec3 finalColor = mix(deepBase, contourColor, isLine * 0.85 + 0.1);
    
    // Edge vignette
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x) *
                 smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);

    gl_FragColor = vec4(finalColor * edge, 0.94);
  }
`;

const TerrainMesh: React.FC<LiquidTerrainProps> = ({ intensity = 1.0, isTouched = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uTouch: { value: 0 },
    }),
    [intensity]
  );

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
      shaderRef.current.uniforms.uIntensity.value = intensity;
      shaderRef.current.uniforms.uTouch.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uTouch.value,
        isTouched ? 1.0 : 0.0,
        0.08
      );
    }
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3.2, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[12, 10, 128, 128]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const LiquidTopographicTerrain: React.FC<LiquidTerrainProps> = ({
  intensity = 1.0,
  isTouched = false,
}) => {
  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#05070d] shadow-2xl">
      <Canvas camera={{ position: [0, -3.8, 4.2], fov: 42 }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} color="#38bdf8" />
        <TerrainMesh intensity={intensity} isTouched={isTouched} />
      </Canvas>

      {/* Topographic HUD Overlay */}
      <div className="absolute top-4 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-[#07090e]/80 px-3.5 py-1.5 font-mono text-xs text-slate-300 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Procedural Liquid Electrostatic Potential Map (GLSL)</span>
      </div>

      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[11px] text-slate-500 pointer-events-none">
        <span>Harmonic Simplex Elevation Mesh &bull; 16,384 Dynamic GPU Vertices</span>
        <span className="text-cyan-400">Contours: 42 Isolines</span>
      </div>
    </div>
  );
};
