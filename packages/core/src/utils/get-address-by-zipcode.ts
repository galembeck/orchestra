import { toast } from "sonner";
import type { ZipcodeAddressResponseDTO } from "../models/commom/address.js";

export async function getAddressByZipcode(
	zipcode: string
): Promise<ZipcodeAddressResponseDTO | null> {
	if (zipcode.length !== 8) {
		return null;
	}

	try {
		const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
		const data = await response.json();

		if (!data.erro) {
			return data as ZipcodeAddressResponseDTO;
		}

		toast.error("CEP não encontrado.", {
			description: "Verifique o número digitado e tente novamente.",
		});
		return null;

		// biome-ignore lint/correctness/noUnusedVariables: not required...
		// biome-ignore lint/complexity/noUselessCatchBinding: not required...
	} catch (error) {
		toast.error("Ocorreu um erro ao buscar o endereço pelo CEP.", {
			description: "Tente novamente mais tarde.",
		});
		return null;
	}
}
