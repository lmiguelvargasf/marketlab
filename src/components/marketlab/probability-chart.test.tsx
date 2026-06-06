import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProbabilityChart } from "@/components/marketlab/probability-chart";

describe("ProbabilityChart", () => {
  it("renders the chart with a neutral baseline flat line", () => {
    const html = renderToStaticMarkup(
      <ProbabilityChart
        points={[
          { timestamp: "2026-01-01T00:00:00.000Z", yesChance: 50 },
          { timestamp: "2026-06-06T12:00:00.000Z", yesChance: 50 },
        ]}
        isFlatFallback
        currentYesChance={50}
      />,
    );

    expect(html).toContain('data-testid="probability-chart"');
    expect(html).toContain('data-testid="yes-chance-value"');
    expect(html).toContain("50%");
    expect(html).toContain('data-testid="chart-fallback-label"');
    expect(html).toContain("<path");
  });
});
