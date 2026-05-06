import type { LucideIcon } from "lucide-react";
import { dashboardData } from "./panel-sidebar";

export interface NavigationItem {
	description: string;
	group: string;
	icon?: LucideIcon;
	id: string;
	keywords: string[];
	title: string;
	url: string;
}

export const searchNavigationItems: NavigationItem[] = [
	{
		id: "overview",
		title: "Visão geral",
		url: "/company/$companySlug/overview",
		description:
			"Visão geral do painel administrativo com métricas gerais e informações relevantes sobre seu perfil e sua empresa.",
		group: "Operação",
		icon: dashboardData.primary.find((item) => item.title === "Visão geral")
			?.icon,
		keywords: ["inicio", "home", "overview", "dashboard"],
	},

	{
		id: "profile",
		title: "Perfil",
		url: "/admin/profile",
		description: "Gerenciar informações do perfil",
		group: "Conta",
		keywords: ["perfil", "usuario", "conta", "configuracoes pessoais", "dados"],
	},

	{
		id: "settings",
		title: "Configurações",
		url: "/admin/settings",
		description: "Configurações do sistema",
		group: "Sistema",
		keywords: [
			"configuracoes",
			"settings",
			"opcoes",
			"preferencias",
			"sistema",
		],
	},
];

export const getAllNavigationItems = (): NavigationItem[] => [
	...searchNavigationItems,
];

export const groupNavigationItems = (items: NavigationItem[]) =>
	items.reduce(
		(acc, item) => {
			const group = item.group;
			if (!acc[group]) {
				acc[group] = [];
			}
			acc[group].push(item);
			return acc;
		},
		{} as Record<string, NavigationItem[]>
	);
