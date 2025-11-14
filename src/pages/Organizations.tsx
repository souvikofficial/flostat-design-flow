import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Org {
  id: string;
  name: string;
  description?: string;
  location?: string;
}

export default function Organizations() {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const navigate = useNavigate();

  const onCreate = () => {
    if (!name.trim()) return;
    setOrgs((prev) => [...prev, { id: Math.random().toString(36).slice(2), name, description: desc, location: loc }]);
    setName(""); setDesc(""); setLoc(""); setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-semibold tracking-tight text-center">Your Organizations</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Create Organization card */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-6 py-12 text-soft hover:bg-muted/50 transition-colors"
        >
          + Create Organization
        </button>

        {/* Existing orgs */}
        {orgs.map((o) => (
          <Card key={o.id} className="shadow-soft-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{o.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {o.description && <p className="text-sm text-soft-muted">{o.description}</p>}
              {o.location && <p className="text-xs text-soft-muted">Location: {o.location}</p>}
              <Button className="mt-2 w-full bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white" onClick={() => navigate("/")}>Enter Dashboard</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-soft-muted">Organization Name</label>
              <Input placeholder="Enter org name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-soft-muted">Description</label>
              <Textarea placeholder="Enter description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-soft-muted">Location</label>
              <Input placeholder="Enter location" value={loc} onChange={(e) => setLoc(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onCreate} className="bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
