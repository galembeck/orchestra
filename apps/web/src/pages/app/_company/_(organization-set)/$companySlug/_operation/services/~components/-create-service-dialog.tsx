import {
	useCreateService,
	useServiceCategories,
} from "@repo/core/hooks/services/use-services";
import type { PublicCompanyDTO } from "@repo/core/models/company.model";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Checkbox } from "@repo/ui/components/atoms/checkbox/checkbox";
import { Input } from "@repo/ui/components/atoms/input/input";
import { Label } from "@repo/ui/components/atoms/label/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/molecules/dialog/dialog";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";

interface CreateServiceDialogProps {
	company: PublicCompanyDTO;
}

interface FormState {
	budgetable: boolean;
	categoryId: string;
	price: string;
	serviceType: string;
}

const emptyForm: FormState = {
	categoryId: "",
	budgetable: false,
	serviceType: "",
	price: "",
};

export function CreateServiceDialog({ company }: CreateServiceDialogProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<1 | 2>(1);
	const [form, setForm] = useState<FormState>(emptyForm);

	const { data: categories, isLoading: isLoadingCategories } =
		useServiceCategories();
	const { mutate: create, isPending } = useCreateService(company.id);

	const isStepOneValid = useMemo(() => {
		const price = Number(form.price);
		const hasCategory = form.categoryId.length > 0;
		const hasServiceType = form.serviceType.trim().length > 0;

		if (form.budgetable) {
			return hasCategory && hasServiceType;
		}

		return hasCategory && hasServiceType && Number.isFinite(price) && price > 0;
	}, [form]);

	const reset = () => {
		setForm(emptyForm);
		setStep(1);
	};

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) {
			reset();
		}
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!isStepOneValid) {
			return;
		}

		create(
			{
				categoryId: form.categoryId,
				serviceType: form.serviceType.trim(),
				price: Number(form.price),
				budgetable: form.budgetable,
			},
			{
				onSuccess: () => handleOpenChange(false),
			}
		);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger asChild>
				<Button className="gap-2" size="sm" variant="primary">
					<Plus className="h-4 w-4" />
					Novo serviço
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{step === 1 ? "Novo serviço" : "Endereço do serviço"}
					</DialogTitle>
					<DialogDescription>
						{step === 1
							? "Informe os detalhes do serviço que deseja oferecer."
							: "Estes dados são herdados do cadastro da empresa."}
					</DialogDescription>
					<StepIndicator current={step} />
				</DialogHeader>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					{step === 1 && (
						<div className="flex flex-col gap-4">
							<Field htmlFor="company-name" label="Empresa">
								<Input
									disabled
									id="company-name"
									readOnly
									value={company.fantasyName}
								/>
							</Field>

							<Field htmlFor="category" label="Categoria do serviço">
								<select
									className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-inter text-foreground-primary text-sm outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:opacity-50"
									disabled={isLoadingCategories}
									id="category"
									onChange={(e) =>
										setForm((p) => ({ ...p, categoryId: e.target.value }))
									}
									required
									value={form.categoryId}
								>
									<option value="">Selecione uma categoria</option>
									{categories?.map((c) => (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									))}
								</select>
							</Field>

							<Field htmlFor="service-type" label="Tipo de serviço">
								<Input
									id="service-type"
									onChange={(e) =>
										setForm((p) => ({ ...p, serviceType: e.target.value }))
									}
									placeholder="Encanamento, ar-condicionado..."
									required
									value={form.serviceType}
								/>
							</Field>

							<div className="flex-1">
								<Field htmlFor="budgetable" label="Orçamento">
									<div className="flex h-10 items-center gap-2">
										<Checkbox
											checked={form.budgetable}
											id="budgetable"
											onCheckedChange={(checked: boolean) =>
												setForm((p) => ({ ...p, budgetable: !!checked }))
											}
										/>
										<Label
											className="cursor-pointer font-inter text-foreground-secondary text-xs tracking-normal"
											htmlFor="budgetable"
										>
											Esse serviço apresenta valor variável dependente do
											orçamento
										</Label>
									</div>
								</Field>
							</div>

							<Field htmlFor="price" label="Preço (R$)">
								<Input
									disabled={form.budgetable}
									id="price"
									min={0}
									onChange={(e) =>
										setForm((p) => ({ ...p, price: e.target.value }))
									}
									placeholder={form.budgetable ? "Sob orçamento" : "0,00"}
									required={!form.budgetable}
									step="0.01"
									type="number"
									value={form.budgetable ? "" : form.price}
								/>
							</Field>
						</div>
					)}

					{step === 2 && (
						<div className="flex flex-col gap-4">
							<div className="grid grid-cols-[1fr_auto] gap-3">
								<Field htmlFor="zipcode" label="CEP">
									<Input
										disabled
										id="zipcode"
										readOnly
										value={company.zipcode}
									/>
								</Field>
								<Field htmlFor="state" label="Estado">
									<Input disabled id="state" readOnly value={company.state} />
								</Field>
							</div>

							<Field htmlFor="address" label="Endereço">
								<Input disabled id="address" readOnly value={company.address} />
							</Field>

							<div className="grid grid-cols-[1fr_2fr] gap-3">
								<Field htmlFor="number" label="Número">
									<Input disabled id="number" readOnly value={company.number} />
								</Field>
								<Field htmlFor="complement" label="Complemento">
									<Input
										disabled
										id="complement"
										readOnly
										value={company.complement ?? ""}
									/>
								</Field>
							</div>

							<Field htmlFor="neighborhood" label="Bairro">
								<Input
									disabled
									id="neighborhood"
									readOnly
									value={company.neighborhood}
								/>
							</Field>

							<Field htmlFor="city" label="Cidade">
								<Input disabled id="city" readOnly value={company.city} />
							</Field>

							<p className="rounded-lg border border-border border-dashed bg-surface-paper-soft p-3 font-inter text-foreground-tertiary text-xs">
								Estas informações são obtidas do cadastro realizado da empresa.
								Para alterá-las, edite os dados na página de configurações.
							</p>
						</div>
					)}

					<DialogFooter className="pt-2">
						{step === 1 ? (
							<>
								<Button
									onClick={() => handleOpenChange(false)}
									size="sm"
									type="button"
									variant="secondary"
								>
									Cancelar
								</Button>
								<Button
									className="gap-1.5"
									disabled={!isStepOneValid}
									onClick={() => setStep(2)}
									size="sm"
									type="button"
								>
									Próximo
									<ArrowRight className="h-3.5 w-3.5" />
								</Button>
							</>
						) : (
							<>
								<Button
									className="gap-1.5"
									onClick={() => setStep(1)}
									size="sm"
									type="button"
									variant="secondary"
								>
									<ArrowLeft className="h-3.5 w-3.5" />
									Voltar
								</Button>
								<Button disabled={isPending} size="sm" type="submit">
									{isPending ? "Salvando..." : "Cadastrar serviço"}
								</Button>
							</>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function StepIndicator({ current }: { current: 1 | 2 }) {
	return (
		<div className="mt-1 flex items-center gap-2 font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
			<span
				className={
					current === 1 ? "text-foreground-primary" : "text-foreground-tertiary"
				}
			>
				1. Detalhes
			</span>
			<span aria-hidden>›</span>
			<span
				className={
					current === 2 ? "text-foreground-primary" : "text-foreground-tertiary"
				}
			>
				2. Endereço
			</span>
		</div>
	);
}

function Field({
	label,
	htmlFor,
	children,
}: {
	label: string;
	htmlFor: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label
				className="font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]"
				htmlFor={htmlFor}
			>
				{label}
			</Label>
			{children}
		</div>
	);
}
