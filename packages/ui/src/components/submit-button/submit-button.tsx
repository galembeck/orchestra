import {
  Button,
  type ButtonProps,
} from "@orchestra/ui/components/button/button";
import { cn } from "@orchestra/ui/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  isPending?: boolean;
  pendingLabel: string;
};

export function SubmitButton({
  children,
  className,
  disabled,
  isPending = false,
  pendingLabel,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      aria-busy={isPending || undefined}
      className={cn("cursor-pointer", className)}
      disabled={disabled || isPending}
      type="submit"
      {...props}
    >
      {isPending ? (
        <>
          <LoaderCircleIcon
            aria-hidden="true"
            className="size-4 animate-spin motion-reduce:animate-none"
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
