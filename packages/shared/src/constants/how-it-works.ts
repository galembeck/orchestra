export const HOW_IT_WORKS_STEPS = ["search", "chat", "track"] as const;

export type HowItWorksStep = (typeof HOW_IT_WORKS_STEPS)[number];

export const MAP_SHOWCASE_OFFERS = [
  { featured: false, id: "west", price: 180, rating: 4.9 },
  { featured: true, id: "north", price: 165, rating: 5 },
  { featured: false, id: "south", price: 210, rating: 4.8 },
] as const;

export type MapShowcaseOfferId = (typeof MAP_SHOWCASE_OFFERS)[number]["id"];

export const QUOTE_SHOWCASE = {
  total: 1240,
} as const;

export const TIMELINE_SHOWCASE = [
  { key: "accepted", status: "done", time: "09:12" },
  { key: "onTheWay", status: "done", time: "09:40" },
  { key: "inProgress", status: "current", time: null },
] as const;

export const SHOWCASE_CURRENCY = "BRL";
