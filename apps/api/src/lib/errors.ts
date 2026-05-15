export class AppError extends Error {
	constructor(
		public readonly statusCode: number,
		message: string
	) {
		super(message);
		this.name = "AppError";
	}
}

export const unauthorized = (message = "Unauthorized") =>
	new AppError(401, message);

export const forbidden = (message = "Forbidden") => new AppError(403, message);

export const notFound = (resource: string) =>
	new AppError(404, `${resource} not found`);

export const conflict = (message: string) => new AppError(409, message);

export const badRequest = (message: string) => new AppError(400, message);
