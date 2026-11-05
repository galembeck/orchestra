import { z } from "zod";

export const memberSchema = z.object({
  __typename: z.literal("Member").default("Member"),
  companyId: z.string(),
  id: z.string(),
});

export type Member = z.infer<typeof memberSchema>;
