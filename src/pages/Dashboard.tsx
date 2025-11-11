import { useState } from "react";
import { DeviceCard } from "@/components/DeviceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockSelector, availableBlocks } from "@/components/BlockSelector";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, XCircle, X, MoreVertical, Power, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

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
    uptime: "99.8%",
    lastSync: "2 min ago",
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
    uptime: "98.5%",
    lastSync: "1 min ago",
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
    uptime: "97.2%",
    lastSync: "5 min ago",
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
    uptime: "0%",
    lastSync: "30 min ago",
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
    uptime: "99.9%",
    lastSync: "1 min ago",
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
    uptime: "45.3%",
    lastSync: "15 min ago",
  },
];

const stats = [
  { label: "Total Devices", value: "48", icon: Activity, color: "text-aqua" },
  { label: "Active", value: "42", icon: CheckCircle, color: "text-success" },
  { label: "Warnings", value: "4", icon: AlertTriangle, color: "text-warning" },
  { label: "Offline", value: "2", icon: XCircle, color: "text-destructive" },
];

const getStatusBadge = (status: string) => {
  const variants = {
    active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
    inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
    warning: { label: "Warning", className: "bg-warning/10 text-warning border-warning/20" },
    error: { label: "Error", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  return variants[status as keyof typeof variants] || variants.inactive;
};

export default function Dashboard() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [minThreshold, setMinThreshold] = useState("");
  const [maxThreshold, setMaxThreshold] = useState("");
  const [controls, setControls] = useState({
    pump2: true,
    pump1: false,
    pumpAHub: true,
    valve3: true,
    valve1: true,
    valve4: true,
  });

  // Tank levels (%, 0-100)
  const [tank4Level, setTank4Level] = useState<number>(1);
  const [tankStaffLevel, setTankStaffLevel] = useState<number>(4);
  const [tankAHubLevel, setTankAHubLevel] = useState<number>(23);
  // Inputs for pending edits
  const [tank4Input, setTank4Input] = useState<string>("1");
  const [tankStaffInput, setTankStaffInput] = useState<string>("4");
  const [tankAHubInput, setTankAHubInput] = useState<string>("23");

  const clampPercent = (val: number) => Math.max(0, Math.min(100, Math.round(val)));

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

  const handleSaveThresholds = () => {
    console.log("Saving thresholds:", { min: minThreshold, max: maxThreshold });
  };

  const showFilterChip = selectedBlocks.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Select Block:</label>
          <Select value={selectedBlocks.length === 0 ? "all" : selectedBlocks[0]} onValueChange={(value) => setSelectedBlocks(value === "all" ? [] : [value])}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {availableBlocks.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organization Thresholds */}
      <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-soft">Organization Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-soft-muted">Min :</label>
              <Input
                type="number"
                placeholder="Min"
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                className="w-32 h-9 transition-smooth focus:shadow-soft-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-soft-muted">Max :</label>
              <Input
                type="number"
                placeholder="Max"
                value={maxThreshold}
                onChange={(e) => setMaxThreshold(e.target.value)}
                className="w-32 h-9 transition-smooth focus:shadow-soft-md"
              />
            </div>
            <Button 
              onClick={handleSaveThresholds}
              className="h-9 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5"
            >
              Save Thresholds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Control Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pump 2 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Pump 2</CardTitle>
            <p className={`text-sm font-medium ${controls.pump2 ? 'text-[hsl(var(--aqua))]' : 'text-soft-muted'}`}>Current Status: {controls.pump2 ? 'ON' : 'OFF'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Power</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.pump2 ? 'ON' : 'OFF'}</span>
                <Switch checked={controls.pump2} onCheckedChange={(checked) => setControls((c) => ({ ...c, pump2: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tank 4 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Tank 4</CardTitle>
            <p className="text-sm text-soft-muted">Current Level: {tank4Level}%</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-soft-muted">
                <span>Threshold Levels</span>
              </div>
              <p className="text-xs text-soft-muted">Low: 12% | High: 80%</p>
              {tank4Level < 12 ? (
                <p className="text-xs text-destructive/90 font-medium">Warning: Level below minimum threshold!</p>
              ) : tank4Level === 12 ? (
                <p className="text-xs text-warning/90 font-medium">Warning: Level at minimum threshold!</p>
              ) : null}
              
              {/* Visual indicator */}
              <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex">
                  <div
                    className={`transition-all duration-500 rounded-full ${tank4Level < 12 ? 'bg-destructive/90' : tank4Level >= 80 ? 'bg-warning/90' : 'bg-success/90'}`}
                    style={{ width: `${tank4Level}%` }}
                  />
                  <div className="flex-1"></div>
                </div>
                <div className="absolute left-[12%] top-0 bottom-0 w-px bg-foreground/20"></div>
                <div className="absolute left-[80%] top-0 bottom-0 w-px bg-foreground/20"></div>
                <div className="absolute left-[100%] top-0 bottom-0 w-px bg-foreground/20"></div>
              </div>
              <div className="flex justify-between text-[10px] text-soft-muted">
                <span>0%</span>
                <span>12%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0-100"
                value={tank4Input}
                onChange={(e) => setTank4Input(e.target.value)}
                className="h-9 text-sm transition-smooth focus:shadow-soft-md"
              />
              <Button
                variant="outline"
                className="h-9 px-6 transition-smooth hover:shadow-soft-sm"
                onClick={() => {
                  const n = Number(tank4Input);
                  if (!Number.isNaN(n)) setTank4Level(clampPercent(n));
                }}
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Valve 3 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Valve 3</CardTitle>
            <p className={`text-sm font-medium ${controls.valve3 ? 'text-success/90' : 'text-soft-muted'}`}>Current Status: {controls.valve3 ? 'OPEN' : 'CLOSED'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Valve</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.valve3 ? 'OPEN' : 'CLOSED'}</span>
                <Switch checked={controls.valve3} onCheckedChange={(checked) => setControls((c) => ({ ...c, valve3: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pump 1 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Pump 1</CardTitle>
            <p className={`text-sm ${controls.pump1 ? 'text-[hsl(var(--aqua)))]' : 'text-soft-muted'}`}>Current Status: {controls.pump1 ? 'ON' : 'OFF'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Power</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.pump1 ? 'ON' : 'OFF'}</span>
                <Switch checked={controls.pump1} onCheckedChange={(checked) => setControls((c) => ({ ...c, pump1: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valve 1 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Valve 1</CardTitle>
            <p className={`text-sm font-medium ${controls.valve1 ? 'text-success/90' : 'text-soft-muted'}`}>Current Status: {controls.valve1 ? 'OPEN' : 'CLOSED'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Valve</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.valve1 ? 'OPEN' : 'CLOSED'}</span>
                <Switch checked={controls.valve1} onCheckedChange={(checked) => setControls((c) => ({ ...c, valve1: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valve 4 */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Valve 4</CardTitle>
            <p className={`text-sm font-medium ${controls.valve4 ? 'text-success/90' : 'text-soft-muted'}`}>Current Status: {controls.valve4 ? 'OPEN' : 'CLOSED'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Valve</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.valve4 ? 'OPEN' : 'CLOSED'}</span>
                <Switch checked={controls.valve4} onCheckedChange={(checked) => setControls((c) => ({ ...c, valve4: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pump AHub */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Pump AHub</CardTitle>
            <p className={`text-sm font-medium ${controls.pumpAHub ? 'text-[hsl(var(--aqua))]' : 'text-soft-muted'}`}>Current Status: {controls.pumpAHub ? 'ON' : 'OFF'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <span className="text-sm font-medium">Power</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{controls.pumpAHub ? 'ON' : 'OFF'}</span>
                <Switch checked={controls.pumpAHub} onCheckedChange={(checked) => setControls((c) => ({ ...c, pumpAHub: checked }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tank Staff quarters */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Tank Staff quarters</CardTitle>
            <p className="text-sm text-soft-muted">Current Level: {tankStaffLevel}%</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-soft-muted">
                <span>Threshold Levels</span>
              </div>
              <p className="text-xs text-soft-muted">Low: 25% | High: 80%</p>
              {tankStaffLevel < 25 ? (
                <p className="text-xs text-destructive/90 font-medium">Warning: Level below minimum threshold!</p>
              ) : tankStaffLevel === 25 ? (
                <p className="text-xs text-warning/90 font-medium">Warning: Level at minimum threshold!</p>
              ) : null}
              
              <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex">
                  <div
                    className={`transition-all duration-500 rounded-full ${tankStaffLevel < 25 ? 'bg-destructive/90' : tankStaffLevel >= 80 ? 'bg-warning/90' : 'bg-success/90'}`}
                    style={{ width: `${tankStaffLevel}%` }}
                  />
                  <div className="flex-1"></div>
                </div>
                <div className="absolute left-[25%] top-0 bottom-0 w-px bg-foreground/20"></div>
                <div className="absolute left-[80%] top-0 bottom-0 w-px bg-foreground/20"></div>
              </div>
              <div className="flex justify-between text-[10px] text-soft-muted">
                <span>0%</span>
                <span>25%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0-100"
                value={tankStaffInput}
                onChange={(e) => setTankStaffInput(e.target.value)}
                className="h-9 text-sm transition-smooth focus:shadow-soft-md"
              />
              <Button
                variant="outline"
                className="h-9 px-6 transition-smooth hover:shadow-soft-sm"
                onClick={() => {
                  const n = Number(tankStaffInput);
                  if (!Number.isNaN(n)) setTankStaffLevel(clampPercent(n));
                }}
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tank AHub */}
        <Card className="bg-gradient-card shadow-soft-md hover-lift border-border/50 transition-smooth animate-fadeIn">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-soft">Tank AHub</CardTitle>
            <p className="text-sm text-soft-muted">Current Level: {tankAHubLevel}%</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-soft-muted">
                <span>Threshold Levels</span>
              </div>
              <p className="text-xs text-soft-muted">Low: 23% | High: 86%</p>
              {tankAHubLevel < 23 ? (
                <p className="text-xs text-destructive/90 font-medium">Warning: Level below minimum threshold!</p>
              ) : tankAHubLevel === 23 ? (
                <p className="text-xs text-warning/90 font-medium">Warning: Level at minimum threshold!</p>
              ) : tankAHubLevel > 86 ? (
                <p className="text-xs text-warning/90 font-medium">Warning: Level above maximum threshold!</p>
              ) : null}
              
              <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex">
                  <div
                    className={`transition-all duration-500 rounded-full ${tankAHubLevel < 23 ? 'bg-destructive/90' : tankAHubLevel >= 86 ? 'bg-warning/90' : 'bg-success/90'}`}
                    style={{ width: `${tankAHubLevel}%` }}
                  />
                  <div className="flex-1"></div>
                </div>
                <div className="absolute left-[23%] top-0 bottom-0 w-px bg-foreground/20"></div>
                <div className="absolute left-[86%] top-0 bottom-0 w-px bg-foreground/20"></div>
              </div>
              <div className="flex justify-between text-[10px] text-soft-muted">
                <span>0%</span>
                <span>23%</span>
                <span>86%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0-100"
                value={tankAHubInput}
                onChange={(e) => setTankAHubInput(e.target.value)}
                className="h-9 text-sm transition-smooth focus:shadow-soft-md"
              />
              <Button
                variant="outline"
                className="h-9 px-6 transition-smooth hover:shadow-soft-sm"
                onClick={() => {
                  const n = Number(tankAHubInput);
                  if (!Number.isNaN(n)) setTankAHubLevel(clampPercent(n));
                }}
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
