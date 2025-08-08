import Seo from "@/components/Seo";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

interface Emp { id: string; name: string; scheduled: boolean }

const sample: Emp[] = [
  { id: "e1", name: "Alice Johnson", scheduled: true },
  { id: "e2", name: "Bob Smith", scheduled: true },
  { id: "e9", name: "Chris Lee", scheduled: false },
];

export default function Supervisor() {
  const [queued, setQueued] = useState<number>(0);
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;

  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    db.punchQueue.count().then(setQueued);
    return () => {
      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }, []);

  const syncQueued = async () => {
    const count = await db.punchQueue.count();
    if (count === 0) return toast({ title: "Nothing to sync" });
    await db.punchQueue.clear();
    setQueued(0);
    toast({ title: "Synced queued punches" });
  };

  const handlePunch = async (emp: Emp, type: 'in' | 'out') => {
    const payload = { employee_id: emp.id, ts: Date.now(), type };
    if (!online) {
      await db.punchQueue.add({ payload, createdAt: new Date(), synced: false });
      const c = await db.punchQueue.count();
      setQueued(c);
      toast({ title: `Queued • ${emp.name} clock-${type}` });
    } else {
      toast({ title: `Clock-${type} • ${emp.name}`, description: "Synced" });
    }
  };

  return (
    <>
      <Seo
        title="Supervisor Check-In | Prolas Ops Demo"
        description="Clock in/out with one tap, tag tasks and notes. Works offline with auto-sync."
        canonical={canonical}
      />
      <main className="container p-0 sm:p-6">
        <Card className="sm:mt-4">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>Today – North Lawn</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className={online ? "text-primary" : "text-destructive"}>{online ? "Online" : "Offline"}</span>
              <Badge variant="secondary">Queued: {queued}</Badge>
              <Button variant="secondary" size="sm" onClick={syncQueued}>Sync</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {sample.map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    {!e.scheduled && (
                      <div className="text-xs text-destructive">Unscheduled • Reason required</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handlePunch(e, 'in')}>Clock In</Button>
                    <Button onClick={() => handlePunch(e, 'out')}>Clock Out</Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">Add Unscheduled</Button>
              <Button variant="secondary">End-of-Day Submit</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
