import { createFileRoute } from "@tanstack/react-router";
import { AuthVisualPanel } from "@/components/atoms/auth-visual-panel/auth-visual-panel";
import { AuthNavbar } from "../~components/-auth-navbar";
import { SignUpForm } from "./~components/sign-up-form/-sign-up-form";

export const Route = createFileRoute("/_auth/sign-up/")({
	component: SignUpPage,
	head: () => ({
		meta: [{ title: "Cadastrar empresa | orchestra.web" }],
	}),
});

function SignUpPage() {
	return (
		<main className="flex min-h-screen">
			<AuthVisualPanel />

			<div className="flex flex-1 flex-col px-5 py-10 xl:px-20 xl:py-[60px]">
				<AuthNavbar layout="sign-up" />

				<div className="mt-8 flex flex-1 items-center justify-center">
					<div className="w-full max-w-[560px] pb-10">
						<SignUpForm />
					</div>
				</div>
			</div>
		</main>
	);
}
