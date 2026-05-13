const APPROVED_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
	month: "short",
	year: "numeric",
});

export function formatApprovalDate(iso?: string) {
	if (!iso) {
		return "Aprovação pendente";
	}

	const formatted = APPROVED_FORMATTER.format(new Date(iso))
		.replace(".", "")
		.replace(" de ", " · ");

	return `Aprovada em ${formatted}`;
}
