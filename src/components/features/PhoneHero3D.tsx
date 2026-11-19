import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PhoneSceneProps {
  isTouched: boolean;
}

const PhoneModel: React.FC<PhoneSceneProps> = ({ isTouched }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Subtle floating and response to user touch
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth gentle ambient floating
    meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.15 - 0.2;
    meshRef.current.rotation.x = Math.cos(t * 0.3) * 0.08 + 0.1;
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={meshRef}>
      {/* Phone chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 4.4, 0.18]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Screen Glass Bezel */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[2.05, 4.2]} />
        <meshStandardMaterial
          color={isTouched ? '#0e1d33' : '#070a13'}
          roughness={0.1}
          metalness={0.9}
          emissive={isTouched ? '#06b6d4' : '#1e1b4b'}
          emissiveIntensity={isTouched ? 0.35 : 0.08}
        />
      </mesh>

      {/* Camera cutout */}
      <mesh position={[0, 1.85, 0.105]}>
        <circleGeometry args={[0.07, 32]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* Holographic Electrostatic Field Rings */}
      <mesh position={[0, 0, 0.15]}>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <meshBasicMaterial
          color={isTouched ? '#f43f5e' : '#06b6d4'}
          transparent
          opacity={isTouched ? 0.7 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const PhoneHero3D: React.FC<PhoneSceneProps> = ({ isTouched }) => {
  return (
    <div className="relative h-[340px] w-full max-w-[340px] mx-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-4, -3, -2]} intensity={0.8} color="#818cf8" />
        <PhoneModel isTouched={isTouched} />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] text-slate-500 pointer-events-none">
        Three.js & R3F Live Viewport — Reactive to Touch State
      </div>
    </div>
  );
};
