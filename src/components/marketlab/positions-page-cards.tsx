import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PositionsSignedOutCard() {
  return (
    <Card data-testid="positions-signed-out">
      <CardHeader>
        <CardTitle>Sign in to view your positions</CardTitle>
        <CardDescription>
          Your positions are private. Sign in to see markets where you hold
          fake-money shares.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-3 border-t-0 bg-transparent">
        <Button variant="outline" size="sm" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
