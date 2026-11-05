import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "./index.js";
import type { User } from "./models/user.model.js";
import type { CompanyRole } from "./types/role.js";

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;

export const permissions: Record<CompanyRole, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can("manage", "all");

    cannot(["transfer_ownership", "update"], "Company");
    can(["transfer_ownership", "update"], "Company", {
      ownerId: { $eq: user.id },
    });
  },

  BILLING(_, { can }) {
    can("manage", "Billing");
    can("get", "Company");
  },

  MEMBER(_, { can }) {
    can("get", ["Company", "Member"]);
  },
};
