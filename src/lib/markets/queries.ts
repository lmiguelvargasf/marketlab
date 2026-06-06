import {
  buildMarketChartSeries,
  parseLedgerSide,
} from "@/lib/markets/chart-data";
import type {
  ChartSeries,
  LedgerTradeEvent,
  Market,
  MarketPositionTotals,
  MarketStatus,
} from "@/lib/markets/types";
import { computeYesChance, NEUTRAL_YES_CHANCE } from "@/lib/markets/yes-chance";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const marketColumns =
  "id, title, description, status, close_date, created_at" as const;

function toMarket(row: {
  id: string;
  title: string;
  description: string;
  status: string;
  close_date: string;
  created_at: string;
}): Market {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as MarketStatus,
    close_date: row.close_date,
    created_at: row.created_at,
  };
}

/**
 * Market-wide position aggregates are not available through table reads under
 * current owner-scoped RLS. This helper attempts a query and only treats the
 * result as market-wide when a future SECURITY DEFINER RPC is introduced.
 */
export async function getMarketPositionTotals(
  marketId: string,
): Promise<MarketPositionTotals | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId);

  if (error || !data) {
    return null;
  }

  // Owner-scoped RLS cannot return market-wide totals today.
  return {
    yesTotal: data.reduce((sum, row) => sum + row.yes_shares_cents, 0),
    noTotal: data.reduce((sum, row) => sum + row.no_shares_cents, 0),
    isMarketWide: false,
  };
}

export async function getMarketLedgerEvents(
  marketId: string,
): Promise<LedgerTradeEvent[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("ledger_entries")
    .select("created_at, amount_cents, entry_type, description")
    .eq("market_id", marketId)
    .eq("entry_type", "trade")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  const events: LedgerTradeEvent[] = [];

  for (const row of data) {
    const side = parseLedgerSide(row.description);
    if (!side) {
      continue;
    }

    const amount = Math.abs(row.amount_cents);
    events.push({
      timestamp: row.created_at,
      yesDelta: side === "yes" ? amount : 0,
      noDelta: side === "no" ? amount : 0,
    });
  }

  return events;
}

export async function getMarkets(): Promise<Market[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select(marketColumns)
    .order("close_date", { ascending: true });

  if (error) {
    console.error("Failed to load markets from Supabase:", error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map(toMarket);
}

export async function getMarketById(id: string): Promise<Market | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markets")
    .select(marketColumns)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return toMarket(data);
}

export async function getMarketChartData(market: Market): Promise<ChartSeries> {
  const [totals, ledgerEvents] = await Promise.all([
    getMarketPositionTotals(market.id),
    getMarketLedgerEvents(market.id),
  ]);

  return buildMarketChartSeries(market, totals, ledgerEvents);
}

export function getCurrentYesChanceFromTotals(
  totals: MarketPositionTotals | null,
): number {
  if (!totals?.isMarketWide) {
    return NEUTRAL_YES_CHANCE;
  }

  return computeYesChance(totals.yesTotal, totals.noTotal);
}
