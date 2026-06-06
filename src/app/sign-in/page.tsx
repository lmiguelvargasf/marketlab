import type { Metadata } from "next";

import { AuthForm } from "@/components/marketlab/auth-form";

export const metadata: Metadata = {
  title: "Sign in · MarketLab",
  description: "Sign in to MarketLab with your email and password.",
};

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <AuthForm mode="sign-in" />
    </main>
  );
}
