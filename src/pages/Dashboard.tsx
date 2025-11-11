import { useState } from "react";
import { DeviceCard } from "@/components/DeviceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockSelector, availableBlocks } from "@/components/BlockSelector";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

const devices = [
  {
    id: "pump-001",
    name: "Primary Pump A1",
    type: "pump" as const,
    status: "active" as const,
    value: 3250,
    unit: "RPM",
    threshold: { min: 2000, max: 4000 },
    location: "Building A - Floor 1",
    block: "block-a",
  },
  {
    id: "valve-001",
    name: "Main Control Valve",
    type: "valve" as const,
    status: "active" as const,
    value: 75,
    unit: "%",
    threshold: { min: 0, max: 100 },
    location: "Building A - Floor 2",
    block: "block-a",
  },
  {
    id: "tank-001",
    name: "Storage Tank T1",
    type: "tank" as const,
    status: "warning" as const,
    value: 8500,
    unit: "L",
    threshold: { min: 5000, max: 10000 },
    location: "Building B - Ground",
    block: "block-b",
  },
  {
    id: "pump-002",
    name: "Secondary Pump B2",
    type: "pump" as const,
    status: "inactive" as const,
    value: 0,
    unit: "RPM",
    threshold: { min: 2000, max: 4000 },
    location: "Building B - Floor 1",
    block: "block-b",
  },
  {
    id: "valve-002",
    name: "Emergency Shutoff",
    type: "valve" as const,
    status: "active" as const,
    value: 100,
    unit: "%",
    threshold: { min: 0, max: 100 },
    location: "Building A - Floor 3",
    block: "block-a",
  },
  {
    id: "tank-002",
    name: "Reserve Tank T2",
    type: "tank" as const,
    status: "error" as const,
    value: 2100,
    unit: "L",
    threshold: { min: 5000, max: 10000 },
    location: "Building C - Ground",
    block: "block-c",
  },
];

const stats = [
  { label: "Total Devices", value: "48", icon: Activity, color: "text-aqua" },
  { label: "Active", value: "42", icon: CheckCircle, color: "text-success" },
  { label: "Warnings", value: "4", icon: AlertTriangle, color: "text-warning" },
  { label: "Offline", value: "2", icon: XCircle, color: "text-destructive" },
];

export default function Dashboard() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const filteredDevices =
    selectedBlocks.length === 0
      ? devices
      : devices.filter((device) => selectedBlocks.includes(device.block));

  const filteredStats =
    selectedBlocks.length === 0
      ? stats
      : [
          { ...stats[0], value: filteredDevices.length.toString() },
          {
            ...stats[1],
            value: filteredDevices.filter((d) => d.status === "active").length.toString(),
          },
          {
            ...stats[2],
            value: filteredDevices.filter((d) => d.status === "warning").length.toString(),
          },
          {
            ...stats[3],
            value: filteredDevices.filter((d) => d.status === "inactive" || d.status === "error").length.toString(),
          },
        ];

  const showFilterChip = selectedBlocks.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your industrial IoT devices in real-time</p>
        </div>
        <BlockSelector
          selectedBlocks={selectedBlocks}
          onBlocksChange={setSelectedBlocks}
        />
      </div>

      {showFilterChip && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          {selectedBlocks.map((blockId) => {
            const block = availableBlocks.find((b) => b.id === blockId);
            if (!block) return null;
            return (
              <Badge
                key={block.id}
                variant="outline"
                className="gap-1 bg-aqua/10 text-aqua border-aqua/20"
              >
                {block.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setSelectedBlocks(selectedBlocks.filter((id) => id !== blockId))
                  }
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredStats.map((stat) => (
          <Card key={stat.label} className="shadow-elevation-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Device Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Devices</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} {...device} />
          ))}
        </div>
      </div>
    </div>
  );
}
