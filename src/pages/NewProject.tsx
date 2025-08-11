import Seo from "@/components/Seo";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TaskItem { id: string; title: string; notes?: string }

export default function NewProject() {
  const canonical = typeof window !== "undefined" ? window.location.href : undefined;
  const { toast } = useToast();

  const [projectName, setProjectName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [contractText, setContractText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const canExtract = useMemo(() => contractText.trim().length > 0, [contractText]);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    try {
      if (file.type.startsWith("text/") || file.name.endsWith(".md")) {
        const text = await file.text();
        setContractText(text);
        toast({ title: "File loaded", description: "Text imported from file." });
      } else {
        // Fallback: try to read as text; otherwise instruct paste
        const reader = new FileReader();
        reader.onload = () => {
          const text = typeof reader.result === "string" ? reader.result : "";
          if (text) {
            setContractText(text);
            toast({ title: "File loaded", description: "Attempted to import text from file." });
          } else {
            toast({ title: "Unsupported file", description: "Please paste the contract text or upload a .txt/.md file.", variant: "destructive" });
          }
        };
        reader.readAsText(file);
      }
    } catch (e) {
      toast({ title: "Failed to read file", description: (e as Error).message, variant: "destructive" });
    }
  };

  const localExtract = (text: string): TaskItem[] => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const candidates = lines.filter(l => /^[•\-\d\.]/.test(l.trim()) || /(deliver|provide|mow|trim|weed|plant|install|inspect|maintain)/i.test(l));
    return candidates.slice(0, 50).map((l, i) => ({ id: `t${i}`, title: l.replace(/^([•\-\d\.\)\(]+)\s*/, "").trim() }));
  };

  const extractWithPerplexity = async (text: string): Promise<TaskItem[]> => {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "You extract contract deliverables as a clean JSON array." },
          { role: "user", content: `From the following contract, extract a concise list of deliverable tasks. Return strictly JSON: [{\"title\": string}].\n\nContract:\n${text}` }
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    // Try to find JSON in content
    const match = content.match(/\[.*\]/s);
    const jsonStr = match ? match[0] : content;
    try {
      const arr = JSON.parse(jsonStr) as { title: string }[];
      return arr.map((t, i) => ({ id: `ai${i}`, title: t.title }));
    } catch {
      // Fallback to local
      return localExtract(text);
    }
  };

  const onExtract = async () => {
    if (!canExtract) return;
    setIsLoading(true);
    try {
      const res = apiKey ? await extractWithPerplexity(contractText) : localExtract(contractText);
      setTasks(res);
      toast({ title: "Deliverables extracted", description: `${res.length} tasks ready to review.` });
    } catch (e) {
      toast({ title: "Extraction failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onAddTasks = () => {
    toast({ title: "Project created", description: `${tasks.length} tasks added to ${projectName || "New Project"}. (Demo only)` });
  };

  return (
    <>
      <Seo title="New Project | Prolas Ops Demo" description="Create a project, upload a contract, and extract deliverables into tasks." canonical={canonical} />
      <main className="container py-8">
        <section className="rounded-xl bg-card border shadow-sm p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
            <p className="text-muted-foreground">Upload a contract and extract deliverables into tasks. Optionally use your Perplexity API key.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Greenfield Park Phase II" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName">Primary Site</Label>
                <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g., North Lawn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Contract File (.txt/.md preferred)</Label>
                <Input id="file" type="file" accept=".txt,.md,.pdf,.doc,.docx" onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">Perplexity API Key (optional)</Label>
                <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="pk-..." />
                <p className="text-xs text-muted-foreground">For production, add this key to Supabase Edge Function Secrets. This demo stores it only in memory.</p>
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="contractText">Contract Text</Label>
              <Textarea id="contractText" rows={16} value={contractText} onChange={(e) => setContractText(e.target.value)} placeholder="Paste contract text here if file import failed..." />
              <div className="flex gap-3">
                <Button onClick={onExtract} disabled={!canExtract || isLoading}>{isLoading ? "Extracting..." : "Extract Deliverables"}</Button>
                <Button variant="secondary" onClick={() => setContractText("")}>Clear</Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {tasks.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Review Tasks ({tasks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.map((t, idx) => (
                      <div key={t.id} className="grid gap-2 md:grid-cols-6 items-center">
                        <div className="md:col-span-5">
                          <Input value={t.title} onChange={(e) => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, title: e.target.value } : x))} />
                        </div>
                        <div className="flex justify-end">
                          <Button variant="ghost" className="text-destructive" onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))}>Remove</Button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <Button variant="secondary" onClick={() => setTasks(prev => [...prev, { id: crypto.randomUUID(), title: "" }])}>Add Task</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setTasks([])}>Reset</Button>
                <Button onClick={onAddTasks}>Create Project</Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
