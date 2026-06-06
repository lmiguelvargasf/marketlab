"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth/session";
import { parseFakeDollarsToCents } from "@/lib/fake-money";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import { getMarketById } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BuySharesActionState = {
  error?: string;
  success?: string;
  balanceCents?: number;
  yesSharesCents?: number;
  noSharesCents?: number;
};

const buySharesSchema = z.object({
  market_id: z.uuid("Invalid market."),
  side: z.enum(["yes", "no"], { message: "Choose Yes or No." }),
  amount: z.string(),
});

type BuySharesRpcResult = {
  balance_cents: number;
  yes_shares_cents: number;
  no_shares_cents: number;
};

function mapRpcError(message: string): string {
  if (message.includes("Not authenticated")) {
    return "Sign in to buy shares.";
  }
  if (message.includes("Insufficient fake balance")) {
    return "You do not have enough fake balance for this purchase.";
  }
  if (message.includes("Market is not open")) {
    return "Buying is unavailable for this market.";
  }
  if (message.includes("Market not found")) {
    return "Market not found.";
  }
  if (message.includes("Amount must be a positive integer")) {
    return "Amount must be greater than zero.";
  }
  if (message.includes("Side must be yes or no")) {
    return "Choose Yes or No.";
  }
  return "Could not complete purchase. Please try again.";
}

export async function buySharesAction(
  _prevState: BuySharesActionState,
  formData: FormData,
): Promise<BuySharesActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const user = await getAuthUser();

  if (!user) {
    return { error: "Sign in to buy shares." };
  }

  const parsed = buySharesSchema.safeParse({
    market_id: formData.get("market_id"),
    side: formData.get("side"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { market_id: marketId, side, amount } = parsed.data;
  const amountParsed = parseFakeDollarsToCents(amount);

  if (!amountParsed.ok) {
    return { error: amountParsed.error };
  }

  const market = await getMarketById(marketId);

  if (!market || !isMarketBuyable(market)) {
    return { error: "Buying is unavailable for this market." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("buy_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: amountParsed.cents,
  });

  if (error) {
    return { error: mapRpcError(error.message) };
  }

  const result = data as BuySharesRpcResult | null;

  if (!result) {
    return { error: "Could not complete purchase. Please try again." };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/markets");

  return {
    success: `Bought ${side === "yes" ? "Yes" : "No"} shares with fake money.`,
    balanceCents: result.balance_cents,
    yesSharesCents: result.yes_shares_cents,
    noSharesCents: result.no_shares_cents,
  };
}
