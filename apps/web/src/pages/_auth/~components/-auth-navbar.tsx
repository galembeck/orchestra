import { Logo } from "@repo/ui/components/molecules/logo/logo";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface AuthNavbarProps {
	layout: "sign-in" | "sign-up";
}

export function AuthNavbar({ layout }: AuthNavbarProps) {
	return (
		<nav className="flex flex-row items-center justify-between lg:items-center">
			<Logo />

			{layout === "sign-in" ? (
				<Link
					className="flex items-center gap-1 font-inter font-medium text-[13px] text-foreground-secondary hover:text-foreground-secondary/90 hover:underline hover:underline-offset-4"
					to="/"
				>
					<ArrowLeft className="h-3.5 w-3.5" /> Voltar para o início
				</Link>
			) : (
				<p className="flex items-center gap-1 font-inter text-[13px] text-foreground-secondary">
					Já tem uma conta{" "}
					<Link
						className="flex items-center gap-2 font-semibold text-foreground-primary"
						to="/sign-in"
					>
						Entrar <ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</p>
			)}
		</nav>
	);
}
