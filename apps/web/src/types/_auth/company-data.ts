import type { Segment } from "@repo/core/types/enums/segment";

export interface CompanyData {
	address: string;
	cnpj: string;
	fantasyName: string;
	segment: Segment;
	socialReason: string;
	zipcode: string;
}
