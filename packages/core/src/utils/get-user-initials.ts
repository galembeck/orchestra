const WHITESPACE_REGEX = /\s+/;

export const getUserInitials = (fullName?: string): string => {
	const cleanName = fullName?.trim();

	if (!cleanName) {
		return "U";
	}

	const parts = cleanName.split(WHITESPACE_REGEX);

	const firstInitial = parts[0]?.charAt(0) || "";
	const lastInitial = parts.length > 1 ? parts.at(-1)?.charAt(0) || "" : "";

	return `${firstInitial}${lastInitial}`.toUpperCase();
};
