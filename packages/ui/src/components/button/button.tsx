import { cn } from "@orchestra/ui/lib/utils";
import type { ComponentProps } from "react";

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium font-sans transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border text-foreground hover:bg-muted",
  primary: "bg-foreground text-background hover:bg-foreground/85",
} as const;

const sizeStyles = {
  icon: "size-9.5",
  md: "px-5 py-3 text-[15px]/4.5",
  sm: "px-3.5 py-2.25 text-[13px]/4",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

interface ButtonStyleOptions {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function buttonStyles({
  className,
  size = "md",
  variant = "primary",
}: ButtonStyleOptions = {}) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

export type ButtonProps = ComponentProps<"button"> &
  Omit<ButtonStyleOptions, "className">;

export function Button({
  className,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ className, size, variant })}
      type={type}
      {...props}
    />
  );
}

export type ButtonLinkProps = ComponentProps<"a"> &
  Omit<ButtonStyleOptions, "className">;

export function ButtonLink({
  className,
  size,
  variant,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonStyles({ className, size, variant })} {...props} />
  );
}
