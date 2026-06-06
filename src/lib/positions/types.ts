import type { Market } from "@/lib/markets/types";

export type UserPosition = {
  market_id: string;
  yes_shares_cents: number;
  no_shares_cents: number;
  market: Pick<Market, "id" | "title" | "status" | "close_date">;
};
