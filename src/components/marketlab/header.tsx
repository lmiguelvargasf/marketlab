import Link from "next/link";

import { HeaderAccount } from "@/components/marketlab/header-account";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/markets"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            MarketLab
          </Link>
          <nav aria-label="Main" className="flex items-center gap-4">
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
            <Link
              href="/positions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Positions
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <HeaderAccount />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
