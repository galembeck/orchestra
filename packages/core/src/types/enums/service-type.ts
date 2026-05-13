import { Building2, type LucideIcon, Truck } from "lucide-react";

export const SERVICE_TYPE = {
	CUSTOMER_LOCATION: 1,
	BUSINESS_LOCATION: 2,
} as const;

export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

export interface ServiceTypeProps {
	description?: string;
	icon: LucideIcon;
	label: string;
	value: ServiceType;
}

export const SERVICE_TYPE_DETAILS: Record<ServiceType, ServiceTypeProps> = {
	[SERVICE_TYPE.CUSTOMER_LOCATION]: {
		value: SERVICE_TYPE.CUSTOMER_LOCATION,
		label: "Atendimento no local",
		description:
			"Sua equipe se desloca até o cliente para realizar o atendimento.",
		icon: Truck,
	},
	[SERVICE_TYPE.BUSINESS_LOCATION]: {
		value: SERVICE_TYPE.BUSINESS_LOCATION,
		label: "Atendimento no estabelecimento",
		description:
			"O cliente deve se deslocar até a empresa para ter seu atendimento realizado.",
		icon: Building2,
	},
};

export const SERVICE_TYPE_OPTIONS = Object.values(SERVICE_TYPE_DETAILS);
