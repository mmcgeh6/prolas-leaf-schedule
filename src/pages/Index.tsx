import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Tile = ({ title, description, to }: { title: string; description: string; to: string }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button asChild>
        <Link to={to}>Open</Link>
      </Button>
    </CardContent>
  </Card>
);

const IndexPage = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <>
      <Seo
        title="Prolas Ops Planner & Check-In Demo"
        description="Demo: plan schedules, supervisor check-in with offline queue, and reporting for Prolas LTD."
        canonical={canonical}
      />
      <main className="container py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Prolas Ops Planner & Check-In Demo</h1>
          <p className="text-muted-foreground mt-2">Choose a module to explore the demo.</p>
        </header>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            title="Planner"
            description="Create daily/weekly schedules by Project → Site, add employees, and set approved hours."
            to="/planner"
          />
          <Tile
            title="Supervisor Check-In"
            description="Mobile-first clock in/out with offline queue, tasks, and notes."
            to="/supervisor"
          />
          <Tile
            title="Reporting"
            description="Scheduled vs Actual vs Approved, Utilization, Variance & Exceptions."
            to="/reporting"
          />
          <Tile
            title="Seed Data"
            description="Reload sample data for the demo with one click."
            to="/seed"
          />
        </section>
      </main>
    </>
  );
};

export default IndexPage;
