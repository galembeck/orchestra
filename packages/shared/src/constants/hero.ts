export const PLATFORM_STATS = {
  averageRating: 4.9,
  reviewCount: 1_800_000,
  verifiedBusinesses: 12_400,
} as const;

export const REVIEWER_AVATARS = [
  "/assets/images/avatars/reviewer-1.webp",
  "/assets/images/avatars/reviewer-2.webp",
  "/assets/images/avatars/reviewer-3.webp",
  "/assets/images/avatars/reviewer-4.webp",
] as const;

export const HERO_SHOWCASE = {
  eta: {
    minutes: 12,
    progress: 0.68,
  },
  provider: {
    distanceKm: 1.2,
    initial: "M",
    name: "Marcos Pinturas",
    rating: 4.9,
  },
} as const;

export const HERO_MOTION = {
  cardBobDistancePx: 8,
  cardBobDurationSeconds: 6,
  wordRotateIntervalMs: 2600,
} as const;
