import {
	CalendarDays,
	CalendarRange,
	type LucideIcon,
	Zap,
} from "lucide-react";

export const COMPANY_SCHEDULE = {
	WEEKDAYS: 1,
	FULL_WEEK: 2,
	EMERGENCY: 3,
} as const;

export type CompanySchedule =
	(typeof COMPANY_SCHEDULE)[keyof typeof COMPANY_SCHEDULE];

export interface CompanyScheduleProps {
	description?: string;
	icon: LucideIcon;
	label: string;
	value: CompanySchedule;
}

export const COMPANY_SCHEDULE_DETAILS: Record<
	CompanySchedule,
	CompanyScheduleProps
> = {
	[COMPANY_SCHEDULE.WEEKDAYS]: {
		value: COMPANY_SCHEDULE.WEEKDAYS,
		label: "Dias úteis",
		description: "Atendimento de segunda a sexta-feira.",
		icon: CalendarDays,
	},
	[COMPANY_SCHEDULE.FULL_WEEK]: {
		value: COMPANY_SCHEDULE.FULL_WEEK,
		label: "Semana completa",
		description: "Atendimento de segunda-feira a domingo.",
		icon: CalendarRange,
	},
	[COMPANY_SCHEDULE.EMERGENCY]: {
		value: COMPANY_SCHEDULE.EMERGENCY,
		label: "Emergências 24/7",
		description: "Atendimento sempre disponível, sem restrição de horário.",
		icon: Zap,
	},
};

export const COMPANY_SCHEDULE_OPTIONS = Object.values(COMPANY_SCHEDULE_DETAILS);
