"use client";

import { useTheme } from "@orchestra/shared/hooks/use-theme";
import { Canvas } from "@react-three/fiber";
import { Orb } from "@/components/hero/hero-stage/orb-scene/orb";
import { ParallaxRig } from "@/components/hero/hero-stage/orb-scene/parallax-rig";
import { StaffRings } from "@/components/hero/hero-stage/orb-scene/staff-rings";

const CAMERA = { fov: 35, position: [0, 0, 6] as [number, number, number] };
const DEVICE_PIXEL_RATIO: [number, number] = [1, 2];
const GL_OPTIONS = {
  alpha: true,
  antialias: true,
  powerPreference: "low-power",
} as const;

const RING_COLORS = {
  dark: "#8FA6FF",
  light: "#0D1426",
} as const;

export interface OrbSceneProps {
  className?: string;
  onReady?: () => void;
}

export function OrbScene({ className, onReady }: OrbSceneProps) {
  const { theme } = useTheme();
  const ringColor = RING_COLORS[theme];

  return (
    <div aria-hidden="true" className={className}>
      <Canvas
        camera={CAMERA}
        dpr={DEVICE_PIXEL_RATIO}
        gl={GL_OPTIONS}
        onCreated={onReady}
      >
        <ambientLight intensity={0.55} />

        <directionalLight
          color="#C9D3FF"
          intensity={2.4}
          position={[-3, 4, 5]}
        />

        <pointLight color="#5B7BFF" intensity={8} position={[3, -2, -2]} />

        <ParallaxRig>
          <Orb />

          <StaffRings color={ringColor} />
        </ParallaxRig>
      </Canvas>
    </div>
  );
}
