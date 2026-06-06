import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc, getAuthUser, getMarketById, revalidatePath } = vi.hoisted(() => ({
  rpc: vi.fn(),
  getAuthUser: vi.fn(),
  getMarketById: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { buySharesAction } from "@/lib/trades/actions";

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: true,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({ rpc })),
}));

vi.mock("@/lib/auth/session", () => ({
  getAuthUser,
}));

vi.mock("@/lib/markets/queries", () => ({
  getMarketById,
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

const openMarket = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Open market",
  description: "",
  status: "open" as const,
  close_date: "2099-12-31T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
};

function makeFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("buySharesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthUser.mockResolvedValue({ id: "user-1" });
    getMarketById.mockResolvedValue(openMarket);
  });

  it("rejects signed-out users", async () => {
    getAuthUser.mockResolvedValue(null);

    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "yes",
        amount: "5.00",
      }),
    );

    expect(result.error).toBe("Sign in to buy shares.");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects invalid side", async () => {
    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "maybe",
        amount: "5.00",
      }),
    );

    expect(result.error).toBe("Choose Yes or No.");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects invalid amounts", async () => {
    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "yes",
        amount: "1.999",
      }),
    );

    expect(result.error).toContain("decimal places");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects closed markets", async () => {
    getMarketById.mockResolvedValue({
      ...openMarket,
      status: "closed",
    });

    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "yes",
        amount: "5.00",
      }),
    );

    expect(result.error).toBe("Buying is unavailable for this market.");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("maps insufficient balance RPC errors", async () => {
    rpc.mockResolvedValue({
      data: null,
      error: { message: "Insufficient fake balance" },
    });

    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "yes",
        amount: "5.00",
      }),
    );

    expect(result.error).toContain("enough fake balance");
  });

  it("completes a successful buy and revalidates pages", async () => {
    rpc.mockResolvedValue({
      data: {
        balance_cents: 9500,
        yes_shares_cents: 500,
        no_shares_cents: 0,
      },
      error: null,
    });

    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "yes",
        amount: "5.00",
        user_id: "spoofed-user",
      }),
    );

    expect(result.success).toContain("Yes shares");
    expect(result.balanceCents).toBe(9500);
    expect(result.yesSharesCents).toBe(500);
    expect(result.noSharesCents).toBe(0);
    expect(rpc).toHaveBeenCalledWith("buy_shares", {
      p_market_id: openMarket.id,
      p_side: "yes",
      p_amount_cents: 500,
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/markets/${openMarket.id}`);
    expect(revalidatePath).toHaveBeenCalledWith("/positions");
    expect(revalidatePath).toHaveBeenCalledWith("/markets");
  });

  it("updates No shares on a successful buy", async () => {
    rpc.mockResolvedValue({
      data: {
        balance_cents: 9000,
        yes_shares_cents: 500,
        no_shares_cents: 300,
      },
      error: null,
    });

    const result = await buySharesAction(
      {},
      makeFormData({
        market_id: openMarket.id,
        side: "no",
        amount: "3.00",
      }),
    );

    expect(result.success).toContain("No shares");
    expect(result.noSharesCents).toBe(300);
    expect(rpc).toHaveBeenCalledWith("buy_shares", {
      p_market_id: openMarket.id,
      p_side: "no",
      p_amount_cents: 300,
    });
  });
});
