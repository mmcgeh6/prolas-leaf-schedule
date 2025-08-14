import Seo from "@/components/Seo";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  rate?: number;
  status: "active" | "inactive";
};

type Crew = {
  id: string;
  name: string;
  foremanId?: string;
  memberIds: string[];
};

const seedEmployees: Employee[] = [
  { id: "e1", firstName: "John", lastName: "Doe", email: "john@acme.com", phone: "555-1234", role: "Laborer", rate: 22, status: "active" },
  { id: "e2", firstName: "Jane", lastName: "Smith", email: "jane@acme.com", phone: "555-5678", role: "Operator", rate: 28, status: "active" },
  { id: "e3", firstName: "Mike", lastName: "Johnson", email: "mike@acme.com", phone: "555-8765", role: "Foreman", rate: 35, status: "inactive" },
];

export default function EmployeesPage() {
  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [crews, setCrews] = useState<Crew[]>([{ id: "c1", name: "Crew Alpha", foremanId: "e3", memberIds: ["e1", "e2"] }]);

  // Employees form state
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const emptyEmp: Employee = { id: "", firstName: "", lastName: "", email: "", phone: "", role: "", rate: 0, status: "active" };
  const [empForm, setEmpForm] = useState<Employee>(emptyEmp);

  const startAddEmployee = () => { setEditingEmpId(null); setEmpForm(emptyEmp); };
  const startEditEmployee = (id: string) => {
    setEditingEmpId(id);
    const e = employees.find(x => x.id === id);
    if (e) setEmpForm({ ...e });
  };
  const saveEmployee = () => {
    if (!empForm.firstName || !empForm.lastName) return;
    if (editingEmpId) {
      setEmployees(prev => prev.map(e => e.id === editingEmpId ? { ...empForm, id: editingEmpId } : e));
    } else {
      const id = `e${Date.now()}`;
      setEmployees(prev => [{ ...empForm, id }, ...prev]);
    }
    setEmpForm(emptyEmp);
    setEditingEmpId(null);
  };
  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    // remove from crews
    setCrews(prev => prev.map(c => ({ ...c, memberIds: c.memberIds.filter(m => m !== id), foremanId: c.foremanId === id ? undefined : c.foremanId })));
  };

  // Crew form state
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);
  const emptyCrew: Crew = { id: "", name: "", foremanId: undefined, memberIds: [] };
  const [crewForm, setCrewForm] = useState<Crew>(emptyCrew);

  const startAddCrew = () => { setEditingCrewId(null); setCrewForm(emptyCrew); };
  const startEditCrew = (id: string) => {
    setEditingCrewId(id);
    const c = crews.find(x => x.id === id);
    if (c) setCrewForm({ ...c });
  };
  const saveCrew = () => {
    if (!crewForm.name) return;
    if (editingCrewId) {
      setCrews(prev => prev.map(c => c.id === editingCrewId ? { ...crewForm, id: editingCrewId } : c));
    } else {
      const id = `c${Date.now()}`;
      setCrews(prev => [{ ...crewForm, id }, ...prev]);
    }
    setCrewForm(emptyCrew);
    setEditingCrewId(null);
  };
  const deleteCrew = (id: string) => setCrews(prev => prev.filter(c => c.id !== id));

  const employeesById = useMemo(() => Object.fromEntries(employees.map(e => [e.id, e])), [employees]);

  return (
    <>
      <Seo title="Employees & Crews | Prolas Ops Demo" description="Manage employees and crews for scheduling and reporting." canonical={canonical} />
      <main className="container py-8">
        <section className="rounded-xl bg-card border shadow-sm p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Employees & Crews</h1>
            <p className="text-muted-foreground">Create and manage employees, and organize them into crews.</p>
          </header>

          <Tabs defaultValue="employees">
            <TabsList className="mb-4">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="crews">Crews</TabsTrigger>
            </TabsList>

            <TabsContent value="employees">
              <div className="flex items-end gap-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  <div>
                    <Label htmlFor="first">First name</Label>
                    <Input id="first" value={empForm.firstName} onChange={e => setEmpForm({ ...empForm, firstName: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="last">Last name</Label>
                    <Input id="last" value={empForm.lastName} onChange={e => setEmpForm({ ...empForm, lastName: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={empForm.role} onChange={e => setEmpForm({ ...empForm, role: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="rate">Hourly rate</Label>
                    <Input id="rate" type="number" value={empForm.rate ?? 0} onChange={e => setEmpForm({ ...empForm, rate: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={empForm.status} onValueChange={(v: Employee["status"]) => setEmpForm({ ...empForm, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={saveEmployee}>{editingEmpId ? "Update" : "Add"}</Button>
                {editingEmpId && (
                  <Button variant="secondary" onClick={() => { setEditingEmpId(null); setEmpForm(emptyEmp); }}>Cancel</Button>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Role</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Rate</th>
                          <th className="py-3 px-4 text-left">Contact</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(e => (
                          <tr key={e.id} className="border-b hover:bg-accent/10">
                            <td className="py-3 px-4 font-medium">{e.firstName} {e.lastName}</td>
                            <td className="py-3 px-4">{e.role}</td>
                            <td className="py-3 px-4">{e.status}</td>
                            <td className="py-3 px-4 text-right">{e.rate ? `$${e.rate.toFixed(2)}` : "-"}</td>
                            <td className="py-3 px-4">{e.email || e.phone || "-"}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => startEditEmployee(e.id)}>Edit</Button>
                                <Button variant="destructive" onClick={() => deleteEmployee(e.id)}>Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {employees.length === 0 && (
                          <tr><td className="py-3 px-4 text-muted-foreground" colSpan={6}>No employees</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crews">
              <div className="flex items-end gap-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  <div>
                    <Label htmlFor="cname">Crew name</Label>
                    <Input id="cname" value={crewForm.name} onChange={e => setCrewForm({ ...crewForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Foreman</Label>
                    <Select value={crewForm.foremanId ?? "none"} onValueChange={(v) => setCrewForm({ ...crewForm, foremanId: v === "none" ? undefined : v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select foreman" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {employees.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={saveCrew}>{editingCrewId ? "Update" : "Add"}</Button>
                {editingCrewId && (
                  <Button variant="secondary" onClick={() => { setEditingCrewId(null); setCrewForm(emptyCrew); }}>Cancel</Button>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Crews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {crews.map(c => (
                      <div key={c.id} className="rounded-lg border p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-sm text-muted-foreground">Foreman: {c.foremanId ? `${employeesById[c.foremanId]?.firstName} ${employeesById[c.foremanId]?.lastName}` : "None"}</div>
                            <div className="text-sm text-muted-foreground">Members: {c.memberIds.map(id => `${employeesById[id]?.firstName} ${employeesById[id]?.lastName}`).join(", ") || "None"}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => startEditCrew(c.id)}>Edit</Button>
                            <Button variant="destructive" onClick={() => deleteCrew(c.id)}>Delete</Button>
                          </div>
                        </div>
                        {editingCrewId === c.id && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <Label>Rename</Label>
                              <Input value={crewForm.name} onChange={e => setCrewForm({ ...crewForm, name: e.target.value })} />
                            </div>
                            <div className="md:col-span-1">
                              <Label>Foreman</Label>
                               <Select value={crewForm.foremanId ?? "none"} onValueChange={(v) => setCrewForm({ ...crewForm, foremanId: v === "none" ? undefined : v })}>
                                 <SelectTrigger>
                                   <SelectValue placeholder="Select foreman" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="none">None</SelectItem>
                                  {employees.map(e => (
                                    <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-3">
                              <Label>Members</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {employees.map(e => {
                                  const checked = crewForm.memberIds.includes(e.id);
                                  return (
                                    <label key={e.id} className="flex items-center gap-2 rounded-md border p-2">
                                      <Checkbox checked={checked} onCheckedChange={(v) => {
                                        const on = Boolean(v);
                                        setCrewForm(prev => ({
                                          ...prev,
                                          memberIds: on ? [...prev.memberIds, e.id] : prev.memberIds.filter(id => id !== e.id)
                                        }));
                                      }} />
                                      <span className="text-sm">{e.firstName} {e.lastName}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="md:col-span-3 flex gap-2">
                              <Button onClick={saveCrew}>Save</Button>
                              <Button variant="secondary" onClick={() => { setEditingCrewId(null); setCrewForm(emptyCrew); }}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {crews.length === 0 && (
                      <div className="text-sm text-muted-foreground">No crews</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </>
  );
}
