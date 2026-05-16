/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import { Button } from "@repo/ui/components/atoms/button/button";
import { Input } from "@repo/ui/components/atoms/input/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { type ApiException, adminApi } from "@/lib/api";

const signInFormSchema = z.object({
	identifier: z
		.string()
		.min(1, "Identificador (e-mail ou matrícula) é obrigatório.")
		.refine(
			(value) => {
				const isEmail = z.email().safeParse(value).success;
				// biome-ignore lint/performance/useTopLevelRegex: not important in this context
				const isRegistration = /^\d+$/.test(value) && value.length >= 4;
				return isEmail || isRegistration;
			},
			{ message: "Insira um e-mail ou matrícula válida." }
		),
	password: z.string().min(1, "Senha é obrigatória."),
	rememberMe: z.boolean(),
});

interface SignInBody {
	identifier: string;
	password: string;
	rememberMe: boolean;
}

interface SignInResponse {
	user: { id: string; name: string; email: string };
}

export function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const { mutate: signIn, isPending } = useMutation({
		mutationFn: (data: SignInBody) =>
			adminApi.post<SignInResponse>("/auth/sign-in", data),

		onSuccess: (data) => {
			toast.success(`Bem-vindo, ${data.user.name}!`);
			navigate({ to: "/panel" });
		},

		onError: (err) => {
			const apiErr = err as ApiException;
			const message =
				apiErr.status === 401
					? "E-mail, matrícula ou senha inválidos."
					: // biome-ignore lint/style/noNestedTernary: not important in this context
						apiErr.status === 403
						? "Conta desativada. Entre em contato com o suporte."
						: "Erro ao realizar login. Tente novamente.";

			toast.error("Erro ao realizar login!", { description: message });
		},
	});

	const form = useForm({
		defaultValues: {
			identifier: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: ({ value }) => {
			signIn(value);
		},
	});

	return (
		<div>
			<form
				id="sign-in-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel
										className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]"
										htmlFor={field.name}
									>
										E-mail / Matrícula
									</FieldLabel>

									<div className="relative">
										<Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />

										<Input
											aria-invalid={isInvalid}
											className="pl-12"
											disabled={isPending}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Informe seu e-mail ou matrícula"
											value={field.state.value}
										/>
									</div>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="identifier"
					/>

					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>
										<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
											Senha
										</span>
									</FieldLabel>

									<div className="relative">
										<Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />

										<Input
											aria-invalid={isInvalid}
											className="pl-12"
											disabled={isPending}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="••••••••••"
											type={showPassword ? "text" : "password"}
											value={field.state.value}
										/>

										<button
											className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-foreground-tertiary transition-colors hover:text-foreground-tertiary/90 disabled:opacity-50"
											disabled={isPending}
											onClick={() => setShowPassword((v) => !v)}
											type="button"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="password"
					/>

					<form.Field
						children={(field) => (
							<label className="flex cursor-pointer items-center gap-2.5">
								<input
									checked={field.state.value}
									className="h-4 w-4 cursor-pointer accent-foreground-primary"
									disabled={isPending}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.checked)}
									type="checkbox"
								/>
								<span className="select-none font-inter text-[13px] text-foreground-secondary">
									Manter-me conectado por 7 dias
								</span>
							</label>
						)}
						name="rememberMe"
					/>
				</FieldGroup>
			</form>

			<Button
				className="mt-8 w-full gap-2"
				disabled={isPending}
				form="sign-in-form"
				type="submit"
			>
				{isPending ? (
					<>
						Entrando...
						<Loader2 className="h-4 w-4 animate-spin" />
					</>
				) : (
					<>
						Entrar
						<ArrowRight className="h-4 w-4" />
					</>
				)}
			</Button>
		</div>
	);
}
