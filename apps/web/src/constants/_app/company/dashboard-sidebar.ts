import {
	Banknote,
	Calendar,
	ClipboardList,
	LayoutDashboard,
	MessagesSquare,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";

export const dashboardData = {
	primary: [
		{
			title: "Visão geral",
			url: "/company/$companySlug/overview",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Pedidos",
			url: "/company/$companySlug/orders",
			icon: ClipboardList,
		},
		{
			title: "Conversas",
			url: "/company/$companySlug/conversations",
			icon: MessagesSquare,
		},
		{
			title: "Agenda",
			url: "/company/$companySlug/calendar",
			icon: Calendar,
		},
		{
			title: "Equipe",
			url: "/company/$companySlug/team",
			icon: Users,
		},
	],

	business: [
		{
			title: "Pagamentos",
			url: "/company/$companySlug/payments",
			icon: Banknote,
		},
		{
			title: "Relatórios",
			url: "/company/$companySlug/report",
			icon: TrendingUp,
		},
		{
			title: "Avaliações",
			url: "/company/$companySlug/reviews",
			icon: Star,
		},
	],
};
