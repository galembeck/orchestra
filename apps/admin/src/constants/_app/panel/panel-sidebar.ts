import { CheckCircle, LayoutDashboard, ShieldUser } from "lucide-react";

export const dashboardData = {
	primary: [
		{
			title: "Visão geral",
			url: "/panel/overview",
			icon: LayoutDashboard,
			isActive: true,
		},
		{
			title: "Administradores",
			icon: ShieldUser,
			items: [{ title: "Plataforma", url: "/panel/administrators/platform" }],
		},
		{
			title: "Validação de cadastro",
			url: "/panel/validation",
			icon: CheckCircle,
		},
	],
};
