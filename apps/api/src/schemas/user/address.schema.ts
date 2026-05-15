import z from "zod";

export const addressSchema = z.object({
	zipcode: z.string().length(8, "O CEP deve ter 8 dígitos."),
	address: z.string().min(1, "O endereço é obrigatório."),
	number: z.string().min(1, "O número é obrigatório."),
	complement: z.string().optional(),
	neighborhood: z.string().min(1, "O bairro é obrigatório."),
	city: z.string().min(1, "A cidade é obrigatória."),
	state: z.string().length(2, "O estado deve ter 2 caracteres."),
});

export type AddressInput = z.infer<typeof addressSchema>;
