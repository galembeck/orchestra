import { defineAbilityFor } from "../index.js";
import { userSchema } from "../models/user.model.js";
import type { CompanyRole } from "../types/role.js";

export function getUserPermissions(userId: string, role: CompanyRole) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  });

  const ability = defineAbilityFor(authUser);

  return ability;
}
