import type { PublicUserDTO } from "@core/models/user.model.js";
import { createContext } from "react";

export interface AuthContextValue {
	isAuthenticated: boolean;
	isLoading: boolean;
	refetch: () => Promise<void>;
	user: PublicUserDTO | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
