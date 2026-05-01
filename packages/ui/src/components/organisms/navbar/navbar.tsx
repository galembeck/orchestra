import { navLinks } from "@repo/core/constants/nav-links";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, Menu, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../../atoms/button/button";
import { ThemeToggle } from "../../atoms/theme-toggle/theme-toggle";
import { Logo } from "../../molecules/logo/logo";

export interface NavbarProps extends ComponentProps<"header"> {}

export function Navbar({ className, ...props }: NavbarProps) {
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false);

	return (
		<header
			className={twMerge("w-full bg-surface", className)}
			data-slot="navbar"
			{...props}
		>
			<div className="flex items-center justify-between px-5 py-4 lg:px-20 lg:py-6">
				<Logo />

				<nav className="hidden items-center gap-9 lg:flex">
					{navLinks.map((link) => (
						<Link
							className="font-afacad font-medium text-foreground-secondary [&.active]:text-foreground-primary"
							key={link.label}
							to={link.to}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<div className="hidden items-center gap-3.5 lg:flex">
						<Link
							className="flex items-center gap-1 font-afacad font-medium text-foreground-primary"
							to="/sign-in"
						>
							Entrar
							<LogIn className="h-4 w-4" />
						</Link>
						<Button
							className="px-3 py-3 font-afacad"
							onClick={() => navigate({ to: "/sign-up" })}
						>
							Cadastrar empresa
						</Button>
					</div>

					<ThemeToggle />

					<button
						aria-expanded={isOpen}
						aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
						className="cursor-pointer text-foreground-primary lg:hidden"
						onClick={() => setIsOpen((prev) => !prev)}
						type="button"
					>
						{isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="flex flex-col gap-6 border-border border-t px-5 pb-6 lg:hidden">
					<nav className="flex flex-col gap-4 pt-5">
						{navLinks.map((link) => (
							<Link
								className="font-afacad font-medium text-foreground-secondary [&.active]:text-foreground-primary"
								key={link.label}
								onClick={() => setIsOpen(false)}
								to={link.to}
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex flex-col gap-3">
						<Button
							className="w-full font-afacad text-base"
							onClick={() => {
								setIsOpen(false);
								navigate({ to: "/sign-up" });
							}}
						>
							Cadastrar empresa
						</Button>
						<Link
							className="text-center font-afacad font-medium text-foreground-primary"
							onClick={() => setIsOpen(false)}
							to="/sign-in"
						>
							Entrar
						</Link>
					</div>
				</div>
			)}
		</header>
	);
}
