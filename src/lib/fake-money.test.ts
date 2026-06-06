import { describe, expect, it } from "vitest";

import {
  formatFakeBalance,
  formatFakeDollars,
  formatFakeShares,
  parseFakeDollarsToCents,
} from "@/lib/fake-money";

describe("parseFakeDollarsToCents", () => {
  it("accepts whole-dollar amounts", () => {
    expect(parseFakeDollarsToCents("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarsToCents("10")).toEqual({ ok: true, cents: 1000 });
  });

  it("accepts one- and two-decimal amounts", () => {
    expect(parseFakeDollarsToCents("1.5")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarsToCents("1.50")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarsToCents("10.00")).toEqual({ ok: true, cents: 1000 });
  });

  it("rejects more than two decimal places", () => {
    expect(parseFakeDollarsToCents("1.234").ok).toBe(false);
    expect(parseFakeDollarsToCents("1.999").ok).toBe(false);
  });

  it("rejects invalid input", () => {
    expect(parseFakeDollarsToCents("").ok).toBe(false);
    expect(parseFakeDollarsToCents("abc").ok).toBe(false);
    expect(parseFakeDollarsToCents("-1").ok).toBe(false);
  });

  it("rejects zero amounts", () => {
    expect(parseFakeDollarsToCents("0").ok).toBe(false);
    expect(parseFakeDollarsToCents("0.00").ok).toBe(false);
  });
});

describe("formatFakeDollars", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeDollars(10000)).toBe("$100.00 fake");
    expect(formatFakeDollars(500)).toBe("$5.00 fake");
  });
});

describe("formatFakeShares", () => {
  it("uses the same fake-dollar formatting as balances", () => {
    expect(formatFakeShares(250)).toBe("$2.50 fake");
  });
});

describe("formatFakeBalance", () => {
  it("re-exports balance formatting", () => {
    expect(formatFakeBalance(1050)).toBe("$10.50 fake");
  });
});
