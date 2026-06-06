import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketsEmptyState() {
  return (
    <Card className="border-dashed" data-testid="markets-empty-state">
      <CardHeader>
        <CardTitle>No markets yet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Markets will appear here once they are added to the database. Browse
        fictional Yes/No markets using fake money when they are available.
      </CardContent>
    </Card>
  );
}
