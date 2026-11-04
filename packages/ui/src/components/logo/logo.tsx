import { cn } from "@orchestra/ui/lib/utils";
import type { ComponentProps } from "react";

export const LOGO_MARK_SRC = "/assets/icons/logo.svg";
export const LOGO_MARK_DARK_SRC = "/assets/icons/logo-dark.svg";

export type LogoMarkProps = Omit<ComponentProps<"img">, "src"> & {
  darkSrc?: string;
  src?: string;
};

export function LogoMark({
  className,
  darkSrc = LOGO_MARK_DARK_SRC,
  src = LOGO_MARK_SRC,
  ...props
}: LogoMarkProps) {
  const imageClassName = cn("size-6.5 shrink-0 lg:size-7.5", className);

  return (
    <>
      <img
        alt=""
        aria-hidden="true"
        className={cn(imageClassName, "dark:hidden")}
        height={30}
        src={src}
        width={30}
        {...props}
      />

      <img
        alt=""
        aria-hidden="true"
        className={cn(imageClassName, "hidden dark:block")}
        height={30}
        src={darkSrc}
        width={30}
        {...props}
      />
    </>
  );
}

export type LogoProps = ComponentProps<"a">;

export function Logo({ className, href = "/", ...props }: LogoProps) {
  return (
    <a
      className={cn(
        "text-foreground inline-flex items-center gap-2.5 rounded-md lg:gap-3",
        className
      )}
      href={href}
      {...props}
    >
      <LogoMark />

      <span className="font-serif text-2xl/7 tracking-[-0.01em] lg:text-[28px]/8">
        Orchestra
      </span>
    </a>
  );
}
