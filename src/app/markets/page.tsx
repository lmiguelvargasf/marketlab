import type { Metadata } from "next";

import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { getMarkets } from "@/lib/markets/queries";

export const metadata: Metadata = {
  title: "Markets · MarketLab",
  description: "Browse fictional Yes/No markets using fake money.",
};

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse fictional Yes/No markets using fake money.
        </p>
      </div>

      {markets.length === 0 ? (
        <MarketsEmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </main>
  );
}
