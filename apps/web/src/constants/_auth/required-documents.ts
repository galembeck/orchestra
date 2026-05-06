export const REQUIRED_DOCUMENTS = [
	{ key: "cnpjDocument", label: "Cartão CNPJ", required: true },
	{
		key: "addressProof",
		label: "Comprovante de endereço",
		required: true,
	},
	{ key: "ownerIdentity", label: "CNH ou RG do responsável", required: true },
	{
		key: "operatingLicense",
		label: "Alvará de funcionamento",
		required: false,
	},
] as const;
