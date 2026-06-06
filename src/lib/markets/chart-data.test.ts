import { describe, expect, it } from "vitest";

import {
  buildFlatChartSeries,
  buildLedgerTimeline,
  buildMarketChartSeries,
  parseLedgerSide,
} from "@/lib/markets/chart-data";
import { NEUTRAL_YES_CHANCE } from "@/lib/markets/yes-chance";

const now = new Date("2026-06-06T12:00:00.000Z");

describe("parseLedgerSide", () => {
  it("parses yes and no from descriptions", () => {
    expect(parseLedgerSide("Bought Yes shares")).toBe("yes");
    expect(parseLedgerSide("Bought NO shares")).toBe("no");
    expect(parseLedgerSide("Trade complete")).toBeNull();
  });
});

describe("buildFlatChartSeries", () => {
  it("renders a flat current-state line", () => {
    const series = buildFlatChartSeries(
      "2026-01-01T00:00:00.000Z",
      NEUTRAL_YES_CHANCE,
      now,
    );

    expect(series.isFlatFallback).toBe(true);
    expect(series.points).toHaveLength(2);
    expect(series.points[0]?.yesChance).toBe(50);
    expect(series.points[1]?.yesChance).toBe(50);
  });
});

describe("buildLedgerTimeline", () => {
  it("builds a historical series from ledger events", () => {
    const series = buildLedgerTimeline(
      [
        {
          timestamp: "2026-02-01T00:00:00.000Z",
          yesDelta: 600,
          noDelta: 0,
        },
        {
          timestamp: "2026-03-01T00:00:00.000Z",
          yesDelta: 0,
          noDelta: 400,
        },
      ],
      60,
      "2026-01-01T00:00:00.000Z",
      now,
    );

    expect(series.isFlatFallback).toBe(false);
    expect(series.points.length).toBeGreaterThan(2);
    expect(series.currentYesChance).toBe(60);
  });

  it("falls back to a flat line when ledger history is unavailable", () => {
    const series = buildLedgerTimeline([], 42, "2026-01-01T00:00:00.000Z", now);

    expect(series.isFlatFallback).toBe(true);
    expect(series.currentYesChance).toBe(42);
  });
});

describe("buildMarketChartSeries", () => {
  it("uses neutral baseline when market-wide totals are unavailable", () => {
    const series = buildMarketChartSeries(
      { created_at: "2026-01-01T00:00:00.000Z" },
      { yesTotal: 100, noTotal: 100, isMarketWide: false },
      [],
      now,
    );

    expect(series.isFlatFallback).toBe(true);
    expect(series.currentYesChance).toBe(NEUTRAL_YES_CHANCE);
  });

  it("uses aggregate positions when market-wide totals are available", () => {
    const series = buildMarketChartSeries(
      { created_at: "2026-01-01T00:00:00.000Z" },
      { yesTotal: 800, noTotal: 200, isMarketWide: true },
      [],
      now,
    );

    expect(series.currentYesChance).toBe(80);
  });
});
