/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import {
	useMyCompanies,
	useUpdateCompanyConfiguration,
} from "@repo/core/hooks/services/use-company";
import {
	COMPANY_SCHEDULE,
	COMPANY_SCHEDULE_OPTIONS,
} from "@repo/core/types/enums/company-schedule";
import {
	SERVICE_TYPE,
	SERVICE_TYPE_OPTIONS,
	type ServiceType,
} from "@repo/core/types/enums/service-type";
import {
	TEAM_SIZE,
	TEAM_SIZE_OPTIONS,
	type TeamSize,
} from "@repo/core/types/enums/team-size";
import { Badge } from "@repo/ui/components/atoms/badge/badge";
import { Button } from "@repo/ui/components/atoms/button/button";
import { IconizedInput } from "@repo/ui/components/atoms/iconized-input/iconized-input";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Briefcase,
	Calendar,
	Clock,
	Info,
	MapPin,
	Settings2,
	ShieldCheck,
	Sunrise,
	Sunset,
	TriangleAlert,
	Users,
} from "lucide-react";
import z from "zod";
import { LABEL_CLASS } from "@/constants/_auth/styles/label-class";
import { ConfigurationButton } from "./~components/-configuration-button";
import { ConfigurationCard } from "./~components/-configuration-card";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug/configuration/"
)({
	component: CompanyConfigurationPage,
	head: () => ({
		meta: [{ title: "Configuração inicial | Painel - orchestra.web" }],
	}),
});

const configSchema = z.object({
	openingHour: z
		.string({ error: "Horário de abertura é obrigatório." })
		.min(1, "Horário de abertura é obrigatório."),
	closingHour: z
		.string({ error: "Horário de encerramento é obrigatório." })
		.min(1, "Horário de encerramento é obrigatório."),
	teamSize: z.enum(TEAM_SIZE, { error: "Informe o tamanho da equipe." }),
	serviceRadius: z
		.number({ error: "Informe o raio de atendimento." })
		.int()
		.min(1, "O raio de atendimento deve ser no mínimo 1 km."),
	serviceTypes: z.array(
		z.enum(SERVICE_TYPE, { error: "Informe o(s) tipo(s) de atendimento." })
	),
	schedule: z.enum(COMPANY_SCHEDULE, {
		error: "Informe a agenda de atendimento.",
	}),
});

