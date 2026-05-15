/** biome-ignore-all lint/correctness/noChildrenProp: required by field component */

import type { ZipcodeAddressResponseDTO } from "@repo/core/models/commom/address.model";
import { formatCEP, removeFormat } from "@repo/core/utils/format-masks";
import { getAddressByZipcode } from "@repo/core/utils/get-address-by-zipcode";
import { isValidCEP } from "@repo/core/utils/is-valid-masks";
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
	HelpCircle,
	ListOrdered,
	Loader2,
	Locate,
	// biome-ignore lint/suspicious/noShadowRestrictedNames: required by @lucide-react
	Map,
	MapPin,
	MapPinned,
	Satellite,
	Search,
} from "lucide-react";
import z from "zod";
import { LABEL_CLASS } from "@/constants/_auth/styles/label-class";

const clientAddressStepSchema = z.object({
	zipcode: z
		.string()
		.min(1, "O CEP deve ter 8 dígitos.")
		.refine(
			(value) => removeFormat(value).length === 8 && isValidCEP(value),
			{ message: "O CEP deve ter um formato válido." },
		),
	address: z.string().min(1, "O endereço é obrigatório."),
	number: z.string().min(1, "O número é obrigatório."),
	complement: z.string().optional(),
	neighborhood: z.string().min(1, "O bairro é obrigatório."),
	city: z.string().min(1, "A cidade é obrigatória."),
	state: z.string().min(1, "O estado é obrigatório."),
});

export type ClientAddressStepValues = z.infer<typeof clientAddressStepSchema>;

interface ClientAddressStepProps {
	initialData?: ClientAddressStepValues;
	isPending: boolean;
	onBack: (partialData: ClientAddressStepValues) => void;
	onComplete: (data: ClientAddressStepValues) => void;
}

export function ClientAddressStep({
	onComplete,
	onBack,
	initialData,
	isPending,
}: ClientAddressStepProps) {
	const form = useForm({
		defaultValues: initialData || {
			zipcode: "",
			address: "",
			number: "",
			complement: "",
			neighborhood: "",
			city: "",
			state: "",
		},
		validators: {
			onSubmit: clientAddressStepSchema,
		},
		onSubmit: ({ value }) => {
			onComplete(value);
		},
	});

	const handleSearchAddress = async (zipcode: string) => {
		const cleanZipcode = removeFormat(zipcode);
		if (cleanZipcode.length !== 8) {
			return;
		}

		const addressData = (await getAddressByZipcode(
			cleanZipcode
		)) as unknown as ZipcodeAddressResponseDTO;

		if (addressData && !addressData.erro) {
			form.setFieldValue("address", addressData.logradouro);
			form.setFieldValue("neighborhood", addressData.bairro);
			form.setFieldValue("city", addressData.localidade);
			form.setFieldValue("state", addressData.uf);

			setTimeout(() => {
				document.getElementById("number")?.focus();
			}, 100);
		}
	};

	return (
		<Card className="p-8">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<span className={LABEL_CLASS}>Passo 2 de 2 · ~1 minuto</span>

					<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
						Seu endereço.
					</h2>

					<p className="font-inter text-[15px] text-foreground-secondary">
						Nos informe seu endereço para que possamos localizar as melhores
						empresas disponíveis próximas à sua localização.
					</p>
				</div>

				<form
					id="sign-up-client-address-form"
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
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											CEP
										</FieldLabel>

										<div className="grid w-full grid-cols-3 items-center gap-2">
											<div className="col-span-2">
												<IconizedInput
													aria-invalid={isInvalid}
													icon={Locate}
													id={field.name}
													maxLength={14}
													name={field.name}
													onBlur={() => {
														field.handleBlur();
														handleSearchAddress(field.state.value);
													}}
													onChange={(e) => {
														const formatted = formatCEP(e.target.value);
														field.handleChange(formatted);
													}}
													placeholder="00000-000"
													value={field.state.value}
												/>
											</div>

											<Button
												className="col-span-1 flex items-center gap-2 py-3"
												onClick={() => handleSearchAddress(field.state.value)}
												type="button"
											>
												<Search className="h-3.5 w-3.5 text-foreground-inverse" />
												Buscar
											</Button>
										</div>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="zipcode"
						/>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Endereço
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											disabled
											icon={MapPin}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Endereço"
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="address"
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Número
											</FieldLabel>

											<IconizedInput
												aria-invalid={isInvalid}
												icon={ListOrdered}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Número"
												value={field.state.value}
											/>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="number"
							/>

							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel
												className={`${LABEL_CLASS} flex items-center gap-2`}
												htmlFor={field.name}
											>
												Complemento
												<HelpCircle className="h-3.5 w-3.5 text-foreground-tertiary" />
											</FieldLabel>

											<IconizedInput
												aria-invalid={isInvalid}
												icon={HelpCircle}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Complemento"
												value={field.state.value}
											/>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="complement"
							/>
						</div>

						<form.Field
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
											Bairro
										</FieldLabel>

										<IconizedInput
											aria-invalid={isInvalid}
											disabled
											icon={Map}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Bairro"
											value={field.state.value}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
							name="neighborhood"
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Cidade
											</FieldLabel>

											<IconizedInput
												aria-invalid={isInvalid}
												disabled
												icon={MapPinned}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Cidade"
												value={field.state.value}
											/>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="city"
							/>

							<form.Field
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel className={LABEL_CLASS} htmlFor={field.name}>
												Estado
											</FieldLabel>

											<IconizedInput
												aria-invalid={isInvalid}
												disabled
												icon={Satellite}
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Estado"
												value={field.state.value}
											/>

											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
								name="state"
							/>
						</div>
					</FieldGroup>
				</form>

				<div className="flex items-center justify-between">
					<Button
						className="flex items-center gap-2"
						disabled={isPending}
						onClick={() => onBack(form.state.values as ClientAddressStepValues)}
						type="button"
						variant="secondary"
					>
						<ArrowLeft className="h-3.5 w-3.5 text-foreground-primary" />
						Voltar
					</Button>

					<Button
						className="gap-2"
						disabled={isPending}
						form="sign-up-client-address-form"
						type="submit"
					>
						{isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Cadastrando
							</span>
						) : (
							<span className="flex items-center gap-2">
								Cadastrar
								<ArrowRight className="h-4 w-4" />
							</span>
						)}
					</Button>
				</div>
			</div>
		</Card>
	);
}
