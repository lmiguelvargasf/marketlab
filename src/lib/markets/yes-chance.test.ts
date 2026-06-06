import { describe, expect, it } from "vitest";

import { computeYesChance, NEUTRAL_YES_CHANCE } from "@/lib/markets/yes-chance";

describe("computeYesChance", () => {
  it("returns neutral baseline when totals are zero", () => {
    expect(computeYesChance(0, 0)).toBe(NEUTRAL_YES_CHANCE);
  });

  it("calculates Yes chance from aggregate positions", () => {
    expect(computeYesChance(700, 300)).toBe(70);
    expect(computeYesChance(250, 750)).toBe(25);
  });

  it("exposes the documented neutral constant", () => {
    expect(NEUTRAL_YES_CHANCE).toBe(50);
  });
});
