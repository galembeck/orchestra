"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const RING_TUBE_RADIUS = 0.0065;
const RING_RADIAL_SEGMENTS = 8;
const RING_TUBULAR_SEGMENTS = 160;
const RING_OPACITY = 0.3;
const WOBBLE_AMPLITUDE = 0.09;
const WOBBLE_SPEED = 0.6;
const WOBBLE_Y_RATIO = 0.6;
const WOBBLE_Y_SPEED_RATIO = 0.8;

export interface StaffRingProps {
  color: string;
  phase: number;
  radius: number;
}

export function StaffRing({ color, phase, radius }: StaffRingProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    group.rotation.x =
      Math.sin(elapsed * WOBBLE_SPEED + phase) * WOBBLE_AMPLITUDE;
    group.rotation.y =
      Math.cos(elapsed * WOBBLE_SPEED * WOBBLE_Y_SPEED_RATIO + phase) *
      WOBBLE_AMPLITUDE *
      WOBBLE_Y_RATIO;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry
          args={[
            radius,
            RING_TUBE_RADIUS,
            RING_RADIAL_SEGMENTS,
            RING_TUBULAR_SEGMENTS,
          ]}
        />

        <meshBasicMaterial color={color} opacity={RING_OPACITY} transparent />
      </mesh>
    </group>
  );
}
