import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface Org {
  org_id: string;
  orgName: string;
  orgDesc?: string;
  location?: string;
}

export default function Organizations() {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch organizations when component mounts
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.organizations.getUserOrgs();
      if (response.success) {
        // Transform the data to match our interface
        const transformedOrgs = response.orgs?.map((org: any) => ({
          org_id: org.org_id,
          orgName: org.orgName || org.name,
          orgDesc: org.orgDesc || org.description,
          location: org.location
        })) || [];
        setOrgs(transformedOrgs);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch organizations",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async () => {
    if (!name.trim()) return;
    
    try {
      const response = await api.organizations.create({
        orgName: name,
        orgDesc: desc,
        location: loc
      });
      
      if (response.success) {
        // Refresh the organizations list
        await fetchOrganizations();
        
        setName("");
        setDesc("");
        setLoc("");
        setOpen(false);
        
        toast({
          title: "Organization Created",
          description: `Organization "${name}" created successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create organization",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleEnterDashboard = (orgId: string) => {
    // Store the current organization ID in localStorage
    localStorage.setItem('currentOrgId', orgId);
    // Navigate to the organization dashboard
    navigate(`/org/${orgId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h1 className="text-2xl font-semibold tracking-tight text-center">Your Organizations</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading organizations...</p>
        </div>
      </div>
    );
  }

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
          <Card key={o.org_id} className="shadow-soft-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{o.orgName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-soft-muted">ID: {o.org_id}</span>
              </div>
              {o.orgDesc && <p className="text-sm text-soft-muted">{o.orgDesc}</p>}
              {o.location && <p className="text-xs text-soft-muted">Location: {o.location}</p>}
              <Button 
                className="mt-2 w-full bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white" 
                onClick={() => handleEnterDashboard(o.org_id)}
              >
                Enter Dashboard
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Enter the details for your new organization.
            </DialogDescription>
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