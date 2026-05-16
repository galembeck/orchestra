import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CreateUserDTO } from "../../models/user.model.js";
import { useAuth } from "../../providers/auth-provider.js";
import { authService } from "../../services/auth.service.js";
import { userService } from "../../services/user.service.js";
import type { ApiException } from "../../types/api-error.js";

export function useUser() {
	const navigate = useNavigate();

	const { refetch } = useAuth();

	const [serverError, setServerError] = useState("");

	const { mutate: register, isPending } = useMutation({
		mutationFn: async (data: CreateUserDTO) => {
			await userService.register(data);

			await authService.signIn({
				identifier: data.email,
				password: data.password,
			});
		},

		onSuccess: async () => {
			await refetch();

			toast.success("Conta criada com sucesso!", {
				description: "Redirecionando...",
			});

			navigate({ to: "/" });
		},

		onError: (err) => {
			const message =
				(err as ApiException).status === 400
					? err.message
					: "Erro ao realizar cadastro. Tente novamente.";

			setServerError(message);

			toast.error("Erro ao realizar cadastro!", { description: message });
		},
	});

	const checkAvailability = useCallback(
		async (params: { email?: string; document?: string }) => {
			try {
				return await userService.checkAvailability(params);
			} catch {
				return { emailAvailable: true, documentAvailable: true };
			}
		},
		[]
	);

	return { register, isPending, serverError, checkAvailability };
}
