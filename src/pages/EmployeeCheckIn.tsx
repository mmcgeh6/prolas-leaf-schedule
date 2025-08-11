import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export default function EmployeeCheckIn() {
  const [online, setOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [queued, setQueued] = useState<number>(0);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const projectId = params.get("project") ?? "";
  const siteId = params.get("site") ?? "";

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

  const doPunch = async (type: "in" | "out" | "lunch_start" | "lunch_end") => {
    const payload = { employee_id: "self", ts: Date.now(), type, project_id: projectId, site_id: siteId, source: "qr" };

    if (!online) {
      await db.punchQueue.add({ payload, createdAt: new Date(), synced: false });
      const c = await db.punchQueue.count();
      setQueued(c);
      toast({ title: `Queued • ${label(type)}` });
      return;
    }

    // In a real app, call your API here. For now we just toast success.
    toast({ title: `${label(type)} recorded`, description: `${format(new Date(), "p")} • Project ${projectId} • Site ${siteId}` });
  };

  const label = (t: "in" | "out" | "lunch_start" | "lunch_end") =>
    ({ in: "Clock In", out: "Clock Out", lunch_start: "Lunch Start", lunch_end: "Lunch End" }[t]);

  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <>
      <Seo title="Employee Check-In" description="Self-service employee check-in for the selected project and site." canonical={canonical} />
      <main className="container py-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Employee Check-In</h1>
            <p className="text-muted-foreground">Project: {projectId || "N/A"} • Site: {siteId || "N/A"}</p>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className={online ? "text-primary" : "text-destructive"}>{online ? "Online" : "Offline"}</span>
                <Badge variant="secondary">Queued: {queued}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button onClick={() => doPunch("in")}>Clock In</Button>
              <Button variant="secondary" onClick={() => doPunch("lunch_start")}>Lunch Start</Button>
              <Button variant="secondary" onClick={() => doPunch("lunch_end")}>Lunch End</Button>
              <Button onClick={() => doPunch("out")}>Clock Out</Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">Note: Actions are stored offline if no connection and will sync when online.</p>
          </CardContent>
        </div>
      </main>
    </>
  );
}
