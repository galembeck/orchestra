import { Building2, Factory, Home, type LucideIcon } from "lucide-react";

export const SEGMENT = {
	RESIDENTIAL: 1,
	BUSINESS: 2,
	INDUSTRIAL: 3,
} as const;

export type Segment = (typeof SEGMENT)[keyof typeof SEGMENT];

export interface SegmentProps {
	icon: LucideIcon;
	label: string;
	value: Segment;
}

export const SEGMENT_DETAILS: Record<Segment, SegmentProps> = {
	[SEGMENT.RESIDENTIAL]: {
		value: SEGMENT.RESIDENTIAL,
		label: "Residencial",
		icon: Home,
	},
	[SEGMENT.BUSINESS]: {
		value: SEGMENT.BUSINESS,
		label: "Empresarial",
		icon: Building2,
	},
	[SEGMENT.INDUSTRIAL]: {
		value: SEGMENT.INDUSTRIAL,
		label: "Industrial",
		icon: Factory,
	},
};

export const SEGMENT_OPTIONS = Object.values(SEGMENT_DETAILS);
