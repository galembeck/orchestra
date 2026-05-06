import { createContext } from "react";
import type { PublicUserDTO } from "src/models/user.js";

export interface AuthContextValue {
	isAuthenticated: boolean;
	isLoading: boolean;
	refetch: () => Promise<void>;
	user: PublicUserDTO | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
