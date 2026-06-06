import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { formatFakeBalance } from "@/lib/profile/format";
import type { Profile } from "@/lib/profile/queries";

type HeaderAccountViewProps = {
  isAuthenticated: boolean;
  profile: Profile | null;
};

export function HeaderAccountView({
  isAuthenticated,
  profile,
}: HeaderAccountViewProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2" data-testid="header-signed-out">
        <Button variant="outline" size="sm" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3" data-testid="header-signed-in">
      {profile ? (
        <span
          className="hidden text-sm font-medium text-foreground sm:inline"
          data-testid="header-balance"
        >
          {formatFakeBalance(profile.balance_cents)}
        </span>
      ) : (
        <span
          className="hidden text-sm text-muted-foreground sm:inline"
          data-testid="header-balance-missing"
        >
          Balance unavailable
        </span>
      )}

      <form action={signOutAction}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          data-testid="header-sign-out"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
