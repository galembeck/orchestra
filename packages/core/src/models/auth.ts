export interface AuthenticateDTO {
	identifier: string;
	password: string;
	rememberMe: boolean;
}

export interface AuthResponseDTO {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshTokenDTO {
	refreshToken: string;
}

export interface PasswordRecoveryRequestDTO {
	email: string;
}

export interface PasswordRecoveryVerifyDTO {
	email: string;
	token: string;
}

export interface PasswordResetDTO {
	email: string;
	newPassword: string;
	token: string;
}
