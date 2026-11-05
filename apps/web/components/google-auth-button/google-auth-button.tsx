import { Button } from "@orchestra/ui/components/button/button";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";

const GOOGLE_ICON_SRC = "/assets/icons/google.svg";
const GOOGLE_ICON_SIZE = 18;

export interface GoogleAuthButtonProps {
  disabled?: boolean;
  isPending?: boolean;
  label: string;
  onClick?: () => void;
}

export function GoogleAuthButton({
  disabled = false,
  isPending = false,
  label,
  onClick,
}: GoogleAuthButtonProps) {
  return (
    <Button
      aria-busy={isPending || undefined}
      className="w-full cursor-pointer"
      disabled={disabled || isPending}
      onClick={onClick}
      size="lg"
      variant="outline"
    >
      {isPending ? (
        <LoaderCircleIcon
          aria-hidden="true"
          className="size-4.5 animate-spin motion-reduce:animate-none"
        />
      ) : (
        <Image
          alt=""
          aria-hidden="true"
          height={GOOGLE_ICON_SIZE}
          src={GOOGLE_ICON_SRC}
          width={GOOGLE_ICON_SIZE}
        />
      )}

      {label}
    </Button>
  );
}
