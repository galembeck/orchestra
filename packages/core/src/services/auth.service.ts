import { API } from "../api/connection/api.js";
import type {
	AuthenticateDTO,
	PasswordRecoveryRequestDTO,
	PasswordRecoveryVerifyDTO,
	PasswordResetDTO,
	RefreshTokenDTO,
} from "../models/auth.model.js";

export const authService = {
	signIn: (data: AuthenticateDTO) => API.post<void>("/auth", data),

	signOut: () => API.post<void>("/auth/revoke"),

	refresh: (data: RefreshTokenDTO) => API.post<void>("/auth/refresh", data),

	recovery: {
		request: (data: PasswordRecoveryRequestDTO) =>
			API.post<{ message: string }>("/auth/recovery/request", data),

		verify: (data: PasswordRecoveryVerifyDTO) =>
			API.post<{ message: string }>("/auth/recovery/verify", data),

		reset: (data: PasswordResetDTO) =>
			API.post<{ message: string }>("/auth/recovery/reset", data),
	},
};
