import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats whole-dollar balances", () => {
    expect(formatFakeBalance(10000)).toBe("$100.00 fake");
  });

  it("formats fractional cent amounts", () => {
    expect(formatFakeBalance(1050)).toBe("$10.50 fake");
  });

  it("formats zero balance", () => {
    expect(formatFakeBalance(0)).toBe("$0.00 fake");
  });
});
