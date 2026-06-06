import type { Metadata } from "next";

import { AuthForm } from "@/components/marketlab/auth-form";

export const metadata: Metadata = {
  title: "Sign up · MarketLab",
  description: "Create a MarketLab account with fake money.",
};

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <AuthForm mode="sign-up" />
    </main>
  );
}
