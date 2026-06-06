import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/is-market-buyable";

const now = new Date("2026-06-06T12:00:00.000Z");

describe("isMarketBuyable", () => {
  it("returns true for open markets before close date", () => {
    expect(
      isMarketBuyable(
        { status: "open", close_date: "2026-12-31T00:00:00.000Z" },
        now,
      ),
    ).toBe(true);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable(
        { status: "closed", close_date: "2026-12-31T00:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });

  it("returns false for resolved markets", () => {
    expect(
      isMarketBuyable(
        { status: "resolved", close_date: "2026-12-31T00:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });

  it("returns false when close date has passed", () => {
    expect(
      isMarketBuyable(
        { status: "open", close_date: "2026-01-01T00:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });
});
