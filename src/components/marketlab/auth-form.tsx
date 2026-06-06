"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type AuthActionState,
  signInAction,
  signUpAction,
} from "@/lib/auth/actions";

const initialState: AuthActionState = {};

type AuthFormMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthFormMode;
};

export function AuthFormState({ state }: { state: AuthActionState }) {
  if (state.status === "check_email") {
    return (
      <div
        className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4"
        data-testid="auth-check-email"
      >
        <p className="text-sm font-medium text-foreground">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your inbox. Open it to finish creating
          your account, then sign in.
        </p>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (state.error) {
    return (
      <p
        className="text-sm text-destructive"
        data-testid="auth-form-error"
        role="alert"
      >
        {state.error}
      </p>
    );
  }

  return null;
}

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "sign-in" ? signInAction : signUpAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.status === "check_email") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            Confirm your address to finish signing up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthFormState state={state} />
        </CardContent>
      </Card>
    );
  }

  const title = mode === "sign-in" ? "Sign in" : "Create account";
  const description =
    mode === "sign-in"
      ? "Use your email and password to access MarketLab."
      : "Join MarketLab with fake money to explore prediction markets.";
  const submitLabel = mode === "sign-in" ? "Sign in" : "Sign up";
  const alternateHref = mode === "sign-in" ? "/sign-up" : "/sign-in";
  const alternateLabel =
    mode === "sign-in" ? "Create an account" : "Already have an account?";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          <AuthFormState state={state} />

          {mode === "sign-up" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              required
              minLength={mode === "sign-up" ? 6 : undefined}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Please wait…" : submitLabel}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={alternateHref}
              className="font-medium text-primary hover:underline"
            >
              {alternateLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
