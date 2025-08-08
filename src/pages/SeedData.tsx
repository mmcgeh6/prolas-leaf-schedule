import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function SeedData() {
  const [lastSeeded, setLastSeeded] = useState<string | null>(null);
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  useEffect(() => {
    setLastSeeded(localStorage.getItem('demo:lastSeeded'));
  }, []);

  const reload = () => {
    const ts = new Date().toISOString();
    localStorage.setItem('demo:lastSeeded', ts);
    setLastSeeded(ts);
    toast({ title: "Sample data reloaded" });
  };

  return (
    <>
      <Seo
        title="Seed Data | Prolas Ops Demo"
        description="Reload sample data for the Prolas demo."
        canonical={canonical}
      />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-6">Seed Data</h1>

        <Card>
          <CardHeader>
            <CardTitle>Reload Sample Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={reload}>Reload sample data</Button>
            <p className="text-sm text-muted-foreground">
              Last seeded: {lastSeeded ? new Date(lastSeeded).toLocaleString() : '—'}
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
