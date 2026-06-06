import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketDetailInfo } from "@/components/marketlab/market-detail-info";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { Button } from "@/components/ui/button";
import { getMarketById, getMarketChartData } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MarketDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    return { title: "Market not found · MarketLab" };
  }

  return {
    title: `${market.title} · MarketLab`,
    description: market.description,
  };
}

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const chart = await getMarketChartData(market);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/markets">
            <ArrowLeft />
            Back to markets
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <MarketDetailInfo market={market} yesChance={chart.currentYesChance} />
        <ProbabilityChart
          points={chart.points}
          isFlatFallback={chart.isFlatFallback}
          currentYesChance={chart.currentYesChance}
        />
        <MarketBuySection market={market} />
      </div>
    </main>
  );
}
