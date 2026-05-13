import {
	Banknote,
	ClipboardList,
	LayoutDashboard,
	MapPin,
	Settings,
	Star,
} from "lucide-react";
import { type ProfileTabItem, ProfileTabs } from "../_shared/-profile-tabs";

const TABS: ProfileTabItem[] = [
	{ icon: LayoutDashboard, label: "Visão geral", active: true },
	{ icon: ClipboardList, label: "Pedidos", badge: "38" },
	{ icon: MapPin, label: "Endereços" },
	{ icon: Banknote, label: "Pagamento" },
	{ icon: Star, label: "Avaliações" },
	{ icon: Settings, label: "Conta & LGPD" },
];

export function ClientTabs() {
	return <ProfileTabs items={TABS} />;
}
