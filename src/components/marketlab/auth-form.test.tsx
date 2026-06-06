import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AuthFormState } from "@/components/marketlab/auth-form";

describe("AuthFormState", () => {
  it("renders the check your email state", () => {
    const html = renderToStaticMarkup(
      <AuthFormState state={{ status: "check_email" }} />,
    );

    expect(html).toContain('data-testid="auth-check-email"');
    expect(html).toContain("Check your email");
    expect(html).toContain('href="/sign-in"');
  });

  it("renders validation and auth errors", () => {
    const html = renderToStaticMarkup(
      <AuthFormState state={{ error: "Invalid login credentials" }} />,
    );

    expect(html).toContain('data-testid="auth-form-error"');
    expect(html).toContain("Invalid login credentials");
  });

  it("renders nothing for the initial empty state", () => {
    const html = renderToStaticMarkup(<AuthFormState state={{}} />);

    expect(html).toBe("");
  });
});
