import { CheckCircle, LayoutDashboard } from "lucide-react";

export const dashboardData = {
	primary: [
		{
			title: "Visão geral",
			url: "/panel/overview",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Validação de cadastro",
			url: "/panel/validation",
			icon: CheckCircle,
			isActive: true,
		},
	],
};
