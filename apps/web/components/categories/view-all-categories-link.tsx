import { cn } from "@orchestra/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";

export interface ViewAllCategoriesLinkProps {
  className?: string;
  href: string;
  label: string;
  variant: "button" | "underline";
}

export function ViewAllCategoriesLink({
  className,
  href,
  label,
  variant,
}: ViewAllCategoriesLinkProps) {
  return (
    <a
      className={cn(
        "text-foreground focus-visible:outline-ring flex shrink-0 items-center gap-2 text-[15px]/4.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
        variant === "underline"
          ? "border-foreground hover:text-primary hover:border-primary border-b pb-2.5"
          : "border-input hover:bg-muted justify-center rounded-full border p-3.75",
        className
      )}
      href={href}
    >
      {label}

      <ArrowRightIcon aria-hidden="true" className="size-3.5" />
    </a>
  );
}