function CompanyConfigurationPage() {
	const navigate = useNavigate();

	const { companySlug } = Route.useParams();

	const { data: companies } = useMyCompanies();
	const company = companies?.find((c) => c.slug === companySlug);

	const { mutate: updateConfiguration, isPending } =
		useUpdateCompanyConfiguration(company?.id ?? "");

	const form = useForm({
		defaultValues: {
			openingHour: company?.openingHour,
			closingHour: company?.closingHour,
			teamSize: company?.teamSize,
			serviceRadius: company?.serviceRadius ?? (undefined as unknown as number),
			serviceTypes: company?.serviceTypes ?? [SERVICE_TYPE.CUSTOMER_LOCATION],
			schedule: company?.schedule ?? COMPANY_SCHEDULE.WEEKDAYS,
		},
		validators: { onSubmit: configSchema },
		onSubmit: ({ value }) => {
			if (!company) {
				return;
			}

			const parsed = configSchema.safeParse(value);
			if (!parsed.success) {
				return;
			}

			updateConfiguration(parsed.data, {
				onSuccess: () => {
					navigate({
						to: "/app/$companySlug",
						params: { companySlug },
					});
				},
			});
		},
	});

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3.5">
				<Badge className="flex w-fit items-center gap-1.5 bg-surface-accent-soft px-3 py-1.25 font-inter font-medium text-surface-accent text-xs">
					<Settings2 className="h-3 w-3 text-surface-accent" />
					Configuração · Etapa 2 de 3
				</Badge>

				<h1 className="font-instrument-serif text-[30px] text-foreground-primary -tracking-[0.4px]">
					Configure sua operação.
				</h1>

				<p className="font-inter text-[13px] text-foreground-secondary">
					Defina como sua empresa funciona. Essas informações permitem que
					clientes agendem seus serviços com precisão e sem fricção. Fique
					tranquilo você poderá editá-las mais tarde.
				</p>
			</div>

			<form
				id="company-configuration-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-6 lg:flex-row">
						<div className="flex flex-col gap-6">
							<ConfigurationCard
								description="Defina a janela de atendimento diária para seus serviços"
								icon={Clock}
								title="Horário de Funcionamento"
							>
								<div className="flex flex-col gap-5">
									<FieldGroup className="grid grid-cols-2 gap-3.5">
										<form.Field
											children={(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;

												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel
															className={`flex items-center gap-1 ${LABEL_CLASS}`}
															htmlFor={field.name}
														>
															<Sunrise className="h-3.5 w-3.5" />
															Abertura
														</FieldLabel>

														<IconizedInput
															aria-invalid={isInvalid}
															className="[&::-webkit-calendar-picker-indicator]:hidden"
															icon={Clock}
															id={field.name}
															name={field.name}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															type="time"
															value={field.state.value}
														/>

														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
											name="openingHour"
										/>

										<form.Field
											children={(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;

												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel
															className={`flex items-center gap-1 ${LABEL_CLASS}`}
															htmlFor={field.name}
														>
															<Sunset className="h-3.5 w-3.5" />
															Encerramento
														</FieldLabel>

														<IconizedInput
															aria-invalid={isInvalid}
															className="[&::-webkit-calendar-picker-indicator]:hidden"
															icon={Clock}
															id={field.name}
															name={field.name}
															onBlur={field.handleBlur}
															onChange={(e) =>
																field.handleChange(e.target.value)
															}
															type="time"
															value={field.state.value}
														/>

														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
											name="closingHour"
										/>
									</FieldGroup>

									<div className="flex items-start gap-2.5 rounded-[10px] bg-surface-accent-soft px-3.5 py-3">
										<Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-surface-accent" />
										<p className="font-inter text-surface-accent text-xs leading-normal">
											Horários fora desse intervalo ficam indisponíveis para
											agendamento automático.
										</p>
									</div>
								</div>
							</ConfigurationCard>

							<ConfigurationCard
								description="Capacidade de atendimento simultâneo de sua empresa"
								icon={Users}
								title="Equipe & Alcance"
							>
								<div className="flex flex-col gap-5">
									<FieldGroup className="border-border border-b pb-5">
										<form.Field
											children={(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;

												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel
															className={LABEL_CLASS}
															htmlFor={field.name}
														>
															Tamanho da equipe
														</FieldLabel>

														<div className="grid grid-cols-4 gap-2.5">
															{TEAM_SIZE_OPTIONS.map((item) => (
																<ConfigurationButton
																	icon={item.icon}
																	isSelected={field.state.value === item.value}
																	key={item.value}
																	onClick={() =>
																		field.handleChange(item.value as TeamSize)
																	}
																	title={item.label}
																	variant="compact"
																/>
															))}
														</div>

														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
											name="teamSize"
										/>
									</FieldGroup>

									<FieldGroup>
										<form.Field
											children={(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													!field.state.meta.isValid;

												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel
															className={LABEL_CLASS}
															htmlFor={field.name}
														>
															Raio de atendimento
														</FieldLabel>

														<div className="flex overflow-hidden rounded-[10px] border border-border bg-surface">
															<div className="flex flex-1 items-center gap-2.5 px-3.5 py-3">
																<MapPin className="h-4 w-4 shrink-0 text-foreground-secondary" />
																<input
																	className="flex-1 bg-transparent font-inter font-semibold text-base text-foreground-primary outline-none"
																	id={field.name}
																	max={100}
																	min={1}
																	name={field.name}
																	onBlur={field.handleBlur}
																	onChange={(e) =>
																		field.handleChange(Number(e.target.value))
																	}
																	type="number"
																	value={field.state.value ?? ""}
																/>
															</div>

															<div className="flex items-center border-border border-l bg-surface-raised px-4">
																<span className="font-inter font-semibold text-foreground-secondary text-sm">
																	km
																</span>
															</div>
														</div>

														<div className="flex flex-col gap-2">
															<input
																className="w-full accent-surface-accent"
																max={100}
																min={1}
																onChange={(e) =>
																	field.handleChange(Number(e.target.value))
																}
																type="range"
																value={field.state.value ?? 1}
															/>

															<div className="flex justify-between">
																<span className="font-inter text-foreground-tertiary text-xs">
																	1 km
																</span>
																<span className="font-inter text-foreground-tertiary text-xs">
																	50 km
																</span>
																<span className="font-inter text-foreground-tertiary text-xs">
																	100 km
																</span>
															</div>
														</div>

														{isInvalid && (
															<FieldError errors={field.state.meta.errors} />
														)}
													</Field>
												);
											}}
											name="serviceRadius"
										/>
									</FieldGroup>
								</div>
							</ConfigurationCard>
						</div>

						<div className="flex flex-col gap-6">
							<ConfigurationCard
								description="Como você atende seus clientes"
								icon={Briefcase}
								title="Tipo de Serviço"
							>
								<form.Field
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										const toggle = (value: ServiceType) => {
											const current = field.state.value as ServiceType[];
											field.handleChange(
												current.includes(value)
													? current.filter((v) => v !== value)
													: [...current, value]
											);
										};

										return (
											<Field data-invalid={isInvalid}>
												<div className="flex flex-col gap-3">
													{SERVICE_TYPE_OPTIONS.map((item) => (
														<ConfigurationButton
															description={item.description}
															icon={item.icon}
															isSelected={(
																field.state.value as ServiceType[]
															).includes(item.value)}
															key={item.value}
															onClick={() => toggle(item.value)}
															title={item.label}
														/>
													))}
												</div>

												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
									name="serviceTypes"
								/>
							</ConfigurationCard>

							<ConfigurationCard
								description="Quais dias você atende clientes"
								icon={Calendar}
								title="Agenda de Funcionamento"
							>
								<form.Field
									children={(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid;

										return (
											<Field data-invalid={isInvalid}>
												<div className="flex flex-col gap-2.5">
													{COMPANY_SCHEDULE_OPTIONS.map((item) => (
														<ConfigurationButton
															description={item.description}
															icon={item.icon}
															isSelected={field.state.value === item.value}
															key={item.value}
															onClick={() => field.handleChange(item.value)}
															title={item.label}
														/>
													))}

													{field.state.value === COMPANY_SCHEDULE.EMERGENCY && (
														<div className="flex items-start gap-2.5 rounded-[10px] bg-amber-50 px-3.5 py-2.5">
															<TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
															<p className="font-inter text-stone-600 text-xs leading-[1.4]">
																O plantão 24/7 pode gerar custos adicionais de
																operação.
															</p>
														</div>
													)}
												</div>

												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										);
									}}
									name="schedule"
								/>
							</ConfigurationCard>
						</div>
					</div>

					<div className="flex items-center justify-between border-border border-t pt-5">
						<div className="hidden items-center gap-2 text-foreground-secondary lg:flex">
							<ShieldCheck className="h-4 w-4 shrink-0" />
							<p className="font-inter text-[13px]">
								Essas configurações podem ser ajustadas a qualquer momento em
								Configurações.
							</p>
						</div>

						<div className="flex w-full items-center justify-end gap-3 lg:w-auto">
							<button
								className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-border px-4 py-3"
								onClick={() => window.history.back()}
								type="button"
							>
								<ArrowLeft className="h-4 w-4" />
								Voltar
							</button>

							<Button className="gap-2 px-7" disabled={isPending} type="submit">
								{isPending ? "Salvando..." : "Salvar e continuar"}
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
