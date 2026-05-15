import z from "zod";

export const ownerRegistrationSchema = z.object({
	name: z.string().min(3, "Nome completo é obrigatório."),
	email: z.email("O e-mail deve ter um formato válido."),
	document: z.string().length(11, "O CPF deve ter 11 dígitos."),
	cellphone: z.string().min(10, "O telefone deve ter no mínimo 10 dígitos."),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
	acceptedTerms: z.literal(true, {
		error: "Você deve aceitar os termos para continuar.",
	}),
	company: z.object({
		name: z.string().min(2, "O nome da empresa é obrigatório."),
		document: z.string().length(14, "O CNPJ deve ter 14 dígitos."),
		email: z.email("O e-mail da empresa deve ter um formato válido."),
		phone: z
			.string()
			.min(10, "O telefone deve ter no mínimo 10 dígitos.")
			.optional(),
		segment: z.enum(["RESIDENTIAL", "BUSINESS", "INDUSTRIAL"]).optional(),
	}),
});

export type OwnerRegistrationInput = z.infer<typeof ownerRegistrationSchema>;
