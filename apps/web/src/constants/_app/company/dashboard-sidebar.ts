import {
	Banknote,
	Calendar,
	ClipboardList,
	LayoutDashboard,
	MessagesSquare,
	Star,
	TrendingUp,
	Users,
	Wrench,
} from "lucide-react";

export const dashboardData = {
	primary: [
		{
			title: "Visão geral",
			description:
				"Acompanhe o resumo do seu negócio: pedidos recentes, receita e agenda do dia, tudo em um só lugar.",
			url: "/app/$companySlug",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Pedidos",
			description:
				"Visualize, aceite ou recuse solicitações de serviço de clientes. Gerencie o status de cada pedido em tempo real.",
			url: "/app/$companySlug/orders",
			icon: ClipboardList,
		},
		{
			title: "Serviços",
			description:
				"Cadastre e edite os serviços que sua empresa oferece, com preços, descrições e categorias.",
			url: "/app/$companySlug/services",
			icon: Wrench,
		},
		{
			title: "Conversas",
			description:
				"Central de mensagens com clientes. Responda dúvidas e acompanhe negociações diretamente pelo painel.",
			url: "/app/$companySlug/conversations",
			icon: MessagesSquare,
		},
		{
			title: "Agenda",
			description:
				"Organize seus compromissos e serviços agendados. Visualize a semana e evite conflitos de horário.",
			url: "/app/$companySlug/calendar",
			icon: Calendar,
		},
		{
			title: "Equipe",
			description:
				"Adicione colaboradores, defina funções e gerencie as permissões de acesso de cada membro.",
			url: "/app/$companySlug/team",
			icon: Users,
		},
	],

	business: [
		{
			title: "Pagamentos",
			description:
				"Acompanhe recebimentos, configure métodos de pagamento e veja o histórico financeiro da empresa.",
			url: "/app/$companySlug/payments",
			icon: Banknote,
		},
		{
			title: "Relatórios",
			description:
				"Análises detalhadas de desempenho: serviços mais vendidos, crescimento de receita e tendências.",
			url: "/app/$companySlug/report",
			icon: TrendingUp,
		},
		{
			title: "Avaliações",
			description:
				"Leia e responda as avaliações dos clientes. Sua reputação na plataforma depende delas.",
			url: "/app/$companySlug/reviews",
			icon: Star,
		},
	],
};
