import type { ZodError } from "zod";

export type FieldErrors = Partial<Record<string, string>>;

export function getFieldErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const [field] = issue.path;

    if (typeof field === "string" && errors[field] === undefined) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
