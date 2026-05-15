import z from "zod";
import { addressSchema } from "./address.schema.js";

export const clientRegistrationSchema = z.object({
	name: z.string().min(3, "Nome completo é obrigatório."),
	email: z.email("O e-mail deve ter um formato válido."),
	document: z.string().length(11, "O CPF deve ter 11 dígitos."),
	cellphone: z.string().min(10, "O telefone deve ter no mínimo 10 dígitos."),
	password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
	acceptedTerms: z.literal(true, {
		error: "Você deve aceitar os termos para continuar.",
	}),
	address: addressSchema,
});

export type ClientRegistrationInput = z.infer<typeof clientRegistrationSchema>;
