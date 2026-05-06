import { Logo } from "@repo/ui/components/molecules/logo/logo";
import { createFileRoute } from "@tanstack/react-router";
import { AuthVisualPanel } from "@/components/atoms/auth-visual-panel/auth-visual-panel";
import { SignInForm } from "./~components/-sign-in-form";

export const Route = createFileRoute("/_auth/_sign-in/")({
	component: SignInPage,
	head: () => ({
		meta: [{ title: "Entrar | orchestra.admin" }],
	}),
	// beforeLoad: ({ context }) => {
	// 	if (context.auth?.isAuthenticated) {
	// 		throw redirect({
	// 			to: "/panel",
	// 		});
	// 	}
	// },
});

function SignInPage() {
	return (
		<main className="flex min-h-screen">
			<div className="flex flex-1 flex-col px-5 py-10 xl:px-20 xl:py-15">
				<Logo />

				<div className="mt-4 flex flex-1 items-center justify-center text-center">
					<div className="flex w-full max-w-110 flex-col gap-8">
						<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Sistema de gerenciamento interno
						</span>

						<h1 className="font-afacad font-semibold text-[46px] text-foreground-primary tracking-[-1.2px]">
							ORCHESTRA.ADMIN
						</h1>

						<p className="font-inter text-[15px] text-foreground-secondary">
							Insira seus dados para acessar o painel e os sistemas de
							gerenciamento e controle internos da plataforma.
						</p>

						<SignInForm />
					</div>
				</div>
			</div>

			<AuthVisualPanel />
		</main>
	);
}
