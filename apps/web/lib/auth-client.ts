import { AUTH_BASE_PATH } from "@orchestra/shared/constants/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: AUTH_BASE_PATH,
  plugins: [
    inferAdditionalFields({
      user: {
        adultConfirmedAt: { input: false, required: false, type: "date" },
        termsAcceptedAt: { input: false, required: false, type: "date" },
        termsVersion: { input: false, required: false, type: "string" },
      },
    }),
  ],
});

export async function isAuthenticated(): Promise<boolean> {
  const { data } = await authClient.getSession();
  return Boolean(data?.session);
}

export async function signOut(): Promise<void> {
  await authClient.signOut();
}
