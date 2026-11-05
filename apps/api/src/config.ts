import { env } from "@orchestra/env/server";

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

export interface AppConfig {
  authSecret: string;
  googleOAuth?: GoogleOAuthConfig;
  isProduction: boolean;
  rateLimitEnabled: boolean;
  trustedProxyHops: number;
  webUrl: string;
}

const resolveGoogleOAuth = (): GoogleOAuthConfig | undefined => {
  if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)) {
    return;
  }

  return {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
};

export const loadConfig = (): AppConfig => ({
  authSecret: env.BETTER_AUTH_SECRET,
  googleOAuth: resolveGoogleOAuth(),
  isProduction: env.NODE_ENV === "production",
  rateLimitEnabled: env.NODE_ENV !== "test",
  trustedProxyHops: env.TRUSTED_PROXY_HOPS,
  webUrl: env.WEB_URL,
});
