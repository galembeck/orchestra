const BASE_URL = "http://localhost:5006";

type ApiException = Error & { status: number };

function createApiException(status: number, message: string): ApiException {
	const err = new Error(message) as ApiException;
	err.status = status;
	return err;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: "include",
		headers: { "Content-Type": "application/json", ...options.headers },
	});

	if (!res.ok) {
		let message = res.statusText;

		try {
			const body = (await res.json()) as { message?: string };
			if (body.message) message = body.message;
		} catch {
			// ignore parse errors
		}

		throw createApiException(res.status, message);
	}

	const text = await res.text();
	return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const adminApi = {
	get: <T>(path: string, options?: RequestInit) =>
		request<T>(path, { method: "GET", ...options }),

	post: <T>(path: string, body?: unknown, options?: RequestInit) =>
		request<T>(path, {
			method: "POST",
			body: body === undefined ? undefined : JSON.stringify(body),
			...options,
		}),

	patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
		request<T>(path, {
			method: "PATCH",
			body: body === undefined ? undefined : JSON.stringify(body),
			...options,
		}),

	delete: <T>(path: string, options?: RequestInit) =>
		request<T>(path, { method: "DELETE", ...options }),
};

export type { ApiException };
