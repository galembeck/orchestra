import { z } from "zod";

export const createAdminUserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	registration: z.string().min(1),
	password: z.string().min(8),
	avatarUrl: z.string().url().optional(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
