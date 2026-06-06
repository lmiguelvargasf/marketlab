import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HeaderAccountView } from "@/components/marketlab/header-account-view";
import { ThemeProvider } from "@/components/marketlab/theme-provider";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

describe("HeaderAccountView", () => {
  it("renders sign-in and sign-up actions when signed out", () => {
    const html = renderToStaticMarkup(
      <HeaderAccountView isAuthenticated={false} profile={null} />,
    );

    expect(html).toContain('data-testid="header-signed-out"');
    expect(html).toContain('href="/sign-in"');
    expect(html).toContain('href="/sign-up"');
    expect(html).not.toContain('data-testid="header-balance"');
    expect(html).not.toContain('data-testid="header-sign-out"');
  });

  it("renders balance and sign-out when signed in", () => {
    const html = renderToStaticMarkup(
      <HeaderAccountView
        isAuthenticated
        profile={{
          balance_cents: 10000,
          first_name: "Ada",
          last_name: "Lovelace",
        }}
      />,
    );

    expect(html).toContain('data-testid="header-signed-in"');
    expect(html).toContain('data-testid="header-balance"');
    expect(html).toContain("$100.00 fake");
    expect(html).toContain('data-testid="header-sign-out"');
    expect(html).not.toContain('href="/sign-in"');
    expect(html).not.toContain('href="/sign-up"');
  });

  it("renders missing profile state when authenticated without a profile", () => {
    const html = renderToStaticMarkup(
      <HeaderAccountView isAuthenticated profile={null} />,
    );

    expect(html).toContain('data-testid="header-balance-missing"');
    expect(html).toContain("Balance unavailable");
    expect(html).toContain('data-testid="header-sign-out"');
  });

  it("keeps the theme toggle alongside auth actions", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <HeaderAccountView isAuthenticated={false} profile={null} />
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(html).toContain('data-testid="header-signed-out"');
    expect(html).toContain('data-testid="theme-toggle"');
  });
});
