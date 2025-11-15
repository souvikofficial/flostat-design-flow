import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface ReportItem {
  id: string;
  deviceType: string;
  status: string | null;
  level: string | null;
  lastUpdated: string;
  updatedBy: string;
}

export default function Reports() {
  const [selectedTank, setSelectedTank] = useState("tank-1");
  const [selectedDate, setSelectedDate] = useState("");
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Demo time series (aggregated tank levels) for chart
  const levelSeries = useMemo(
    () => [
      { ts: "08:00", tank1: 62, tank2: 55, tank3: 78 },
      { ts: "09:00", tank1: 64, tank2: 57, tank3: 79 },
      { ts: "10:00", tank1: 65, tank2: 59, tank3: 77 },
      { ts: "11:00", tank1: 67, tank2: 60, tank3: 80 },
      { ts: "12:00", tank1: 69, tank2: 63, tank3: 81 },
      { ts: "13:00", tank1: 70, tank2: 65, tank3: 82 },
      { ts: "14:00", tank1: 72, tank2: 66, tank3: 83 },
      { ts: "15:00", tank1: 73, tank2: 67, tank3: 84 },
      { ts: "16:00", tank1: 74, tank2: 68, tank3: 85 },
    ],
    []
  );

  const chartConfig = {
    tank1: { label: "Tank 1", color: "hsl(192 100% 42%)" },
    tank2: { label: "Tank 2", color: "hsl(220 70% 62%)" },
    tank3: { label: "Tank 3", color: "hsl(142 65% 40%)" },
  };

  // Fetch reports from the backend
  const fetchReports = async () => {
    setLoading(true);
    try {
      // Get org_id from localStorage
      const orgId = localStorage.getItem('currentOrgId');
      if (!orgId) {
        toast({
          title: "Error",
          description: "No organization selected. Please select an organization first.",
          variant: "destructive",
        });
        return;
      }

      // For now, we'll use a placeholder tank ID
      // In a real implementation, you would get the actual tank ID based on the selection
      const tankId = "placeholder-tank-id";
      
      const response = await api.reports.getAll();
      
      if (response.success) {
        // Transform the data to match our interface
        const transformedReports = response.data?.map((report: any) => ({
          id: report.device_id || "N/A",
          deviceType: report.device_type || "Unknown",
          status: report.status || null,
          level: report.level || null,
          lastUpdated: report.last_updated || "N/A",
          updatedBy: report.updated_by || "Unknown",
        })) || [];
        
        setReports(transformedReports);
        toast({
          title: "Success",
          description: "Reports fetched successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch reports",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while fetching reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports; // simple pass-through to match screenshot layout

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-soft text-center">Reports</h1>

      {/* Controls Row */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-soft-muted">Select Tank</label>
            <Select value={selectedTank} onValueChange={setSelectedTank}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Select Tank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tank-1">Tank 1</SelectItem>
                <SelectItem value="tank-2">Tank 2</SelectItem>
                <SelectItem value="tank-3">Tank 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-soft-muted">Select Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 w-[140px]"
            />
          </div>
          <Button 
            className="h-9 px-3 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white shadow-soft-sm"
            onClick={fetchReports}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              "Fetch Data"
            )}
          </Button>
        </div>
        <Button className="h-9 gap-2 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-hover))] text-white">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border border-border/50 bg-card shadow-soft-lg animate-slideUp">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-soft">DEVICE ID</TableHead>
              <TableHead className="font-semibold text-soft">STATUS/LEVEL</TableHead>
              <TableHead className="font-semibold text-soft">DEVICE TYPE</TableHead>
              <TableHead className="font-semibold text-soft">LAST UPDATED</TableHead>
              <TableHead className="font-semibold text-soft">UPDATED BY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report, index) => (
              <TableRow key={index} className="hover:bg-muted/20 transition-smooth">
                <TableCell className="font-mono text-xs text-soft">{report.id}</TableCell>
                <TableCell className="space-x-1">
                  {report.status && (
                    <Badge
                      variant="outline"
                      className={report.status === "ON" ? "bg-success/15 text-success/90 border-success/25 shadow-soft-sm" : "bg-destructive/15 text-destructive/90 border-destructive/25 shadow-soft-sm"}
                    >
                      {report.status}
                    </Badge>
                  )}
                  {report.level && (
                    <Badge variant="outline" className="bg-[hsl(var(--aqua))]/15 text-[hsl(var(--aqua))] border-[hsl(var(--aqua))]/25 shadow-soft-sm">
                      {report.level}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-soft">{report.deviceType}</TableCell>
                <TableCell className="text-sm text-soft-muted">{report.lastUpdated}</TableCell>
                <TableCell className="text-sm text-[hsl(var(--aqua))]">{report.updatedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Debug Information */}
      <div className="p-4 rounded-md border bg-warning/10 border-warning/30 text-xs text-soft">
        <div className="font-medium text-center text-warning">Debug Information</div>
        <div className="mt-2 grid gap-1 sm:grid-cols-2 md:grid-cols-3">
          <div>Current City: Los Estacas</div>
          <div>Device Count: 1657</div>
          <div>Logs: Available</div>
          <div>Water Level Alerts: 23</div>
          <div>Flow Rate Data Points: 447</div>
          <div>Last Sync: 2m ago</div>
        </div>
      </div>

      {/* Visualization */}
      <h2 className="text-center text-sm font-semibold text-soft">Device Data Visualization</h2>
      <Card className="rounded-lg border border-border/50 bg-card shadow-soft-lg">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-medium">Water Level</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer config={chartConfig} className="w-full aspect-[16/6]">
            <AreaChart data={levelSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="tank2Fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220 70% 62%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(220 70% 62%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="ts" tickLine={false} axisLine={false} />
              <YAxis width={28} tickLine={false} axisLine={false} domain={[50, 90]} />
              <Area dataKey="tank2" stroke="var(--color-tank2)" fill="url(#tank2Fill)" type="monotone" strokeWidth={2} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Valve State Card */}
      <Card className="rounded-lg border border-border/50 bg-card shadow-soft-lg">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">Valve State</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(var(--aqua))]"></span> Open</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/60"></span> Closed</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#C00000]"></span> Disconnected</div>
          </div>
          <div className="relative w-full h-6 rounded-full border overflow-hidden flex" aria-label="Valve timeline state demo">
            <div className="h-full bg-muted-foreground/60" style={{ width: "55%" }} />
            <div className="h-full bg-[hsl(var(--aqua))]" style={{ width: "30%" }} />
            <div className="h-full bg-[#C00000]" style={{ width: "15%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
          </div>
        </CardContent>
      </Card>

      {/* Pump State Card */}
      <Card className="rounded-lg border border-border/50 bg-card shadow-soft-lg">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">Pump State</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(var(--aqua))]"></span> On</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/60"></span> Off</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#C00000]"></span> Disconnected</div>
          </div>
          <div className="relative w-full h-6 rounded-full border overflow-hidden flex" aria-label="Pump timeline state demo">
            <div className="h-full bg-[hsl(var(--aqua))]" style={{ width: "40%" }} />
            <div className="h-full bg-muted-foreground/60" style={{ width: "45%" }} />
            <div className="h-full bg-[#C00000]" style={{ width: "15%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}