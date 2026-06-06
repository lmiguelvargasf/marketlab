"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { filterChartPointsByRange } from "@/lib/markets/chart-data";
import { formatYesChance } from "@/lib/markets/format";
import type { ChartPoint } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type Range = "all" | "7d" | "30d";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 36, left: 44 };

function formatAxisDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function buildPath(points: ChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const timestamps = points.map((point) => new Date(point.timestamp).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const timeSpan = Math.max(maxTime - minTime, 1);

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return points
    .map((point, index) => {
      const x =
        PADDING.left +
        ((new Date(point.timestamp).getTime() - minTime) / timeSpan) *
          innerWidth;
      const y =
        PADDING.top + innerHeight - (point.yesChance / 100) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ProbabilityChart({
  points,
  isFlatFallback,
  currentYesChance,
}: {
  points: ChartPoint[];
  isFlatFallback: boolean;
  currentYesChance: number;
}) {
  const [range, setRange] = useState<Range>("all");

  const visiblePoints = useMemo(
    () => filterChartPointsByRange(points, range),
    [points, range],
  );

  const path = useMemo(() => buildPath(visiblePoints), [visiblePoints]);
  const firstLabel = visiblePoints[0]?.timestamp;
  const lastLabel = visiblePoints.at(-1)?.timestamp;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return (
    <Card data-testid="probability-chart">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Yes probability</CardTitle>
          <CardDescription>
            {isFlatFallback ? (
              <span data-testid="chart-fallback-label">
                Current market balance — no historical trades yet
              </span>
            ) : (
              "Historical Yes chance from recorded market activity"
            )}
          </CardDescription>
        </div>
        <div
          className="text-3xl font-semibold tracking-tight"
          data-testid="yes-chance-value"
        >
          {formatYesChance(currentYesChance)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "7d", "30d"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={range === value ? "default" : "outline"}
              onClick={() => setRange(value)}
            >
              {value === "all" ? "All" : value.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[320px] text-muted-foreground"
            role="img"
            aria-label={`Yes probability chart at ${formatYesChance(currentYesChance)}`}
          >
            <title>Yes probability over time</title>
            {[0, 50, 100].map((tick) => {
              const y = PADDING.top + innerHeight - (tick / 100) * innerHeight;
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    className="stroke-border"
                    strokeDasharray={tick === 50 ? "4 4" : undefined}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            <path
              d={path}
              fill="none"
              className="stroke-[var(--chart-1)]"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {firstLabel ? (
              <text
                x={PADDING.left}
                y={CHART_HEIGHT - 10}
                className="fill-muted-foreground text-[10px]"
              >
                {formatAxisDate(firstLabel)}
              </text>
            ) : null}
            {lastLabel ? (
              <text
                x={CHART_WIDTH - PADDING.right}
                y={CHART_HEIGHT - 10}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {formatAxisDate(lastLabel)}
              </text>
            ) : null}
          </svg>
        </div>

        <p
          className={cn(
            "text-xs text-muted-foreground",
            isFlatFallback && "italic",
          )}
        >
          {isFlatFallback
            ? "Flat line reflects the current computed or neutral Yes chance, not historical price movement."
            : "Chart shows market-level Yes sentiment derived from available ledger activity."}
        </p>
      </CardContent>
    </Card>
  );
}
