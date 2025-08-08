import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";

const data = [
  { name: 'Mon', Scheduled: 64, Actual: 60, Approved: 62 },
  { name: 'Tue', Scheduled: 72, Actual: 68, Approved: 70 },
  { name: 'Wed', Scheduled: 56, Actual: 60, Approved: 58 },
  { name: 'Thu', Scheduled: 80, Actual: 76, Approved: 78 },
  { name: 'Fri', Scheduled: 68, Actual: 62, Approved: 65 },
];

export default function Reporting() {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <>
      <Seo
        title="Reporting | Prolas Ops Demo"
        description="Ops dashboard: Scheduled vs Actual vs Approved, Utilization, and Exceptions."
        canonical={canonical}
      />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-6">Reporting</h1>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled vs Actual vs Approved</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Scheduled" fill="hsl(var(--accent))" />
                  <Bar dataKey="Actual" fill="hsl(var(--primary))" />
                  <Bar dataKey="Approved" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilization by Crew</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Actual" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="Scheduled" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Variance & Exceptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Project/Site</th>
                      <th className="py-2 pr-4">Reason</th>
                      <th className="py-2 pr-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Mon</td>
                      <td className="py-3 pr-4">Greenfield • North Lawn</td>
                      <td className="py-3 pr-4">Unscheduled Worker</td>
                      <td className="py-3 pr-4">Added on-site</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Thu</td>
                      <td className="py-3 pr-4">Harborfront • Docks</td>
                      <td className="py-3 pr-4">No-Show</td>
                      <td className="py-3 pr-4">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
