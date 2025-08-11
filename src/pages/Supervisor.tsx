import Seo from "@/components/Seo";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface EmpRow {
  id: string;
  name: string;
  scheduled: boolean;
  clockedIn: boolean;
  lastEvent?: string;
}

const employees: EmpRow[] = [
  { id: "e1", name: "Ethan Harper", scheduled: true, clockedIn: true, lastEvent: "7:58 AM" },
  { id: "e2", name: "Olivia Bennett", scheduled: true, clockedIn: false, lastEvent: "Clocked Out 5:02 PM" },
  { id: "e3", name: "Noah Carter", scheduled: false, clockedIn: false },
  { id: "e4", name: "Ava Thompson", scheduled: true, clockedIn: false, lastEvent: "Early Leave" },
];

const projects = [
  { id: "p1", name: "Grand Hyatt Complex", sites: [
    { id: "s1", name: "Main Building" },
    { id: "s2", name: "Parking Lot" },
  ]},
  { id: "p2", name: "Marriott Downtown", sites: [
    { id: "s3", name: "Lobby" },
    { id: "s4", name: "Courtyard" },
  ]},
];

const tasks = [
  { id: "t1", name: "Landscaping" },
  { id: "t2", name: "Maintenance" },
];

export default function Supervisor() {
  const [queued, setQueued] = useState<number>(0);
  const [online, setOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  const [projectId, setProjectId] = useState<string>(projects[0].id);
  const sites = useMemo(() => projects.find(p => p.id === projectId)?.sites ?? [], [projectId]);
  const [siteId, setSiteId] = useState<string>(projects[0].sites[0].id);

  useEffect(() => {
    // Ensure site stays in sync with project
    if (!sites.find(s => s.id === siteId) && sites[0]) {
      setSiteId(sites[0].id);
    }
  }, [projectId]);

  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    db.punchQueue.count().then(setQueued);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, []);

  const syncQueued = async () => {
    const count = await db.punchQueue.count();
    if (count === 0) return toast({ title: "Nothing to sync" });
    await db.punchQueue.clear();
    setQueued(0);
    toast({ title: "Synced queued punches" });
  };

  const handlePunch = async (emp: EmpRow, type: "in" | "out") => {
    const payload = { employee_id: emp.id, ts: Date.now(), type, project_id: projectId, site_id: siteId };
    if (!online) {
      await db.punchQueue.add({ payload, createdAt: new Date(), synced: false });
      const c = await db.punchQueue.count();
      setQueued(c);
      toast({ title: `Queued • ${emp.name} clock-${type}` });
    } else {
      toast({ title: `Clock-${type} • ${emp.name}`, description: `${projects.find(p=>p.id===projectId)?.name} • ${sites.find(s=>s.id===siteId)?.name}` });
    }
  };

  return (
    <>
      <Seo
        title="Supervisor Check-In | Prolas Ops Demo"
        description="Clock in/out with one tap, choose job site via dropdowns, tag tasks and sub-sites. Works offline with auto-sync."
        canonical={canonical}
      />
      <main className="container py-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          {/* Header row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
            <div>
              <h2 className="text-3xl font-bold">Check-in</h2>
              <p className="text-muted-foreground">Today, {format(new Date(), "MMMM d")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={siteId} onValueChange={setSiteId}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Status bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <span className={online ? "text-primary" : "text-destructive"}>{online ? "Online" : "Offline"}</span>
                <Badge variant="secondary">Queued: {queued}</Badge>
                <Button variant="secondary" size="sm" onClick={syncQueued}>Sync</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">Add Unscheduled Employee</Button>
                <Button>Review & Submit</Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-6 py-4">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-secondary text-muted-foreground border-y">
                    <th className="p-3 font-medium text-left">Employee</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Task</th>
                    <th className="p-3 font-medium">Sub-site</th>
                    <th className="p-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id} className="border-b hover:bg-accent/10">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-accent/30" />
                          <div>
                            <div className="font-medium">{e.name}</div>
                            <div className="text-xs text-muted-foreground">{e.clockedIn ? e.lastEvent : e.lastEvent ?? "Not Clocked In"}</div>
                            {!e.scheduled && (
                              <div className="mt-1 flex gap-2">
                                <Badge variant="destructive">Unscheduled</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {e.clockedIn ? (
                          <Badge>On Site</Badge>
                        ) : (
                          <span className="text-muted-foreground">Off Site</span>
                        )}
                      </td>
                      <td className="p-4">
                        {e.clockedIn ? (
                          <Select defaultValue={tasks[0].id}>
                            <SelectTrigger className="w-48"><SelectValue placeholder="Task" /></SelectTrigger>
                            <SelectContent>
                              {tasks.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground">Not Clocked In</span>
                        )}
                      </td>
                      <td className="p-4">
                        {e.clockedIn ? (
                          <Select defaultValue={sites[0]?.id}>
                            <SelectTrigger className="w-48"><SelectValue placeholder="Sub-site" /></SelectTrigger>
                            <SelectContent>
                              {sites.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-muted-foreground">Not Clocked In</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {e.clockedIn ? (
                          <Button variant="secondary" className="w-28" onClick={() => handlePunch(e, "out")}>Clock Out</Button>
                        ) : (
                          <Button className="w-28" onClick={() => handlePunch(e, "in")}>Clock In</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </div>
      </main>
    </>
  );
}

