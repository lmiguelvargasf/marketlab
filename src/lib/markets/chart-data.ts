import type {
  ChartPoint,
  ChartSeries,
  LedgerTradeEvent,
  Market,
} from "@/lib/markets/types";
import { computeYesChance, NEUTRAL_YES_CHANCE } from "@/lib/markets/yes-chance";

export function parseLedgerSide(description: string): "yes" | "no" | null {
  const normalized = description.toLowerCase();
  if (/\byes\b/.test(normalized)) {
    return "yes";
  }
  if (/\bno\b/.test(normalized)) {
    return "no";
  }
  return null;
}

export function buildLedgerTimeline(
  events: LedgerTradeEvent[],
  currentYesChance: number,
  marketCreatedAt: string,
  now: Date = new Date(),
): ChartSeries {
  if (events.length === 0) {
    return buildFlatChartSeries(marketCreatedAt, currentYesChance, now);
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  let yesTotal = 0;
  let noTotal = 0;
  const points: ChartPoint[] = [
    {
      timestamp: marketCreatedAt,
      yesChance: NEUTRAL_YES_CHANCE,
    },
  ];

  for (const event of sorted) {
    yesTotal += event.yesDelta;
    noTotal += event.noDelta;
    points.push({
      timestamp: event.timestamp,
      yesChance: computeYesChance(yesTotal, noTotal),
    });
  }

  if (points.length < 2) {
    return buildFlatChartSeries(marketCreatedAt, currentYesChance, now);
  }

  const lastPoint = points.at(-1);
  if (lastPoint) {
    points.push({
      timestamp: now.toISOString(),
      yesChance: lastPoint.yesChance,
    });
  }

  return {
    points,
    isFlatFallback: false,
    currentYesChance: points.at(-1)?.yesChance ?? currentYesChance,
  };
}

export function buildFlatChartSeries(
  marketCreatedAt: string,
  yesChance: number,
  now: Date = new Date(),
): ChartSeries {
  const chance = Number.isFinite(yesChance) ? yesChance : NEUTRAL_YES_CHANCE;

  return {
    points: [
      { timestamp: marketCreatedAt, yesChance: chance },
      { timestamp: now.toISOString(), yesChance: chance },
    ],
    isFlatFallback: true,
    currentYesChance: chance,
  };
}

export function buildMarketChartSeries(
  market: Pick<Market, "created_at">,
  totals: { yesTotal: number; noTotal: number; isMarketWide: boolean } | null,
  ledgerEvents: LedgerTradeEvent[],
  now: Date = new Date(),
): ChartSeries {
  const currentYesChance =
    totals?.isMarketWide && totals
      ? computeYesChance(totals.yesTotal, totals.noTotal)
      : NEUTRAL_YES_CHANCE;

  if (ledgerEvents.length >= 1) {
    const series = buildLedgerTimeline(
      ledgerEvents,
      currentYesChance,
      market.created_at,
      now,
    );
    if (!series.isFlatFallback) {
      return {
        ...series,
        currentYesChance: series.currentYesChance,
      };
    }
  }

  return buildFlatChartSeries(market.created_at, currentYesChance, now);
}

export function filterChartPointsByRange(
  points: ChartPoint[],
  range: "all" | "7d" | "30d",
  now: Date = new Date(),
): ChartPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const days = range === "7d" ? 7 : 30;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  const filtered = points.filter(
    (point) => new Date(point.timestamp).getTime() >= cutoff,
  );

  return filtered.length >= 2 ? filtered : points;
}
