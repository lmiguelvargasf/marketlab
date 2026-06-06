import type { Metadata } from "next";
import { PositionsList } from "@/components/marketlab/positions-list";
import { PositionsSignedOutCard } from "@/components/marketlab/positions-page-cards";
import { getAuthUser } from "@/lib/auth/session";
import { getUserPositions } from "@/lib/positions/queries";

export const metadata: Metadata = {
  title: "My Positions · MarketLab",
  description: "View your fake-money Yes/No positions across markets.",
};

export default async function PositionsPage() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            My Positions
          </h1>
          <p className="text-sm text-muted-foreground">
            Track fake-money Yes and No shares you hold across markets.
          </p>
        </div>
        <PositionsSignedOutCard />
      </main>
    );
  }

  const positions = await getUserPositions();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">My Positions</h1>
        <p className="text-sm text-muted-foreground">
          Markets where you hold fake-money Yes or No shares.
        </p>
      </div>
      <PositionsList positions={positions} />
    </main>
  );
}
