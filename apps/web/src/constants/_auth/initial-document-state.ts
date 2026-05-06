import type { DocumentState } from "@/types/_auth/general/document-state";

export const INITIAL_DOCUMENT_STATE: DocumentState = {
	status: "idle",
	file: null,
	progress: 0,
};
