import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMarketById } from "@/lib/markets/queries";

const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select }));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    from,
  })),
}));

describe("getMarketById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when the market is missing", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    const market = await getMarketById("missing-id");

    expect(market).toBeNull();
    expect(from).toHaveBeenCalledWith("markets");
  });

  it("maps a found market row", async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: "market-1",
        title: "Will it rain?",
        description: "Quito weather market",
        status: "open",
        close_date: "2026-12-31T00:00:00.000Z",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      error: null,
    });

    const market = await getMarketById("market-1");

    expect(market).toEqual({
      id: "market-1",
      title: "Will it rain?",
      description: "Quito weather market",
      status: "open",
      close_date: "2026-12-31T00:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
    });
  });
});
