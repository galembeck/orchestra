"use client";

import {
  TextField,
  type TextFieldProps,
} from "@orchestra/ui/components/text-field/text-field";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useCallback, useState } from "react";

export type PasswordFieldProps = Omit<TextFieldProps, "trailing" | "type"> & {
  hideLabel: string;
  showLabel: string;
};

export function PasswordField({
  hideLabel,
  showLabel,
  ...props
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible((value) => !value);
  }, []);

  const toggleLabel = isVisible ? hideLabel : showLabel;

  return (
    <TextField
      {...props}
      trailing={
        <button
          aria-label={toggleLabel}
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-ring flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
          onClick={toggleVisibility}
          title={toggleLabel}
          type="button"
        >
          {isVisible ? (
            <EyeOffIcon aria-hidden="true" className="size-4.5" />
          ) : (
            <EyeIcon aria-hidden="true" className="size-4.5" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}
