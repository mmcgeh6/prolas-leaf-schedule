import Seo from "@/components/Seo";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid, AreaChart, Area } from "recharts";

// Demo datasets
const weeklyData = [
  { name: "Mon", Scheduled: 64, Actual: 60, Approved: 62, Utilization: 0.9 },
  { name: "Tue", Scheduled: 72, Actual: 68, Approved: 70, Utilization: 0.92 },
  { name: "Wed", Scheduled: 56, Actual: 60, Approved: 58, Utilization: 0.88 },
  { name: "Thu", Scheduled: 80, Actual: 76, Approved: 78, Utilization: 0.95 },
  { name: "Fri", Scheduled: 68, Actual: 62, Approved: 65, Utilization: 0.89 },
];

const projectHours = [
  { name: "Project A", Hours: 75 },
  { name: "Project B", Hours: 90 },
  { name: "Project C", Hours: 60 },
  { name: "Project D", Hours: 80 },
  { name: "Project E", Hours: 70 },
];

const projects = [
  { id: "all", name: "All Projects", sites: [{ id: "all", name: "All Sites" }] },
  { id: "p1", name: "Greenfield Park", sites: [
    { id: "s1", name: "North Lawn" },
    { id: "s2", name: "South Entrance" },
  ]},
  { id: "p2", name: "Harborfront", sites: [
    { id: "s3", name: "Docks" },
    { id: "s4", name: "Boardwalk" },
  ]},
];

export default function Reporting() {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  const [projectId, setProjectId] = useState<string>("all");
  const sites = useMemo(() => projects.find(p => p.id === projectId)?.sites ?? projects[0].sites, [projectId]);
  const [siteId, setSiteId] = useState<string>("all");

  // Ensure site stays valid when project changes
  const isAllProjects = projectId === "all";
  const effectiveSiteId = isAllProjects ? "all" : siteId;

  return (
    <>
      <Seo
        title="Reporting | Prolas Ops Demo"
        description="Ops dashboard with rollup and per‑job reporting: metrics, charts, and exceptions."
        canonical={canonical}
      />
      <main className="container py-8">
        {/* Header with filters */}
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
            <p className="text-muted-foreground">View utilization, scheduled vs actual vs approved, and exceptions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select value={projectId} onValueChange={(val) => {
              setProjectId(val);
              // reset site on project change
              const first = projects.find(p=>p.id===val)?.sites?.[0]?.id ?? "all";
              setSiteId(first);
            }}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={effectiveSiteId} onValueChange={setSiteId}>
              <SelectTrigger className="w-full sm:w-56" aria-disabled={isAllProjects} disabled={isAllProjects}>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Metric tiles */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Scheduled Hours</p>
              <p className="mt-2 text-3xl font-bold">1,250</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Actual Hours</p>
              <p className="mt-2 text-3xl font-bold">1,180</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Approved Hours</p>
              <p className="mt-2 text-3xl font-bold">1,150</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">% Utilization</p>
              <p className="mt-2 text-3xl font-bold">92%</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Labor Cost</p>
              <p className="mt-2 text-3xl font-bold">$23,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Project Revenue</p>
              <p className="mt-2 text-3xl font-bold">$41,400</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Project Cost</p>
              <p className="mt-2 text-3xl font-bold">$28,750</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="mt-2 text-3xl font-bold">30.5%</p>
            </CardContent>
          </Card>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Hours" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Utilization</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="utilFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${Math.round(v*100)}%`} domain={[0, 1]} />
                  <Tooltip formatter={(v: number) => `${Math.round((v as number)*100)}%`} />
                  <Area type="monotone" dataKey="Utilization" stroke="hsl(var(--primary))" fill="url(#utilFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Exceptions table */}
        <section className="mt-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Exceptions Summary</CardTitle>
              <div className="text-sm text-muted-foreground">
                Scope: {projects.find(p=>p.id===projectId)?.name} {isAllProjects ? '' : `• ${sites.find(s=>s.id===siteId)?.name}`}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="py-3 px-4 text-left">Employee</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Project</th>
                      <th className="py-3 px-4 text-left">Exception</th>
                      <th className="py-3 px-4 text-left">Details</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-accent/10">
                      <td className="py-4 px-4 font-medium">John Doe</td>
                      <td className="py-4 px-4">2023-10-26</td>
                      <td className="py-4 px-4">Project B</td>
                      <td className="py-4 px-4"><Badge variant="destructive">Late Clock-in</Badge></td>
                      <td className="py-4 px-4">Clocked in 30 mins late</td>
                      <td className="py-4 px-4">Pending</td>
                    </tr>
                    <tr className="border-b hover:bg-accent/10">
                      <td className="py-4 px-4 font-medium">Jane Smith</td>
                      <td className="py-4 px-4">2023-10-26</td>
                      <td className="py-4 px-4">Project A</td>
                      <td className="py-4 px-4"><Badge variant="secondary">Early Clock-out</Badge></td>
                      <td className="py-4 px-4">Clocked out 45 mins early</td>
                      <td className="py-4 px-4">Approved</td>
                    </tr>
                    <tr className="border-b hover:bg-accent/10">
                      <td className="py-4 px-4 font-medium">Mike Johnson</td>
                      <td className="py-4 px-4">2023-10-25</td>
                      <td className="py-4 px-4">Project C</td>
                      <td className="py-4 px-4"><Badge>Missed Break</Badge></td>
                      <td className="py-4 px-4">Did not log break time</td>
                      <td className="py-4 px-4">Pending</td>
                    </tr>
                    <tr className="hover:bg-accent/10">
                      <td className="py-4 px-4 font-medium">Sarah Williams</td>
                      <td className="py-4 px-4">2023-10-25</td>
                      <td className="py-4 px-4">Project B</td>
                      <td className="py-4 px-4"><Badge variant="destructive">Geofence Alert</Badge></td>
                      <td className="py-4 px-4">Clocked in outside of project area</td>
                      <td className="py-4 px-4">Rejected</td>
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

