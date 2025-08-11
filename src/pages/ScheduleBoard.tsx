import Seo from "@/components/Seo";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addDays, format, startOfWeek } from "date-fns";

interface Site { id: string; name: string }
interface Project { id: string; name: string; sites: Site[] }
interface EmpCard { id: string; name: string; planned: number; total: number; status: "Scheduled" | "In Progress" | "Completed"; tasks?: string[] }

const projects: Project[] = [
  { id: "p1", name: "Acme Headquarters", sites: [ { id: "s1", name: "Main" }, { id: "s2", name: "Annex" } ] },
  { id: "p2", name: "Starlight Plaza", sites: [ { id: "s3", name: "Front" }, { id: "s4", name: "Back" } ] },
  { id: "p3", name: "Crestview Apartments", sites: [ { id: "s5", name: "North Court" }, { id: "s6", name: "South Court" } ] },
];

const seedEmployees: EmpCard[] = [
  { id: "e1", name: "Ethan Donovan", planned: 8, total: 4, status: "In Progress", tasks: ["Mowing & Edging", "Weeding Flower Beds", "Pruning Shrubs"] },
  { id: "e2", name: "Liam Rodriguez", planned: 8, total: 4, status: "In Progress" },
  { id: "e3", name: "Noah Chen", planned: 4, total: 0, status: "Scheduled" },
  { id: "e4", name: "Oliver Smith", planned: 4, total: 0, status: "Scheduled" },
  { id: "e5", name: "Lucas Wilson", planned: 2, total: 2, status: "Completed" },
  { id: "e6", name: "Henry Garcia", planned: 2, total: 2, status: "Completed" },
];

export default function ScheduleBoard() {
  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const [projectId, setProjectId] = useState<string>(projects[0].id);
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Simple board state: map siteId -> employee ids; "unassigned" bucket too
  const [board, setBoard] = useState<Record<string, string[]>>({
    unassigned: ["e3", "e4"],
    s1: ["e1", "e2"],
    s3: [],
    s5: ["e5", "e6"],
  });

  const sites = useMemo<Site[]>(() => {
    const current = projects.find(p => p.id === projectId)?.sites ?? [];
    return [{ id: "all", name: "All Sites" }, ...current];
  }, [projectId]);

  const employeesById = useMemo(() => Object.fromEntries(seedEmployees.map(e => [e.id, e])), []);

  const visibleColumns = useMemo(() => {
    const currentSites = projects.find(p => p.id === projectId)?.sites ?? [];
    const list = siteFilter === "all" ? currentSites : currentSites.filter(s => s.id === siteFilter);
    return [{ id: "unassigned", name: "Unassigned" } as Site, ...list];
  }, [projectId, siteFilter]);

  const handlePrevWeek = () => setWeekStart(addDays(weekStart, -7));
  const handleNextWeek = () => setWeekStart(addDays(weekStart, 7));

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, empId: string, from: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ empId, from }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, destSiteId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    const { empId, from } = JSON.parse(data) as { empId: string; from: string };
    if (from === destSiteId) return;
    setBoard((prev) => {
      const next: Record<string, string[]> = { ...prev };
      next[from] = (next[from] ?? []).filter(id => id !== empId);
      next[destSiteId] = [...(next[destSiteId] ?? []), empId];
      return next;
    });
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const filtered = (empIds: string[]) => empIds.filter(id => {
    const emp = employeesById[id];
    if (!emp) return false;
    if (statusFilter !== "all" && emp.status !== statusFilter) return false;
    return true;
  });

  const statusBadge = (status: EmpCard["status"]) => {
    switch (status) {
      case "In Progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "Completed":
        return <Badge>Completed</Badge>;
      default:
        return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <>
      <Seo
        title="Schedule Board | Prolas Ops Demo"
        description="Weekly rollup board with job site filters and draggable employee cards."
        canonical={canonical}
      />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">Week of {format(weekStart, "MMM d, yyyy")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={handlePrevWeek} aria-label="Previous week">◀</Button>
              <Input type="date" value={format(weekStart, "yyyy-MM-dd")} onChange={(e) => setWeekStart(startOfWeek(new Date(e.target.value), { weekStartsOn: 1 }))} className="w-[12.5rem]" />
              <Button variant="secondary" onClick={handleNextWeek} aria-label="Next week">▶</Button>
            </div>
            <Select value={projectId} onValueChange={(v) => { setProjectId(v); setSiteFilter("all"); }}>
              <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Project" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={siteFilter} onValueChange={setSiteFilter}>
              <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Site" /></SelectTrigger>
              <SelectContent>
                {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleColumns.map((col) => {
            const empIds = filtered(board[col.id] ?? []);
            return (
              <div key={col.id} className={col.id === "unassigned" ? "rounded-lg border-2 border-dashed" : "rounded-lg border bg-card shadow-sm"}
                   onDragOver={allowDrop} onDrop={(e) => onDrop(e, col.id)}>
                <div className={col.id === "unassigned" ? "p-4 text-center" : "p-4 border-b"}>
                  <h3 className="font-semibold text-lg">{col.name}</h3>
                  {col.id !== "unassigned" && (
                    <p className="text-sm text-muted-foreground">{empIds.length} assignments</p>
                  )}
                </div>
                <div className="p-4 space-y-4 min-h-[160px]">
                  {empIds.map((id) => {
                    const emp = employeesById[id];
                    return (
                      <div key={id} className="rounded-lg border bg-muted p-4 cursor-grab" draggable onDragStart={(e) => onDragStart(e, id, col.id)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{emp.name}</p>
                            <p className="text-sm text-muted-foreground">{emp.total.toFixed(1)} / {emp.planned.toFixed(1)} hrs</p>
                          </div>
                          {statusBadge(emp.status)}
                        </div>
                        {emp.tasks && (
                          <ul className="mt-3 space-y-1 text-sm text-foreground/80">
                            {emp.tasks.slice(0,3).map((t, i) => (
                              <li key={i} className="flex items-center gap-2">• {t}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
