import { DeviceCard } from "@/components/DeviceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
  },
];

const stats = [
  { label: "Total Devices", value: "48", icon: Activity, color: "text-aqua" },
  { label: "Active", value: "42", icon: CheckCircle, color: "text-success" },
  { label: "Warnings", value: "4", icon: AlertTriangle, color: "text-warning" },
  { label: "Offline", value: "2", icon: XCircle, color: "text-destructive" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your industrial IoT devices in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
          {devices.map((device) => (
            <DeviceCard key={device.id} {...device} />
          ))}
        </div>
      </div>
    </div>
  );
}
