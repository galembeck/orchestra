const MEMBER_SINCE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
	month: "short",
	year: "numeric",
});

export function formatMemberSince(iso?: string, prefix = "Membro desde") {
	if (!iso) {
		return `${prefix} (recente)`;
	}

	const formatted = MEMBER_SINCE_FORMATTER.format(new Date(iso))
		.replace(".", "")
		.replace(" de ", " · ");

	return `${prefix} ${formatted}`;
}
