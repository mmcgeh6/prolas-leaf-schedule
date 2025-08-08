import Seo from "@/components/Seo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EmployeeRow {
  id: string;
  name: string;
  crew?: string;
  plannedIn?: string;
  plannedOut?: string;
  approvedHours?: number;
}

const employees: EmployeeRow[] = [
  { id: "e1", name: "Alice Johnson", crew: "A", plannedIn: "07:30", plannedOut: "15:30", approvedHours: 8 },
  { id: "e2", name: "Bob Smith", crew: "B", plannedIn: "08:00", plannedOut: "16:00", approvedHours: 7.5 },
];

export default function Planner() {
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState<string>("pr1");
  const [site, setSite] = useState<string>("s1");

  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <>
      <Seo
        title="Planner | Prolas Ops Demo"
        description="Plan daily/weekly schedules by project and site. Add employees, set approved hours, and view totals."
        canonical={canonical}
      />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-6">Planner</h1>

        <section className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start font-normal")}> 
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Project</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pr1">Greenfield Park</SelectItem>
                <SelectItem value="pr2">Harborfront</SelectItem>
                <SelectItem value="pr3">Riverside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Site</Label>
            <Select value={site} onValueChange={setSite}>
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s1">North Lawn</SelectItem>
                <SelectItem value="s2">South Entrance</SelectItem>
                <SelectItem value="s3">Courtyard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="mb-4 flex gap-2">
          <Button variant="secondary">Add Employee</Button>
          <Button variant="secondary">Add Many</Button>
          <Button variant="secondary">Recurring Tasks</Button>
          <Button>Publish Day</Button>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Schedule for {format(date, "PPP")} – Project: {project.toUpperCase()} • Site: {site.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Employee</th>
                    <th className="py-2 pr-4">Planned In</th>
                    <th className="py-2 pr-4">Planned Out</th>
                    <th className="py-2 pr-4">Quick Tasks</th>
                    <th className="py-2 pr-4">MTD</th>
                    <th className="py-2 pr-4">This Week</th>
                    <th className="py-2 pr-4">Custom</th>
                    <th className="py-2 pr-4">Approved (hrs)</th>
                    <th className="py-2">Override</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4">{e.name}</td>
                      <td className="py-3 pr-4"><Input defaultValue={e.plannedIn} className="w-28" /></td>
                      <td className="py-3 pr-4"><Input defaultValue={e.plannedOut} className="w-28" /></td>
                      <td className="py-3 pr-4 text-muted-foreground">Mow, Edge</td>
                      <td className="py-3 pr-4">72.0</td>
                      <td className="py-3 pr-4">14.5</td>
                      <td className="py-3 pr-4">22.0</td>
                      <td className="py-3 pr-4"><Input defaultValue={e.approvedHours} className="w-24" /></td>
                      <td className="py-3"><Input type="checkbox" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-muted-foreground mt-3">Empty state: Use Copy Last Week to jump-start this schedule.</div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
