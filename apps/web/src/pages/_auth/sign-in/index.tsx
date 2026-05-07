import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Globe } from "lucide-react";
import { AuthVisualPanel } from "@/components/atoms/auth-visual-panel/auth-visual-panel";
import { AuthNavbar } from "../~components/-auth-navbar";
import { SocialLoginButton } from "./~components/-social-login-button";
import { SignInForm } from "./~components/sign-in-form/-sign-in-form";

export const Route = createFileRoute("/_auth/sign-in/")({
	component: SignInPage,
	head: () => ({
		meta: [
			{
				title: "Entrar | orchestra.web",
			},
		],
	}),
});

function SignInPage() {
	return (
		<main className="flex min-h-screen">
			<div className="flex flex-1 flex-col px-5 py-10 xl:px-20 xl:py-[60px]">
				<AuthNavbar layout="sign-in" />

				<div className="mt-4 flex flex-1 items-center justify-center text-center">
					<div className="flex w-full max-w-[440px] flex-col gap-8">
						<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
							Bem-vindo de volta
						</span>

						<h1 className="font-instrument-serif text-[46px] text-foreground-primary -tracking-[1.2px]">
							Entrar na sua conta.
						</h1>

						<p className="font-inter text-[15px] text-foreground-secondary">
							Continue de onde parou - no app, no painel ou acompanhando seu
							próximo serviço.
						</p>

						<div className="flex flex-col gap-2.5">
							<SocialLoginButton
								icon={Globe}
								onClick={() => console.log("Google")}
								title="Continuar com o Google"
							/>

							<SocialLoginButton
								icon={Facebook}
								onClick={() => console.log("Facebook")}
								title="Continuar com o Facebook"
							/>
						</div>

						<div className="flex items-center gap-3.5">
							<div className="h-px flex-1 bg-border" />

							<span className="shrink-0 font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
								Ou com e-mail
							</span>

							<div className="h-px flex-1 bg-border" />
						</div>

						<SignInForm />
					</div>
				</div>
			</div>

			<AuthVisualPanel />
		</main>
	);
}
