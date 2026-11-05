import {
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@orchestra/shared/constants/auth";
import { z } from "zod";

const PASSWORD_LETTER_PATTERN = /[A-Za-z]/u;
const PASSWORD_DIGIT_PATTERN = /\d/u;

const emailSchema = z
  .string()
  .trim()
  .min(1, "emailRequired")
  .pipe(z.email("emailInvalid"));

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "passwordRequired"),
});

export const signUpConsentSchema = z.object({
  acceptedTerms: z.literal(true, "termsRequired"),
  isAdult: z.literal(true, "ageRequired"),
});

export const signUpSchema = z.object({
  ...signUpConsentSchema.shape,
  email: emailSchema,
  name: z
    .string()
    .trim()
    .min(1, "nameRequired")
    .max(NAME_MAX_LENGTH, "nameTooLong"),
  password: z
    .string()
    .min(1, "passwordRequired")
    .min(PASSWORD_MIN_LENGTH, "passwordTooShort")
    .max(PASSWORD_MAX_LENGTH, "passwordTooLong")
    .regex(PASSWORD_LETTER_PATTERN, "passwordNeedsLetter")
    .regex(PASSWORD_DIGIT_PATTERN, "passwordNeedsDigit"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export type SignUpConsentInput = z.infer<typeof signUpConsentSchema>;

export type SignUpInput = z.infer<typeof signUpSchema>;
