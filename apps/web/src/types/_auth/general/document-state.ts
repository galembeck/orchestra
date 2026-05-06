import type { UploadStatus } from "./upload-status";

export interface DocumentState {
	file: File | null;
	progress: number;
	status: UploadStatus;
}
