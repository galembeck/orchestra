import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useContext } from "react";
import { userService } from "../services/user.service.js";
import type { ApiException } from "../types/api-error.js";
import { AuthContext } from "../types/auth-context-value.js";

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const queryClient = useQueryClient();

	const { data: user = null, isLoading } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			try {
				return await userService.getMe();
			} catch (err) {
				if ((err as ApiException).status === 401) {
					return null;
				}
				throw err;
			}
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	async function refetchUser() {
		await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: user !== null,
				refetch: refetchUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return ctx;
}
