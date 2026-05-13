import {
	Banknote,
	ClipboardCheck,
	FileText,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import { type ProfileTabItem, ProfileTabs } from "../_shared/-profile-tabs";

const TABS: ProfileTabItem[] = [
	{ icon: LayoutDashboard, label: "Visão geral", active: true },
	{ icon: ClipboardCheck, label: "Pedidos", badge: "284" },
	{ icon: Users, label: "Equipe" },
	{ icon: Banknote, label: "Faturamento" },
	{ icon: FileText, label: "Documentos" },
	{ icon: Settings, label: "Conta & LGPD" },
];

export function CompanyTabs() {
	return <ProfileTabs items={TABS} />;
}
