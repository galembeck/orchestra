import { z } from "zod";

export const signInSchema = z.object({
	identifier: z.string().min(1),
	password: z.string().min(1),
	rememberMe: z.boolean().optional().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;
