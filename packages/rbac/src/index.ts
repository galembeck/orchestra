import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import { z } from "zod";
import type { User } from "./models/user.model.js";
import { permissions } from "./permissions.js";
import { billingSubject } from "./subjects/billing.subject.js";
import { companySubject } from "./subjects/company.subject.js";
import { inviteSubject } from "./subjects/invite.subject.js";
import { memberSubject } from "./subjects/member.subject.js";

const appAbilitiesSchema = z.union([
  billingSubject,
  companySubject,
  inviteSubject,
  memberSubject,

  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Permissions for role ${user.role} not found.`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
