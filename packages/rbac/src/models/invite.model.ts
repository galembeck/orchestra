import { z } from "zod";

export const inviteSchema = z.object({
  __typename: z.literal("Invite").default("Invite"),
  companyId: z.string(),
  id: z.string(),
});

export type Invite = z.infer<typeof inviteSchema>;
