import {
	Building2,
	CalendarClock,
	ClipboardCheck,
	Receipt,
	Settings,
	Star,
} from "lucide-react";
import { type ProfileTabItem, ProfileTabs } from "../_shared/-profile-tabs";

const TABS: ProfileTabItem[] = [
	{ icon: CalendarClock, label: "Hoje", active: true },
	{ icon: ClipboardCheck, label: "Atendimentos", badge: "126" },
	{ icon: Building2, label: "Empresa & Função" },
	{ icon: Receipt, label: "Recebimentos" },
	{ icon: Star, label: "Avaliações" },
	{ icon: Settings, label: "Conta & LGPD" },
];

export function WorkerTabs() {
	return <ProfileTabs items={TABS} />;
}
