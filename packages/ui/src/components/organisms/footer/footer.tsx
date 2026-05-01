import { Instagram, Linkedin } from "lucide-react";
import type { ComponentProps } from "react";
import { Logo } from "../../molecules/logo/logo";

export interface FooterProps extends ComponentProps<"footer"> {}

const NAV_COLUMNS = [
	{
		title: "PRODUTO",
		links: ["Como funciona", "Para empresas", "Categorias", "Preços"],
	},
	{
		title: "EMPRESA",
		links: ["Sobre nós", "Imprensa", "Carreiras"],
	},
	{
		title: "SUPORTE",
		links: ["Central de ajuda", "Termos · LGPD", "Contato"],
	},
] as const;

export function Footer({ className, ...props }: FooterProps) {
	return (
		<footer className="w-full bg-surface-navy" data-slot="footer" {...props}>
			<div className="flex flex-col gap-12 px-5 py-10 lg:px-20 lg:py-14">
				<div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
					<article className="flex flex-col gap-4 lg:max-w-xs">
						<Logo className="text-foreground-inverse" />

						<p className="font-inter text-foreground-inverse-muted text-sm leading-relaxed">
							Plataforma brasileira para serviços residenciais, empresariais e
							industriais — do toque ao pago.
						</p>
					</article>

					<nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
						{NAV_COLUMNS.map((col) => (
							<div className="flex flex-col gap-4" key={col.title}>
								<span className="font-inter font-semibold text-foreground-inverse text-xs uppercase tracking-widest">
									{col.title}
								</span>

								<ul className="flex flex-col gap-3">
									{col.links.map((link) => (
										<li key={link}>
											<a
												className="font-inter text-foreground-inverse-muted text-sm transition-colors hover:text-foreground-inverse"
												href="/"
											>
												{link}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>

				<div className="flex flex-col items-start gap-4 border-foreground-inverse-muted/20 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="font-inter text-foreground-inverse-muted text-xs">
						© 2024 ORCHESTRA SERVIÇOS LTDA · CNPJ 00.000.000/0001-00
					</p>

					<div className="flex items-center gap-3">
						<a
							aria-label="Instagram"
							className="text-foreground-inverse-muted transition-colors hover:text-foreground-inverse"
							href="/"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Instagram className="h-5 w-5" />
						</a>
						<a
							aria-label="LinkedIn"
							className="text-foreground-inverse-muted transition-colors hover:text-foreground-inverse"
							href="/"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Linkedin className="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
