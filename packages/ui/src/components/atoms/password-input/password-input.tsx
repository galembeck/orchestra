import { Input } from "@repo/ui/components/atoms/input/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
	const [show, setShow] = useState(false);

	return (
		<div className="relative">
			<Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />

			<Input
				{...props}
				className={`pr-10 pl-12 ${className ?? ""}`}
				type={show ? "text" : "password"}
			/>

			<button
				className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-foreground-tertiary transition-colors hover:text-foreground-tertiary/90"
				onClick={() => setShow((v) => !v)}
				type="button"
			>
				{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	);
}
