import { Button } from "@repo/ui/components/atoms/button/button";
import type { LucideIcon } from "lucide-react";

interface SocialLoginButtonProps {
	icon: LucideIcon;
	onClick: () => void;
	title: string;
}

export function SocialLoginButton({
	icon: Icon,
	title,
	onClick,
}: SocialLoginButtonProps) {
	return (
		<Button
			className="relative flex w-full items-center justify-center rounded-[10px] border border-border bg-surface px-2.5 py-3.5 transition-all duration-200 hover:bg-surface-paper-soft"
			onClick={onClick}
		>
			<Icon className="absolute left-2.5 h-4.5 w-4.5 text-foreground-primary" />

			<span className="font-inter font-medium text-foreground-primary text-sm">
				{title}
			</span>
		</Button>
	);
}
