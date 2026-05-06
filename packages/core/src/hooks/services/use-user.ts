import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateUserDTO } from "../../models/user.js";
import { useAuth } from "../../providers/auth-provider.js";
import { authService } from "../../services/auth.js";
import { userService } from "../../services/user.js";
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
				rememberMe: true,
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

	return { register, isPending, serverError };
}
