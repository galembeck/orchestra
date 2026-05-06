/** biome-ignore-all lint/performance/useTopLevelRegex: required by CEP validation */
/** biome-ignore-all lint/style/useBlockStatements: required by CPF validation */

function isAllCharsRepeatedValues(cpfString: string) {
	const REMOVE_ALL_NON_DIGIT_REGEXP = /[^\d]+/g;
	const CHECK_FULL_CPF_SAME_CHAR_REPETITIONS_REGEXP = /(\d)\1{10}/g;
	return CHECK_FULL_CPF_SAME_CHAR_REPETITIONS_REGEXP.test(
		cpfString.replace(REMOVE_ALL_NON_DIGIT_REGEXP, "")
	);
}

function firstVerificationDigit(cpfDigits: number[]) {
	const multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
	const x =
		multipliers.reduce((result, multiplier, index) => {
			const matchingDigit = cpfDigits[index] ?? 0;

			return result + matchingDigit * multiplier;
		}, 0) % 11;

	if (x < 2) {
		return 0;
	}
	return 11 - x;
}

function secondVerificationDigit(cpfDigits: number[]) {
	const multipliers = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
	const x =
		multipliers.reduce((result, multiplier, index) => {
			const matchingDigit = cpfDigits[index] ?? 0;

			return result + matchingDigit * multiplier;
		}, 0) % 11;

	if (x < 2) {
		return 0;
	}
	return 11 - x;
}

export function isValidCPF(value: string) {
	const digitsOnlyStr = value.replace(/[\s-/.]/g, "");

	if (digitsOnlyStr.length !== 11 || isAllCharsRepeatedValues(value))
		return false;

	const cpfDigits = digitsOnlyStr
		.split("")
		.map((digit) => Number.parseInt(digit, 10));

	return (
		cpfDigits[9] === firstVerificationDigit(cpfDigits) &&
		cpfDigits[10] === secondVerificationDigit(cpfDigits)
	);
}

function isAllCharsRepeatedValuesCNPJ(cnpjString: string) {
	const REMOVE_ALL_NON_DIGIT_REGEXP = /[^\d]+/g;
	const CHECK_FULL_CNPJ_SAME_CHAR_REPETITIONS_REGEXP = /(\d)\1{13}/g;
	return CHECK_FULL_CNPJ_SAME_CHAR_REPETITIONS_REGEXP.test(
		cnpjString.replace(REMOVE_ALL_NON_DIGIT_REGEXP, "")
	);
}

function cnpjFirstVerificationDigit(cnpjDigits: number[]) {
	// CNPJ uses a specific alternating multiplier sequence
	const multipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const x =
		multipliers.reduce((result, multiplier, index) => {
			const matchingDigit = cnpjDigits[index] ?? 0;

			return result + matchingDigit * multiplier;
		}, 0) % 11;

	if (x < 2) {
		return 0;
	}
	return 11 - x;
}

function cnpjSecondVerificationDigit(cnpjDigits: number[]) {
	const multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	const x =
		multipliers.reduce((result, multiplier, index) => {
			const matchingDigit = cnpjDigits[index] ?? 0;

			return result + matchingDigit * multiplier;
		}, 0) % 11;

	if (x < 2) {
		return 0;
	}
	return 11 - x;
}

export function isValidCNPJ(value: string) {
	const digitsOnlyStr = value.replace(/[\s-/.]/g, "");

	if (digitsOnlyStr.length !== 14 || isAllCharsRepeatedValuesCNPJ(value))
		return false;

	const cnpjDigits = digitsOnlyStr
		.split("")
		.map((digit) => Number.parseInt(digit, 10));

	return (
		cnpjDigits[12] === cnpjFirstVerificationDigit(cnpjDigits) &&
		cnpjDigits[13] === cnpjSecondVerificationDigit(cnpjDigits)
	);
}

export function isValidCEP(value: string) {
	const cep = value.replace(/\D/g, "");
	return /^\d{8}$/.test(cep);
}
