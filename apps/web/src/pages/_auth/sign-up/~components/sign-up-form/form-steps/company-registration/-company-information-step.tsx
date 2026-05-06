/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import {
	SEGMENT,
	SEGMENT_OPTIONS,
	type Segment,
} from "@repo/core/types/enums/segment";
import { formatCNPJ, removeFormat } from "@repo/core/utils/format-masks";
import { isValidCNPJ } from "@repo/core/utils/is-valid-masks";
import { Button } from "@repo/ui/components/atoms/button/button";
import { IconizedInput } from "@repo/ui/components/atoms/iconized-input/iconized-input";
import { Card } from "@repo/ui/components/molecules/card/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/components/molecules/field/field";
import { useForm } from "@tanstack/react-form";
import {
	ArrowLeft,
	ArrowRight,
	CircleCheck,
	CircleX,
	Contact,
	FileSearch,
	Vote,
} from "lucide-react";
import z from "zod";
import { LABEL_CLASS } from "@/constants/_auth/styles/label-class";

const companyInformationStepSchema = z.object({
	segment: z.enum(SEGMENT),
	cnpj: z
		.string()
		.min(1, "O CNPJ é obrigatório.")
		.refine(
			(value) => {
				const cleanCNPJ = removeFormat(value);
				return cleanCNPJ.length === 14 && isValidCNPJ(value);
			},
			{
				message: "O CNPJ deve ter um formato válido.",
			}
		),
	socialReason: z.string().min(1, "A razão social é obrigatória."),
	fantasyName: z.string().min(1, "O nome fantasia é obrigatório."),
});

export type CompanyInformationStepValues = z.infer<
	typeof companyInformationStepSchema
>;

interface CompanyInformationStepProps {
	initialData?: CompanyInformationStepValues;
	onBack: (partialData: CompanyInformationStepValues) => void;
	onComplete: (data: CompanyInformationStepValues) => void;
}

export function CompanyInformationStep({
	onComplete,
	onBack,
	initialData,
}: CompanyInformationStepProps) {
	const form = useForm({
		defaultValues: initialData || {
			segment: SEGMENT.RESIDENTIAL as Segment,
			cnpj: "",
			socialReason: "",
			fantasyName: "",
		},
		validators: { onSubmit: companyInformationStepSchema },
		onSubmit: ({ value }) => {
			const cleanData = {
				...value,
				cnpj: removeFormat(value.cnpj),
			};

			onComplete(cleanData);
		},
	});

	return (
		<Card className="p-8">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<span className={LABEL_CLASS}>Passo 2 de 4 · ~5 minutos</span>

					<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
						Sobre a empresa.
					</h2>

					<p className="font-inter text-[15px] text-foreground-secondary">
						Vamos puxar os dados da Receita pelo CNPJ. Confira e ajuste o que
						precisar.
					</p>
				</div>

				<form
					id="sign-up-company-information-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							children={(field) => (
								<Field>
									<FieldLabel className={LABEL_CLASS}>
										Segmento principal
									</FieldLabel>

									<div className="grid grid-cols-3 gap-2">
										{SEGMENT_OPTIONS.map(({ value, label, icon: Icon }) => {
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
										})}
									</div>
								</Field>
							)}
							name="segment"
						/>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											CNPJ
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											icon={FileSearch}
											id={field.name}
											maxLength={18}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => {
												const formatted = formatCNPJ(e.target.value);
												field.handleChange(formatted);
											}}
											placeholder="00.000.000/0000-00"
											value={field.state.value}
										>
											{field.state.value.length &&
											isValidCNPJ(field.state.value) ? (
												<span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 font-jetbrains-mono font-semibold text-[11px] text-success">
													<CircleCheck className="h-3.5 w-3.5" />
													Validado na Receite
												</span>
											) : (
												<span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 font-jetbrains-mono font-semibold text-[11px] text-danger">
													<CircleX className="h-3.5 w-3.5" />
													CNPJ inválido
												</span>
											)}
										</IconizedInput>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="cnpj"
						/>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Razão social
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											icon={Vote}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Orchestra LTDA."
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="socialReason"
						/>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Nome fantasia — como aparece na busca
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											icon={Contact}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Orchestra"
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="fantasyName"
						/>
					</FieldGroup>
				</form>

				<div className="flex items-center justify-between">
					<Button
						className="gap-2"
						onClick={() => onBack(form.state.values)}
						type="button"
						variant="secondary"
					>
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Button>

					<Button
						className="gap-2"
						form="sign-up-company-information-form"
						type="submit"
					>
						Continuar para endereço
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card>
	);
}
