"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

const ORB_RADIUS = 1.07;
const ORB_SEGMENTS = 96;
const ORB_POSITION = [0.06, 0.06, 0] as const;
const IDLE_ROTATION_SPEED = 0.18;
const ORB_COLOR = "#2547D0";

export function Orb() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * IDLE_ROTATION_SPEED;
    }
  });

  return (
    <mesh position={ORB_POSITION} ref={meshRef}>
      <sphereGeometry args={[ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS]} />

      <MeshDistortMaterial
        color={ORB_COLOR}
        distort={0.16}
        metalness={0.12}
        roughness={0.22}
        speed={1.2}
      />
    </mesh>
  );
}
