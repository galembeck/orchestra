export const COMPANY_DOCUMENT_TYPE = {
	CNPJ_DOCUMENT: 1,
	ADDRESS_PROOF: 2,
	OWNER_IDENTITY: 3,
	OPERATING_LICENSE: 4,
} as const;

export type CompanyDocumentType =
	(typeof COMPANY_DOCUMENT_TYPE)[keyof typeof COMPANY_DOCUMENT_TYPE];
