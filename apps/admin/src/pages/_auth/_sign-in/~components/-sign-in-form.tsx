/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

// Import your mask and validation utilities
import { formatCPF, removeFormat } from "@repo/core/utils/format-masks";
import { isValidCPF } from "@repo/core/utils/is-valid-masks";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Input } from "@repo/ui/components/atoms/input/input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import z from "zod";

const signInFormSchema = z.object({
	identifier: z
		.string()
		.min(1, "Identificador (e-mail ou CPF) é obrigatório.")
		.refine(
			(value) => {
				const isEmail = z.email().safeParse(value).success;

				const cleanValue = removeFormat(value);
				const isCpf = cleanValue.length === 11 && isValidCPF(value);

				return isEmail || isCpf;
			},
			{
				message: "Insira um e-mail ou CPF válido.",
			}
		),
	password: z.string().min(1, "Senha é obrigatória."),
});

export function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: () => {
			// Handle sign-in logic here
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
										E-mail/CPF
									</FieldLabel>

									<div className="relative">
										<Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />

										<Input
											aria-invalid={isInvalid}
											className="pl-12"
											// disabled={isPending}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => {
												const value = e.target.value;

												// biome-ignore lint/performance/useTopLevelRegex: not important in this context
												const isEmail = /[a-zA-Z@]/.test(value);

												if (isEmail) {
													field.handleChange(value);
												} else {
													const formatted = formatCPF(value);
													field.handleChange(formatted);
												}
											}}
											placeholder="Informe seu e-mail ou CPF"
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
											// disabled={isPending}
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
											// disabled={isPending}
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
				</FieldGroup>
			</form>

			<Button
				className="mt-8 w-full gap-2"
				// disabled={isPending}
				form="sign-in-form"
				type="submit"
			>
				{/*{isPending ? (
					<>
						Entrando...
						<Loader2 className="h-4 w-4 animate-spin" />
					</>
				) : (
					<>*/}
				Entrar
				<ArrowRight className="h-4 w-4" />
				{/*</>
				)}*/}
			</Button>
		</div>
	);
}
