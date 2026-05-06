import type { REQUIRED_DOCUMENTS } from "@/constants/_auth/required-documents";

export type DocumentKey = (typeof REQUIRED_DOCUMENTS)[number]["key"];
