import type { Market } from "@/lib/markets/types";

export function isMarketBuyable(
  market: Pick<Market, "status" | "close_date">,
  now: Date = new Date(),
): boolean {
  return market.status === "open" && new Date(market.close_date) > now;
}
