import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, FEATURED_CATEGORIES } from "./categories";

describe("ALL_CATEGORIES", () => {
  it("has exactly 32 unique categories", () => {
    expect(ALL_CATEGORIES).toHaveLength(32);
    expect(new Set(ALL_CATEGORIES.map((c) => c.key)).size).toBe(32);
    expect(new Set(ALL_CATEGORIES.map((c) => c.slug)).size).toBe(32);
  });

  it("includes every featured category", () => {
    const allKeys = new Set(ALL_CATEGORIES.map((c) => c.key));
    for (const featured of FEATURED_CATEGORIES) {
      expect(allKeys.has(featured.key)).toBe(true);
    }
  });
});
