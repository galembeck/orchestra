/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import { useAuth } from "@repo/core/hooks/services/use-auth";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Checkbox } from "@repo/ui/components/atoms/checkbox/checkbox";
import { Input } from "@repo/ui/components/atoms/input/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import z from "zod";

const signInFormSchema = z.object({
	email: z.email("Insira um e-mail válido."),
	password: z.string().min(1, "Senha é obrigatória."),
	rememberMe: z.boolean(),
});

export function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);

	const { signIn, isPending } = useAuth();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: ({ value }) => {
			signIn({ email: value.email, password: value.password });
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
										E-mail
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
											placeholder="Informe seu e-mail"
											type="email"
											value={field.state.value}
										/>
									</div>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
						name="email"
					/>

					<form.Field
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel
										className="flex items-center justify-between"
										htmlFor={field.name}
									>
										<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
											Senha
										</span>
										<Link
											className="font-jetbrains-mono font-medium text-[11px] text-foreground-primary hover:text-foreground-accent hover:underline hover:underline-offset-2"
											to="/"
										>
											Esqueci minha senha
										</Link>
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
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;

							return (
								<FieldSet>
									<FieldGroup data-slot="checkbox">
										<Field data-invalid={isInvalid} orientation="horizontal">
											<Checkbox
												aria-invalid={isInvalid}
												checked={field.state.value}
												disabled={isPending}
												id={"sign-in-form-checkbox"}
												name={field.name}
												onCheckedChange={(checked) =>
													field.handleChange(checked === true)
												}
											/>

											<FieldLabel
												className="font-inter text-[13px] text-foreground-secondary"
												htmlFor={"sign-in-form-checkbox"}
											>
												Manter conectado neste dispositivo
											</FieldLabel>
										</Field>
									</FieldGroup>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldSet>
							);
						}}
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

			<p className="mt-2 flex items-center gap-1 font-inter text-[13px] text-foreground-secondary">
				Ainda não tem conta?{" "}
				<Link
					className="flex items-center gap-1 font-semibold text-foreground-primary"
					to="/sign-up"
				>
					Cadastrar empresa <ArrowRight className="h-3.5 w-3.5" />
				</Link>
			</p>
		</div>
	);
}
