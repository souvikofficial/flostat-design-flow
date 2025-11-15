import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { CreateBlockModal } from "@/components/CreateBlockModal";
import { CreateDeviceModal } from "@/components/CreateDeviceModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, QrCode, Search, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

const blocks = [
  { id: "block-a", name: "Block A" },
  { id: "block-b", name: "Block B" },
  { id: "block-c", name: "Block C" },
  { id: "block-d", name: "Block D" },
];

const devices = [
  { id: "DEV-001", name: "Pump 2", type: "pump", location: "Building A - Floor 1", block: "block-a", status: "active" as const, lastSeen: "2 min ago" },
  { id: "DEV-002", name: "Tank 4", type: "tank", location: "Building A - Floor 2", block: "block-a", status: "active" as const, lastSeen: "5 min ago" },
  { id: "DEV-003", name: "Valve 3", type: "valve", location: "Building B - Ground", block: "block-b", status: "active" as const, lastSeen: "1 min ago" },
  { id: "DEV-004", name: "Pump 1", type: "pump", location: "Building B - Floor 1", block: "block-b", status: "inactive" as const, lastSeen: "1 hour ago" },
  { id: "DEV-005", name: "Valve 1", type: "valve", location: "Building A - Floor 3", block: "block-a", status: "active" as const, lastSeen: "3 min ago" },
  { id: "DEV-006", name: "Valve 4", type: "valve", location: "Building C - Ground", block: "block-c", status: "active" as const, lastSeen: "10 min ago" },
  { id: "DEV-007", name: "Pump AHub", type: "pump", location: "Building C - Floor 2", block: "block-c", status: "active" as const, lastSeen: "4 min ago" },
  { id: "DEV-008", name: "Tank Staff quaters", type: "tank", location: "Building A - Floor 1", block: "block-a", status: "warning" as const, lastSeen: "1 min ago" },
  { id: "DEV-009", name: "Tank AHub", type: "tank", location: "Building D - Floor 1", block: "block-d", status: "warning" as const, lastSeen: "2 min ago" },
  { id: "DEV-010", name: "Pump 3", type: "pump", location: "Building B - Ground", block: "block-b", status: "active" as const, lastSeen: "5 min ago" },
  { id: "DEV-011", name: "Valve 2", type: "valve", location: "Building C - Floor 1", block: "block-c", status: "inactive" as const, lastSeen: "15 min ago" },
];

export default function Devices() {
  const [createBlockOpen, setCreateBlockOpen] = useState(false);
  const [createDeviceOpen, setCreateDeviceOpen] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get org_id from localStorage or context
  useEffect(() => {
    // Get the current org_id from localStorage
    const storedOrgId = localStorage.getItem('currentOrgId');
    setOrgId(storedOrgId);
  }, []);

  const handleCreateBlock = (block: {
    name: string;
    location: string;
    description: string;
  }) => {
    console.log("Creating block:", block);
    // Handle block creation
    toast({
      title: "Block Created",
      description: `Block "${block.name}" has been created successfully.`,
    });
  };

  const handleCreateDevice = async (device: {
    device_type: string;
    name: string;
    description: string;
    block_id: string;
  }) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create devices",
          variant: "destructive",
        });
        return;
      }
      
      // Check if org_id is available
      if (!orgId) {
        toast({
          title: "Organization Error",
          description: "Organization ID is missing. Please select an organization first.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Creating device with data:", { device_type: device.device_type, org_id: orgId });
      console.log("Auth token:", token ? "Present" : "Missing");
      
      const response = await api.devices.create({
        device_type: device.device_type,
        org_id: orgId
      });
      
      console.log("Device creation response:", response);
      
      if (response.success) {
        toast({
          title: "Device Created",
          description: `Device has been created successfully.`,
        });
        
        // Close the modal
        setCreateDeviceOpen(false);
        
        // In a real implementation, you would:
        // 1. Update the devices list by fetching from the API
        // 2. Show the device in blocks and dashboard
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create device",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating device:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while creating the device",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-soft">Device Management</h1>
          <p className="text-soft-muted mt-1">Manage and monitor all connected devices</p>
          {orgId && (
            <p className="text-sm text-muted-foreground">Current Organization: {orgId}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            className="gap-2 h-10 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5"
            onClick={() => setCreateDeviceOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Device
          </Button>
          <Button className="gap-2 h-10 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5">
            <QrCode className="h-4 w-4" />
            QR Register
          </Button>
          <Button
            className="gap-2 h-10 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-hover))] text-white shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5"
            onClick={() => setCreateBlockOpen(true)}
          >
            <Building2 className="h-4 w-4" />
            Create Block
          </Button>
        </div>
      </div>

      <CreateBlockModal
        open={createBlockOpen}
        onOpenChange={setCreateBlockOpen}
        onCreateBlock={handleCreateBlock}
      />
      
      <CreateDeviceModal
        open={createDeviceOpen}
        onOpenChange={setCreateDeviceOpen}
        onCreateDevice={handleCreateDevice}
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft-muted" />
          <Input
            placeholder="Search devices by name or ID..."
            className="pl-9 transition-smooth focus:shadow-soft-md"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-card shadow-soft-lg animate-slideUp">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-soft">Device ID</TableHead>
              <TableHead className="font-semibold text-soft">Name</TableHead>
              <TableHead className="font-semibold text-soft">Type</TableHead>
              <TableHead className="font-semibold text-soft">Block</TableHead>
              <TableHead className="font-semibold text-soft">Status</TableHead>
              <TableHead className="text-right font-semibold text-soft">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id} className="hover:bg-muted/20 transition-smooth">
                <TableCell className="font-mono text-sm text-soft">{device.id}</TableCell>
                <TableCell className="font-medium text-soft">{device.name}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium capitalize text-soft-muted">
                    {device.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-[hsl(var(--navy))] text-white shadow-soft-sm">
                    {blocks.find(b => b.id === device.block)?.name || device.block}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={device.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="hover:shadow-soft-sm transition-smooth">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:shadow-soft-sm transition-smooth">
                      <Trash2 className="h-4 w-4 text-destructive/90" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}