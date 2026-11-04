export const CATEGORIES_PATH = "/categories";

export const TOTAL_CATEGORY_COUNT = 32;

export const MOBILE_VISIBLE_CATEGORY_COUNT = 6;

export const FEATURED_CATEGORIES = [
  { businessCount: 217, key: "painter", slug: "painter" },
  { businessCount: 203, key: "electrician", slug: "electrician" },
  { businessCount: 180, key: "plumber", slug: "plumber" },
  { businessCount: 228, key: "airConditioning", slug: "air-conditioning" },
  { businessCount: 149, key: "gardening", slug: "gardening" },
  { businessCount: 165, key: "carpentry", slug: "carpentry" },
  { businessCount: 138, key: "moving", slug: "moving" },
  { businessCount: 147, key: "pestControl", slug: "pest-control" },
] as const;

export type CategoryKey = (typeof FEATURED_CATEGORIES)[number]["key"];
