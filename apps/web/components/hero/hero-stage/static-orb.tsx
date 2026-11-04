import { cn } from "@orchestra/ui/lib/utils";

export interface StaticOrbProps {
  className?: string;
}

export function StaticOrb({ className }: StaticOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute rounded-full bg-[radial-gradient(circle_at_34%_30%,#6F8BF0_0%,#2547D0_38%,#0D1426_100%)] shadow-[0_60px_80px_-30px_rgb(37_71_208/0.45)]",
        className
      )}
    />
  );
}
