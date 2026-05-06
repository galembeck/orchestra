export interface AddressDTO {
	address: string;
	city: string;
	complement?: string;
	neighborhood: string;
	number: string;
	state: string;
	zipcode: string;
}

export interface ZipcodeAddressResponseDTO {
	bairro: string;
	erro?: boolean;
	estado: string;
	localidade: string;
	logradouro: string;
	uf: string;
}
