"use client";

import { useTheme } from "@repo/core/providers/theme-provider";
import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--color-surface-secondary)",
					"--normal-text": "var(--color-foreground-primary)",
					"--normal-border": "var(--color-border)",
					"--border-radius": "var(--radius-toast)",
					// biome-ignore lint/suspicious/noExplicitAny: required by CSSProperties
				} as any
			}
			theme={theme as ToasterProps["theme"]}
			toastOptions={{
				classNames: {
					toast: "cn-toast",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
