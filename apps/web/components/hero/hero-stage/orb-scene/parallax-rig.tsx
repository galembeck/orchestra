"use client";

import { useFrame } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef } from "react";
import { type Group, MathUtils } from "three";

const MAX_ROTATION_Y = 0.3;
const MAX_ROTATION_X = 0.18;
const EASING_RATE = 3;

export function ParallaxRig({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const easing = 1 - Math.exp(-delta * EASING_RATE);
    group.rotation.y = MathUtils.lerp(
      group.rotation.y,
      pointerRef.current.x * MAX_ROTATION_Y,
      easing
    );
    group.rotation.x = MathUtils.lerp(
      group.rotation.x,
      pointerRef.current.y * MAX_ROTATION_X,
      easing
    );
  });

  return <group ref={groupRef}>{children}</group>;
}
