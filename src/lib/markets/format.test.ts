import { describe, expect, it } from "vitest";

import {
  formatCloseDate,
  formatMarketStatus,
  formatYesChance,
} from "@/lib/markets/format";

describe("format helpers", () => {
  it("formats market status labels", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatMarketStatus("closed")).toBe("Closed");
    expect(formatMarketStatus("resolved")).toBe("Resolved");
  });

  it("formats close dates", () => {
    expect(formatCloseDate("2026-12-31T18:30:00.000Z")).toContain("2026");
  });

  it("formats yes chance percentages", () => {
    expect(formatYesChance(63.4)).toBe("63%");
  });
});
