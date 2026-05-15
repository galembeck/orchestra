import { API } from "../api/connection/api.js";
import type {
	CreateUserDTO,
	PublicUserDTO,
	UpdateProfileDTO,
	UserAvailabilityResponse,
} from "../models/user.model.js";

export const userService = {
	register: ({ zipcode, address, number, complement, neighborhood, city, state, acceptTerms, document, cellphone, ...rest }: CreateUserDTO) =>
		API.post<{ id: string }>("/auth/register/client", {
			...rest,
			document: document.replace(/\D/g, ""),
			cellphone: cellphone.replace(/\D/g, ""),
			acceptedTerms: acceptTerms,
			address: {
				zipcode: zipcode.replace(/\D/g, ""),
				address,
				number,
				complement,
				neighborhood,
				city,
				state,
			},
		}),

	checkAvailability: (params: { email?: string; document?: string }) =>
		API.post<UserAvailabilityResponse>("/user/check-availability", params),

	getMe: () => API.get<PublicUserDTO>("/user/me"),

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
