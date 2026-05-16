import { Building2, Factory, Home, type LucideIcon } from "lucide-react";

export const SEGMENT = {
	RESIDENTIAL: "RESIDENTIAL",
	BUSINESS: "BUSINESS",
	INDUSTRIAL: "INDUSTRIAL",
} as const;

export type Segment = (typeof SEGMENT)[keyof typeof SEGMENT];

export interface SegmentProps {
	icon: LucideIcon;
	label: string;
	value: Segment;
}

export const SEGMENT_DETAILS: Record<Segment, SegmentProps> = {
	RESIDENTIAL: {
		value: SEGMENT.RESIDENTIAL,
		label: "Residencial",
		icon: Home,
	},
	BUSINESS: {
		value: SEGMENT.BUSINESS,
		label: "Empresarial",
		icon: Building2,
	},
	INDUSTRIAL: {
		value: SEGMENT.INDUSTRIAL,
		label: "Industrial",
		icon: Factory,
	},
};

export const SEGMENT_OPTIONS = Object.values(SEGMENT_DETAILS);
