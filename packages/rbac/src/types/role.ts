import { z } from "zod";

export const roleSchema = z.union([
  z.literal("ADMIN"),
  z.literal("BILLING"),
  z.literal("MEMBER"),
]);

export type CompanyRole = z.infer<typeof roleSchema>;
