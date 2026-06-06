export type MarketStatus = "open" | "closed" | "resolved";

export type Market = {
  id: string;
  title: string;
  description: string;
  status: MarketStatus;
  close_date: string;
  created_at: string;
};

export type MarketPositionTotals = {
  yesTotal: number;
  noTotal: number;
  isMarketWide: boolean;
};

export type LedgerTradeEvent = {
  timestamp: string;
  yesDelta: number;
  noDelta: number;
};

export type ChartPoint = {
  timestamp: string;
  yesChance: number;
};

export type ChartSeries = {
  points: ChartPoint[];
  isFlatFallback: boolean;
  currentYesChance: number;
};
