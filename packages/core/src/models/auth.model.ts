export interface AuthenticateDTO {
	email: string;
	password: string;
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
