const HAS_DIGIT = /\d/;
const HAS_SPECIAL_CHAR = /[^a-zA-Z\d]/;
const HAS_UPPERCASE = /[A-Z]/;

export function getPasswordStrength(password: string) {
	if (!password) {
		return null;
	}

	const score = [
		password.length >= 8,
		HAS_DIGIT.test(password),
		HAS_SPECIAL_CHAR.test(password),
		HAS_UPPERCASE.test(password),
	].filter(Boolean).length;

	if (score <= 1) {
		return { label: "Senha fraca", colorClass: "text-red-500" };
	}
	if (score === 2) {
		return { label: "Senha razoável", colorClass: "text-yellow-600" };
	}
	if (score === 3) {
		return { label: "Senha boa", colorClass: "text-blue-600" };
	}
	return { label: "Senha forte", colorClass: "text-success" };
}
