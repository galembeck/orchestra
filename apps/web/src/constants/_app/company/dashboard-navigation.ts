import type { LucideIcon } from "lucide-react";
import { dashboardData } from "./dashboard-sidebar";

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
		id: "orders",
		title: "Pedidos",
		url: "/company/$companySlug/orders",
		description:
			"Histórico de pedidos e acompanhamento de atendimentos aos clientes aguardando atendimento e/ou já atendidos.",
		group: "Operação",
		icon: dashboardData.primary.find((item) => item.title === "Pedidos")?.icon,
		keywords: ["inicio", "home", "overview", "orders"],
	},
	{
		id: "conversations",
		title: "Conversas",
		url: "/company/$companySlug/conversations",
		description:
			"Histórico de conversas e canais de bate-papo com os clientes de sua empresa.",
		group: "Operação",
		icon: dashboardData.primary.find((item) => item.title === "Conversas")
			?.icon,
		keywords: ["inicio", "home", "overview", "conversations"],
	},
	{
		id: "calendar",
		title: "Agenda",
		url: "/company/$companySlug/calendar",
		description:
			"Visão geral das atividades e apontamentos passadas e futuras para atendimento.",
		group: "Operação",
		icon: dashboardData.primary.find((item) => item.title === "Agenda")?.icon,
		keywords: ["inicio", "home", "overview", "calendar"],
	},
	{
		id: "team",
		title: "Equipe",
		url: "/company/$companySlug/team",
		description:
			"Visão geral, gestão e acompanhamento dos demais funcionários de sua empresa.",
		group: "Operação",
		icon: dashboardData.primary.find((item) => item.title === "Equipe")?.icon,
		keywords: ["inicio", "home", "overview", "team"],
	},

	{
		id: "payments",
		title: "Pagamentos",
		url: "/company/$companySlug/payments",
		description:
			"Visão geral, histórico e acompanhamento dos pagamentos pendentes e/ou aprovados.",
		group: "Negócio",
		icon: dashboardData.primary.find((item) => item.title === "Pagamentos")
			?.icon,
		keywords: ["inicio", "home", "overview", "payments"],
	},
	{
		id: "report",
		title: "Relatórios",
		url: "/company/$companySlug/report",
		description: "Geração de relatórios e análises de dados de sua empresa.",
		group: "Negócio",
		icon: dashboardData.primary.find((item) => item.title === "Relatórios")
			?.icon,
		keywords: ["inicio", "home", "overview", "report"],
	},
	{
		id: "reviews",
		title: "Avaliações",
		url: "/company/$companySlug/reviews",
		description:
			"Histório de avaliações de atendimentos, funcionários, entre outras.",
		group: "Negócio",
		icon: dashboardData.primary.find((item) => item.title === "Avaliações")
			?.icon,
		keywords: ["inicio", "home", "overview", "reviews"],
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
