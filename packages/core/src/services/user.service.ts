import { API } from "../api/connection/api.js";
import type {
	CreateUserDTO,
	PublicUserDTO,
	UpdateProfileDTO,
	UserAvailabilityResponse,
} from "../models/user.model.js";

export const userService = {
	register: (data: CreateUserDTO) => API.post<PublicUserDTO>("/user", data),

	checkAvailability: (params: { email?: string; document?: string }) =>
		API.post<UserAvailabilityResponse>("/user/check-availability", params),

	getMe: () => API.get<PublicUserDTO>("/user"),

	updateMe: (data: UpdateProfileDTO) => {
		const fd = new FormData();

		for (const [key, value] of Object.entries(data)) {
			if (value === undefined || value === null) {
				continue; // Use continue instead of return to skip to the next iteration
			}

			if (value instanceof File) {
				fd.append(key, value);
			} else {
				fd.append(key, String(value));
			}
		}

		return API.putForm<PublicUserDTO>("/user/me", fd);
	},
};
