import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { AuthenticateDTO } from "../../models/auth.model.js";
import type { PublicUserDTO } from "../../models/user.model.js";
import { useAuth as useAuthProvider } from "../../providers/auth-provider.js";
import { authService } from "../../services/auth.service.js";
import type { ApiException } from "../../types/api-error.js";
import { ACCOUNT_TYPE } from "../../types/enums/account-type.js";

export function useAuth() {
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const { user, isAuthenticated, isLoading, refetch } = useAuthProvider();

	const [serverError, setServerError] = useState("");

	const { mutate: signIn, isPending } = useMutation({
		mutationFn: (data: AuthenticateDTO) => authService.signIn(data),

		onSuccess: async () => {
			await refetch();

			const updatedUser = queryClient.getQueryData<PublicUserDTO>([
				"auth",
				"me",
			]);

			const isClient = updatedUser?.accountType === ACCOUNT_TYPE.CLIENT;

			toast.success("Bem-vindo de volta!", {
				description: isClient
					? "Encontre o serviço ideal agora mesmo!"
					: "Redirecionando para o painel administrativo de sua empresa...",
			});

			if (isClient) {
				navigate({ to: "/" });
			} else {
				navigate({ to: "/admin/dashboard" });
			}
		},

		onError: (err) => {
			const message =
				(err as ApiException).status === 400
					? "E-mail ou senha inválidos."
					: "Erro ao realizar login, tente novamente.";

			setServerError(message);

			toast.error("Erro ao realizar login!", {
				description: message,
			});
		},
	});

	const { mutate: signOut } = useMutation({
		mutationFn: authService.signOut,

		onSettled: () => {
			queryClient.setQueryData(["auth", "me"], null);
			navigate({ to: "/" });
		},
	});

	return {
		signIn,
		signOut,
		isPending,
		serverError,
		setServerError,
		user,
		isAuthenticated,
		isLoading,
	};
}
