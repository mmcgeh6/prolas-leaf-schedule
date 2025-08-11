import Seo from "@/components/Seo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";

interface EmployeeRow {
  id: string;
  name: string;
  plannedIn?: string;
  plannedOut?: string;
  approvedHours?: number;
  mtd?: number;
  week?: number;
  custom?: number;
}

const employees: EmployeeRow[] = [
  { id: "e1", name: "Ethan Carter", plannedIn: "08:00", plannedOut: "17:00", approvedHours: 8, mtd: 120, week: 40, custom: 20 },
  { id: "e2", name: "Olivia Bennett", plannedIn: "08:00", plannedOut: "17:00", approvedHours: 8, mtd: 110, week: 35, custom: 15 },
  { id: "e3", name: "Noah Thompson", plannedIn: "08:00", plannedOut: "17:00", approvedHours: 8, mtd: 130, week: 45, custom: 25 },
];

export default function Planner() {
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<"daily" | "weekly">("weekly");
  const [project, setProject] = useState<string>("pr1");
  const [site, setSite] = useState<string>("s1");

  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const onDateChange = (value: string) => {
    try {
      setDate(parseISO(value));
    } catch {
      // noop
    }
  };

  return (
    <>
      <Seo
        title="Schedule | Prolas Ops Demo"
        description="Manage your team's schedule by project and site. Add employees, set approved hours, and include recurring tasks."
        canonical={canonical}
      />
      <main className="container py-8">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">Manage your team's schedule for the week.</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-[12.5rem]"
              aria-label="Select date"
            />
            <div className="flex items-center rounded-md bg-secondary p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("px-3", mode === "daily" && "bg-card text-primary shadow")}
                onClick={() => setMode("daily")}
                aria-pressed={mode === "daily"}
              >
                Daily
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("px-3", mode === "weekly" && "bg-card text-primary shadow")}
                onClick={() => setMode("weekly")}
                aria-pressed={mode === "weekly"}
              >
                Weekly
              </Button>
            </div>
            <Button variant="secondary">Copy Last Week</Button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={project} onValueChange={setProject}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pr1">Greenfield Park</SelectItem>
                      <SelectItem value="pr2">Harborfront</SelectItem>
                      <SelectItem value="pr3">Riverside</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="site">Site</Label>
                  <Select value={site} onValueChange={setSite}>
                    <SelectTrigger id="site">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Main Building</SelectItem>
                      <SelectItem value="s2">North Lawn</SelectItem>
                      <SelectItem value="s3">Courtyard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>07/01/2024</span><span>8 hrs</span></li>
                  <li className="flex justify-between"><span>07/08/2024</span><span>8 hrs</span></li>
                  <li className="flex justify-between"><span>07/15/2024</span><span>8 hrs</span></li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recurring Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>Mowing</span><span>4 hrs</span></li>
                  <li className="flex justify-between"><span>Trimming</span><span>2 hrs</span></li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="py-3 px-4 text-left">Employee</th>
                        <th className="py-3 px-4 text-center">MTD</th>
                        <th className="py-3 px-4 text-center">This Week</th>
                        <th className="py-3 px-4 text-center">Custom</th>
                        <th className="py-3 px-4 text-left">Planned In</th>
                        <th className="py-3 px-4 text-left">Planned Out</th>
                        <th className="py-3 px-4 text-center">Approved Hrs</th>
                        <th className="py-3 px-4 text-center">Override</th>
                        <th className="py-3 px-4 text-left">Quick Tasks</th>
                        <th className="py-3 px-4 text-left">Sub-site</th>
                        <th className="py-3 px-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((e) => (
                        <tr key={e.id} className="border-b last:border-b-0 hover:bg-accent/10">
                          <td className="py-4 px-4 font-medium">{e.name}</td>
                          <td className="py-4 px-4 text-center">{e.mtd}</td>
                          <td className="py-4 px-4 text-center">{e.week}</td>
                          <td className="py-4 px-4 text-center">{e.custom}</td>
                          <td className="py-4 px-4"><Input type="time" defaultValue={e.plannedIn} className="w-28" aria-label={`Planned in for ${e.name}`} /></td>
                          <td className="py-4 px-4"><Input type="time" defaultValue={e.plannedOut} className="w-28" aria-label={`Planned out for ${e.name}`} /></td>
                          <td className="py-4 px-4 text-center">
                            <Input type="number" defaultValue={e.approvedHours} className="w-20 text-center" aria-label={`Approved hours for ${e.name}`} />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Checkbox aria-label={`Override approved hours for ${e.name}`} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <Select defaultValue="none">
                                <SelectTrigger className="w-36" aria-label={`Quick task A for ${e.name}`}>
                                  <SelectValue placeholder="Task A" />
                                </SelectTrigger>
                                <SelectContent className="z-50">
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="mow">Mowing & Edging</SelectItem>
                                  <SelectItem value="trim">Trimming</SelectItem>
                                  <SelectItem value="weed">Weeding</SelectItem>
                                  <SelectItem value="blow">Blowing</SelectItem>
                                  <SelectItem value="mulch">Mulching</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select defaultValue="none">
                                <SelectTrigger className="w-36" aria-label={`Quick task B for ${e.name}`}>
                                  <SelectValue placeholder="Task B" />
                                </SelectTrigger>
                                <SelectContent className="z-50">
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="mow">Mowing & Edging</SelectItem>
                                  <SelectItem value="trim">Trimming</SelectItem>
                                  <SelectItem value="weed">Weeding</SelectItem>
                                  <SelectItem value="blow">Blowing</SelectItem>
                                  <SelectItem value="mulch">Mulching</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Select defaultValue="bldg-a">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Sub-site" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bldg-a">Building A</SelectItem>
                                <SelectItem value="bldg-b">Building B</SelectItem>
                                <SelectItem value="bldg-c">Building C</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Remove ${e.name}`}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button>Add Employee</Button>
                  <Button variant="secondary">Add Many (Crew)</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </section>

        <footer className="mt-8 flex justify-end gap-3">
          <Button variant="secondary">Save Draft</Button>
          <Button>Publish Day</Button>
        </footer>
      </main>
    </>
  );
}
