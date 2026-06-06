import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PositionsEmptyState() {
  return (
    <Card className="border-dashed" data-testid="positions-empty-state">
      <CardHeader>
        <CardTitle>No positions yet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Buy Yes or No shares with fake money on an open market. Your positions
        will appear here after your first purchase.
      </CardContent>
    </Card>
  );
}
