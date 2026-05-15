/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import { useUser } from "@repo/core/hooks/services/use-user";
import {
	ACCOUNT_TYPE,
	ACCOUNT_TYPE_OPTIONS,
	type AccountType,
} from "@repo/core/types/enums/account-type";
import {
	formatCellphone,
	formatCPF,
	removeFormat,
} from "@repo/core/utils/format-masks";
import { getPasswordStrength } from "@repo/core/utils/get-password-strength";
import { isValidCPF } from "@repo/core/utils/is-valid-masks";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Checkbox } from "@repo/ui/components/atoms/checkbox/checkbox";
import { IconizedInput } from "@repo/ui/components/atoms/iconized-input/iconized-input";
import { Input } from "@repo/ui/components/atoms/input/input";
import { PasswordInput } from "@repo/ui/components/atoms/password-input/password-input";
import { Card } from "@repo/ui/components/molecules/card/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	FileSearch,
	HelpCircle,
	ShieldCheck,
	User,
} from "lucide-react";
import z from "zod";
import { LABEL_CLASS } from "@/constants/_auth/styles/label-class";

const accountStepSchema = z
	.object({
		accountType: z.enum(ACCOUNT_TYPE).superRefine((value, ctx) => {
			if (value === ACCOUNT_TYPE.WORKER) {
				ctx.addIssue({
					code: "custom",
					message: "Profissionais entram pelo convite enviado pela empresa.",
				});
			}
		}),
		name: z.string().min(3, "Nome completo é obrigatório."),
		email: z.email("O e-mail deve ter um formato válido."),
		cellphone: z
			.string()
			.min(1, "O telefone é obrigatório.")
			.refine(
				(value) => removeFormat(value).length >= 10,
				{ message: "O telefone deve ter um formato válido." },
			),
		document: z
			.string()
			.min(1, "O documento é obrigatório.")
			.refine(
				(value) => removeFormat(value).length === 11 && isValidCPF(value),
				{ message: "O CPF deve ter um formato válido." },
			),
		password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
		confirmPassword: z.string(),
		acceptedTerms: z
			.boolean()
			.refine((v) => v, "Você deve aceitar os termos para continuar."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas devem ser iguais.",
		path: ["confirmPassword"],
	});

export type AccountStepValues = z.infer<typeof accountStepSchema>;

const SELF_SIGNUP_ACCOUNT_TYPES = ACCOUNT_TYPE_OPTIONS.filter(
	(option) => option.value !== ACCOUNT_TYPE.WORKER,
);

interface AccountStepProps {
	initialData?: AccountStepValues;
	onComplete: (data: AccountStepValues) => void;
}

export function AccountStep({ onComplete, initialData }: AccountStepProps) {
	const { checkAvailability } = useUser();

	const form = useForm({
		defaultValues: initialData || {
			accountType: ACCOUNT_TYPE.CLIENT as AccountType,
			name: "",
			email: "",
			cellphone: "",
			document: "",
			password: "",
			confirmPassword: "",
			acceptedTerms: false,
		},
		validators: {
			onSubmit: accountStepSchema,
		},
		onSubmit: ({ value }) => {
			const cleanData = {
				...value,
				cellphone: removeFormat(value.cellphone),
				document: removeFormat(value.document),
			};

			onComplete(cleanData);
		},
	});

	return (
		<Card className="p-8">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<span className={LABEL_CLASS}>Passo 1 de 4 · ~2 minutos</span>

					<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
						Vamos criar sua conta.
					</h2>

					<p className="font-inter text-[15px] text-foreground-secondary">
						Comece com o e-mail de quem vai utilizar os serviços da plataforma
						ou administrar a empresa no painel.
					</p>
				</div>

				<form
					id="sign-up-account-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							children={(field) => (
								<Field>
									<FieldLabel className={LABEL_CLASS}>Tipo de conta</FieldLabel>

									<div className="grid grid-cols-2 gap-2">
										{SELF_SIGNUP_ACCOUNT_TYPES.map(
											({ value, label, icon: Icon }) => {
												const isSelected = field.state.value === value;

												return (
													<Button
														className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-3.5 font-inter font-medium text-[13px] transition-colors ${
															isSelected
																? "border-foreground-primary bg-foreground-primary text-surface"
																: "border-border bg-surface text-foreground-primary hover:bg-surface-paper-soft"
														}`}
														key={value}
														onClick={() => field.handleChange(value)}
														type="button"
													>
														<Icon className="h-5 w-5" />

														{label}
													</Button>
												);
											}
										)}
									</div>

									<FieldDescription className="text-[11px]">
										• O tipo de conta determina as permissões e acessos
										disponíveis na plataforma, tanto para usuários que desejam
										buscar por empresas prestadoras de serviços, quanto para
										administradores do painel.
									</FieldDescription>
								</Field>
							)}
							name="accountType"
						/>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Nome completo
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											icon={User}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Seu nome completo"
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="name"
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.Field
								asyncDebounceMs={500}
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									const isChecking = field.state.meta.isValidating;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												E-mail
											</FieldLabel>

											<IconizedInput
												aria-invalid={isInvalid}
												icon={User}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="seu@email.com"
												type="email"
												value={field.state.value}
											/>

											{isChecking && (
												<FieldDescription>Verificando…</FieldDescription>
											)}

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="email"
								validators={{
									onChange: z.email("O e-mail deve ter um formato válido."),
									onChangeAsync: async ({ value }) => {
										if (!(value && z.email().safeParse(value).success)) {
											return;
										}
										const res = await checkAvailability({ email: value });
										return res.emailAvailable
											? undefined
											: "Este e-mail já está cadastrado.";
									},
								}}
							/>

							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Telefone
											</FieldLabel>

											<div className="flex">
												<div className="flex shrink-0 items-center gap-1.5 rounded-l-lg border border-border border-r-0 bg-surface-paper-soft px-3 font-inter text-[13px] text-foreground-secondary">
													<span>🇧🇷</span>

													<span>+55</span>
												</div>

												<Input
													aria-invalid={isInvalid}
													className="rounded-l-none"
													id={field.name}
													maxLength={15}
													name={field.name}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const formatted = formatCellphone(e.target.value);
														field.handleChange(formatted);
													}}
													placeholder="(11) 99999-9999"
													type="tel"
													value={field.state.value}
												/>
											</div>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="cellphone"
							/>
						</div>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Documento (CPF)
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											icon={FileSearch}
											id={field.name}
											maxLength={14}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => {
												const formatted = formatCPF(e.target.value);
												field.handleChange(formatted);
											}}
											placeholder="000.000.000-00"
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="document"
							validators={{
								onChange: ({ value }) => {
									const clean = removeFormat(value);
									if (clean.length !== 11 || !isValidCPF(value)) {
										return "O CPF deve ter um formato válido.";
									}
									return;
								},
								onChangeAsyncDebounceMs: 500,
								onChangeAsync: async ({ value }) => {
									const clean = removeFormat(value);
									if (clean.length !== 11 || !isValidCPF(value)) {
										return;
									}
									const res = await checkAvailability({ document: clean });
									return res.documentAvailable
										? undefined
										: "Este CPF já está cadastrado.";
								},
							}}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									const strength = getPasswordStrength(field.state.value);

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Senha
											</FieldLabel>

											<PasswordInput
												aria-invalid={isInvalid}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••••"
												value={field.state.value}
											/>

											{strength && !isInvalid && (
												<p
													className={`flex items-center gap-1.5 font-inter text-[12px] ${strength.colorClass}`}
												>
													<ShieldCheck className="h-3.5 w-3.5" />
													{strength.label} · {field.state.value.length}{" "}
													caracteres
												</p>
											)}

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
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
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Confirmar Senha
											</FieldLabel>

											<PasswordInput
												aria-invalid={isInvalid}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••••"
												value={field.state.value}
											/>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="confirmPassword"
							/>
						</div>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<FieldSet className="border border-border bg-surface p-3">
										<FieldGroup data-slot="checkbox">
											<Field data-invalid={isInvalid} orientation="horizontal">
												<Checkbox
													aria-invalid={isInvalid}
													checked={field.state.value}
													id="sign-up-terms"
													name={field.name}
													onCheckedChange={(checked) =>
														field.handleChange(checked === true)
													}
												/>

												<FieldLabel
													className="font-inter text-[13px] text-foreground-secondary"
													htmlFor="sign-up-terms"
												>
													<span>
														Concordo com os{" "}
														<Link
															className="text-foreground-primary underline underline-offset-2"
															to="/"
														>
															Termos de Uso
														</Link>{" "}
														e a{" "}
														<Link
															className="text-foreground-primary underline underline-offset-2"
															to="/"
														>
															Política de Privacidade
														</Link>{" "}
														da Orchestra (LGPD).
													</span>
												</FieldLabel>
											</Field>
										</FieldGroup>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</FieldSet>
								);
							}}
							name="acceptedTerms"
						/>
					</FieldGroup>
				</form>

				<div className="flex items-center justify-between">
					<Link
						className="flex items-center gap-1.5 font-inter text-[13px] text-foreground-tertiary hover:text-foreground-secondary"
						to="/"
					>
						<HelpCircle className="h-4 w-4" />
						Precisa de ajuda?
					</Link>

					<Button className="gap-2" form="sign-up-account-form" type="submit">
						Continuar{" "}
						<form.Subscribe selector={(state) => state.values.accountType}>
							{(accountType) =>
								accountType === ACCOUNT_TYPE.CLIENT
									? "para endereço"
									: "para informações"
							}
						</form.Subscribe>
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card>
	);
}
