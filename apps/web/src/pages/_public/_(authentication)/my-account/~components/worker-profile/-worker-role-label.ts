const ROLE_LABELS: Record<string, string> = {
	OWNER: "Proprietário",
	ADMINISTRATOR: "Administrador",
	MEMBER: "Profissional",
	BILLING: "Financeiro",
};

export function getWorkerRoleLabel(roleKey: string | undefined, fallback: string) {
	if (!roleKey) {
		return fallback;
	}
	return ROLE_LABELS[roleKey] ?? fallback;
}
