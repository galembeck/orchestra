import type { NavLinkDefinition } from "@orchestra/shared/types/navigation";

export const NAV_ITEMS = [
  { href: "#services", labelKey: "services" },
  { href: "#how-it-works", labelKey: "howItWorks" },
  { href: "#for-business", labelKey: "forBusiness" },
  { href: "#help", labelKey: "help" },
] as const satisfies readonly NavLinkDefinition[];

export const SIGN_IN_LINK = {
  href: "/sign-in",
  labelKey: "signIn",
} as const satisfies NavLinkDefinition;

export const BUSINESS_SIGN_UP_LINK = {
  href: "/company/register",
  labelKey: "registerBusiness",
} as const satisfies NavLinkDefinition;

export const SEARCH_PATH = "/search";
