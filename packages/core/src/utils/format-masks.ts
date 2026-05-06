export const formatCellphone = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	const limited = numbers.slice(0, 11);

	if (limited.length >= 11) {
		return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
	}
	if (limited.length > 7) {
		return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
	}
	if (limited.length > 2) {
		return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
	}

	return limited;
};

export const formatCPF = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	const limited = numbers.slice(0, 11);

	if (limited.length >= 11) {
		return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9, 11)}`;
	}
	if (limited.length > 9) {
		return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
	}
	if (limited.length > 6) {
		return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
	}
	if (limited.length > 3) {
		return `${limited.slice(0, 3)}.${limited.slice(3)}`;
	}

	return limited;
};

export const formatCNPJ = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	const limited = numbers.slice(0, 14);

	if (limited.length >= 13) {
		return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12, 14)}`;
	}
	if (limited.length > 8) {
		return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
	}
	if (limited.length > 5) {
		return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
	}
	if (limited.length > 2) {
		return `${limited.slice(0, 2)}.${limited.slice(2)}`;
	}

	return limited;
};

export const formatDocument = (value: string) => {
	const numbers = value.replace(/\D/g, "");

	if (numbers.length <= 11) {
		return formatCPF(numbers);
	}

	return formatCNPJ(numbers);
};

export const formatCEP = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	const limited = numbers.slice(0, 8);

	if (limited.length > 5) {
		return `${limited.slice(0, 5)}-${limited.slice(5, 8)}`;
	}

	return limited;
};

export const formatBirthDate = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	const limited = numbers.slice(0, 8);

	if (limited.length >= 8) {
		return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4, 8)}`;
	}
	if (limited.length > 4) {
		return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
	}
	if (limited.length > 2) {
		return `${limited.slice(0, 2)}/${limited.slice(2)}`;
	}

	return limited;
};

export const removeFormat = (value: string) => value.replace(/\D/g, "");
