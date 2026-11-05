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

export const ALL_CATEGORIES = [
  ...FEATURED_CATEGORIES,
  { businessCount: 94, key: "locksmith", slug: "locksmith" },
  { businessCount: 176, key: "cleaning", slug: "cleaning" },
  { businessCount: 112, key: "applianceRepair", slug: "appliance-repair" },
  { businessCount: 158, key: "masonry", slug: "masonry" },
  { businessCount: 121, key: "roofing", slug: "roofing" },
  { businessCount: 68, key: "glazier", slug: "glazier" },
  { businessCount: 73, key: "upholstery", slug: "upholstery" },
  { businessCount: 134, key: "itSupport", slug: "it-support" },
  { businessCount: 89, key: "photography", slug: "photography" },
  { businessCount: 97, key: "personalTrainer", slug: "personal-trainer" },
  { businessCount: 102, key: "tutoring", slug: "tutoring" },
  { businessCount: 61, key: "eventDecoration", slug: "event-decoration" },
  { businessCount: 84, key: "catering", slug: "catering" },
  { businessCount: 108, key: "petGrooming", slug: "pet-grooming" },
  { businessCount: 71, key: "interiorDesign", slug: "interior-design" },
  { businessCount: 143, key: "handyman", slug: "handyman" },
  { businessCount: 99, key: "flooring", slug: "flooring" },
  { businessCount: 65, key: "poolMaintenance", slug: "pool-maintenance" },
  { businessCount: 78, key: "securitySystems", slug: "security-systems" },
  { businessCount: 60, key: "solarPanels", slug: "solar-panels" },
  { businessCount: 115, key: "autoMechanic", slug: "auto-mechanic" },
  { businessCount: 82, key: "waterproofing", slug: "waterproofing" },
  { businessCount: 126, key: "furnitureAssembly", slug: "furniture-assembly" },
  { businessCount: 69, key: "fencing", slug: "fencing" },
] as const;

export type CategoryKey = (typeof ALL_CATEGORIES)[number]["key"];
