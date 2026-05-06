import { API } from "../api/connection/api.js";
import type {
	CreateUserDTO,
	PublicUserDTO,
	UpdateProfileDTO,
} from "../models/user.js";

export const userService = {
	register: (data: CreateUserDTO) => API.post<PublicUserDTO>("/user", data),

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
