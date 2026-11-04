import type {
  NavGroupDefinition,
  NavLinkDefinition,
} from "@orchestra/shared/types/navigation";

export const SEARCH_PATH = "/search";

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

export const FOOTER_LINK_GROUPS = [
  {
    links: [
      { href: SEARCH_PATH, labelKey: "searchServices" },
      { href: "#services", labelKey: "categories" },
      { href: "#how-it-works", labelKey: "howItWorks" },
    ],
    titleKey: "clients",
  },
  {
    links: [
      { href: BUSINESS_SIGN_UP_LINK.href, labelKey: "registerBusiness" },
      { href: "/dashboard", labelKey: "dashboard" },
      { href: "/contact-sales", labelKey: "contactSales" },
    ],
    titleKey: "business",
  },
  {
    links: [
      { href: "/about", labelKey: "about" },
      { href: "/help", labelKey: "helpCenter" },
      { href: "/privacy", labelKey: "privacy" },
    ],
    titleKey: "company",
  },
] as const satisfies readonly NavGroupDefinition[];
