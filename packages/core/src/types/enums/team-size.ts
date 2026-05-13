import { Building2, Factory, Globe, type LucideIcon, User } from "lucide-react";

export const TEAM_SIZE = {
	ONE_TO_FIFTH: 1,
	FIFTH_TO_HUNDRED: 2,
	HUNDRED_TO_FIVE_HUNDRED: 3,
	FIVE_HUNDRED_PLUS: 4,
} as const;

export type TeamSize = (typeof TEAM_SIZE)[keyof typeof TEAM_SIZE];

export interface TeamSizeProps {
	icon: LucideIcon;
	label: string;
	value: TeamSize;
}

export const TEAM_SIZE_DETAILS: Record<TeamSize, TeamSizeProps> = {
	[TEAM_SIZE.ONE_TO_FIFTH]: {
		value: TEAM_SIZE.ONE_TO_FIFTH,
		label: "1-50",
		icon: User,
	},
	[TEAM_SIZE.FIFTH_TO_HUNDRED]: {
		value: TEAM_SIZE.FIFTH_TO_HUNDRED,
		label: "51-200",
		icon: Building2,
	},
	[TEAM_SIZE.HUNDRED_TO_FIVE_HUNDRED]: {
		value: TEAM_SIZE.HUNDRED_TO_FIVE_HUNDRED,
		label: "201-500",
		icon: Factory,
	},
	[TEAM_SIZE.FIVE_HUNDRED_PLUS]: {
		value: TEAM_SIZE.FIVE_HUNDRED_PLUS,
		label: "500+",
		icon: Globe,
	},
};

export const TEAM_SIZE_OPTIONS = Object.values(TEAM_SIZE_DETAILS);
