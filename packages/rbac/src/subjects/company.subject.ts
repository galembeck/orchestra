import { z } from "zod";
import { companySchema } from "../models/company.model.js";

export const companySubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("transfer_ownership"),
    z.literal("get"),
  ]),
  z.union([z.literal("Company"), companySchema]),
]);

export type CompanySubject = z.infer<typeof companySubject>;
