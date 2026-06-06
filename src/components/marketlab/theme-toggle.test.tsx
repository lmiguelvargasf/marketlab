import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/marketlab/theme-provider";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

describe("ThemeToggle", () => {
  it("renders the theme toggle button", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(html).toContain('data-testid="theme-toggle"');
    expect(html).toContain("Toggle theme");
  });
});
