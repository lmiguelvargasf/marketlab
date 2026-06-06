import { getAuthUser } from "@/lib/auth/session";
import type { MarketStatus } from "@/lib/markets/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { UserPosition } from "./types";

type PositionRow = {
  market_id: string;
  yes_shares_cents: number;
  no_shares_cents: number;
};

type MarketSummary = {
  id: string;
  title: string;
  status: string;
  close_date: string;
};

type PositionWithMarketRow = PositionRow & {
  market: MarketSummary | MarketSummary[] | null;
};

function resolveMarket(
  market: MarketSummary | MarketSummary[] | null,
): MarketSummary | null {
  if (!market) {
    return null;
  }

  return Array.isArray(market) ? (market[0] ?? null) : market;
}

function toUserPosition(row: PositionWithMarketRow): UserPosition | null {
  const market = resolveMarket(row.market);

  if (!market) {
    return null;
  }

  return {
    market_id: row.market_id,
    yes_shares_cents: row.yes_shares_cents,
    no_shares_cents: row.no_shares_cents,
    market: {
      id: market.id,
      title: market.title,
      status: market.status as MarketStatus,
      close_date: market.close_date,
    },
  };
}

export async function getUserPositionForMarket(
  marketId: string,
): Promise<Pick<UserPosition, "yes_shares_cents" | "no_shares_cents"> | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents")
    .eq("market_id", marketId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    yes_shares_cents: data.yes_shares_cents,
    no_shares_cents: data.no_shares_cents,
  };
}

export async function getUserPositions(): Promise<UserPosition[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const user = await getAuthUser();

  if (!user) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select(
      "market_id, yes_shares_cents, no_shares_cents, market:markets(id, title, status, close_date)",
    );

  if (error || !data) {
    return [];
  }

  return data
    .filter((row) => row.yes_shares_cents + row.no_shares_cents > 0)
    .map((row) => toUserPosition(row))
    .filter((position): position is UserPosition => position !== null)
    .sort(
      (a, b) =>
        new Date(a.market.close_date).getTime() -
        new Date(b.market.close_date).getTime(),
    );
}
