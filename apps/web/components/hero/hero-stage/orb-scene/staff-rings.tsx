"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { StaffRing } from "@/components/hero/hero-stage/orb-scene/staff-ring";

const RING_COUNT = 5;
const RING_BASE_RADIUS = 1.36;
const RING_GAP = 0.055;
const RING_PHASE_STEP = 0.9;
const ORBIT_TILT_X = 1.32;
const ORBIT_TILT_Z = -0.24;
const ORBIT_SPEED = 0.12;

const RINGS = Array.from({ length: RING_COUNT }, (_, index) => ({
  index,
  phase: index * RING_PHASE_STEP,
  radius: RING_BASE_RADIUS + index * RING_GAP,
}));

export interface StaffRingsProps {
  color: string;
}

export function StaffRings({ color }: StaffRingsProps) {
  const orbitRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.z += delta * ORBIT_SPEED;
    }
  });

  return (
    <group rotation={[ORBIT_TILT_X, 0, ORBIT_TILT_Z]}>
      <group ref={orbitRef}>
        {RINGS.map((ring) => (
          <StaffRing
            color={color}
            key={ring.index}
            phase={ring.phase}
            radius={ring.radius}
          />
        ))}
      </group>
    </group>
  );
}
