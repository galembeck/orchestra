export interface ApiError {
	message: string;
	status: number;
}

export type ApiException = Error & { status: number };
