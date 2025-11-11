import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { CreateBlockModal } from "@/components/CreateBlockModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, QrCode, Search, Edit, Trash2, Building2 } from "lucide-react";

const blocks = [
  { id: "block-a", name: "Block A" },
  { id: "block-b", name: "Block B" },
  { id: "block-c", name: "Block C" },
  { id: "block-d", name: "Block D" },
];

const devices = [
  { id: "DEV-001", name: "Primary Pump A1", type: "Pump", location: "Building A - Floor 1", block: "block-a", status: "active" as const, lastSeen: "2 min ago" },
  { id: "DEV-002", name: "Main Control Valve", type: "Valve", location: "Building A - Floor 2", block: "block-a", status: "active" as const, lastSeen: "5 min ago" },
  { id: "DEV-003", name: "Storage Tank T1", type: "Tank", location: "Building B - Ground", block: "block-b", status: "warning" as const, lastSeen: "1 min ago" },
  { id: "DEV-004", name: "Secondary Pump B2", type: "Pump", location: "Building B - Floor 1", block: "block-b", status: "inactive" as const, lastSeen: "1 hour ago" },
  { id: "DEV-005", name: "Emergency Shutoff", type: "Valve", location: "Building A - Floor 3", block: "block-a", status: "active" as const, lastSeen: "3 min ago" },
  { id: "DEV-006", name: "Reserve Tank T2", type: "Tank", location: "Building C - Ground", block: "block-c", status: "error" as const, lastSeen: "10 min ago" },
  { id: "DEV-007", name: "Auxiliary Pump C1", type: "Pump", location: "Building C - Floor 2", block: "block-c", status: "active" as const, lastSeen: "4 min ago" },
  { id: "DEV-008", name: "Flow Sensor FS-01", type: "Sensor", location: "Building A - Floor 1", block: "block-a", status: "active" as const, lastSeen: "1 min ago" },
];

export default function Devices() {
  const [createBlockOpen, setCreateBlockOpen] = useState(false);

  const handleCreateBlock = (block: {
    name: string;
    location: string;
    description: string;
  }) => {
    console.log("Creating block:", block);
    // Handle block creation
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all connected devices</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setCreateBlockOpen(true)}
          >
            <Building2 className="h-4 w-4" />
            Create Block
          </Button>
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" />
            QR Register
          </Button>
          <Button variant="aqua" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Device
          </Button>
        </div>
      </div>

      <CreateBlockModal
        open={createBlockOpen}
        onOpenChange={setCreateBlockOpen}
        onCreateBlock={handleCreateBlock}
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search devices by name, ID, or location..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-elevation-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Device ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Block</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Seen</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{device.id}</TableCell>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-secondary/20 px-2 py-1 text-xs font-medium">
                    {device.type}
                  </span>
                </TableCell>
                <TableCell>
                  <Select defaultValue={device.block}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">{device.location}</TableCell>
                <TableCell>
                  <StatusBadge status={device.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{device.lastSeen}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
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
