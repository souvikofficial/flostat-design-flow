import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Download, Search, Calendar, FileText, TrendingUp, Activity, Filter, ListChecks } from "lucide-react";

const reports = [
  { id: "092ab42a-7190-4c79-a08a-9ce182a75fa1", deviceType: "Pump", status: "ON", level: null, lastUpdated: "11/10/2025, 10:20:30 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "092ab42a-7190-4c79-a08a-9ce182a75fa1", deviceType: "Pump", status: "OFF", level: null, lastUpdated: "11/10/2025, 10:19:29 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "092ab42a-7190-4c79-a08a-9ce182a75fa1", deviceType: "Pump", status: "ON", level: null, lastUpdated: "11/10/2025, 8:37:24 PM", updatedBy: "ahmedsyedsonal176@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "70%", lastUpdated: "11/8/2025, 3:20:15 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "70%", lastUpdated: "11/8/2025, 3:20:15 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "75%", lastUpdated: "11/8/2025, 3:20:10 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "75%", lastUpdated: "11/8/2025, 3:20:10 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "78%", lastUpdated: "11/8/2025, 3:20:03 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "78%", lastUpdated: "11/8/2025, 3:20:03 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "1e0514a2-38b1-4e50-adc4-6eb05b445bf9", deviceType: "Pump", status: "OFF", level: null, lastUpdated: "11/8/2025, 3:19:06 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "80%", lastUpdated: "11/8/2025, 3:19:06 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "80%", lastUpdated: "11/8/2025, 3:19:06 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "70%", lastUpdated: "11/8/2025, 3:19:00 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "70%", lastUpdated: "11/8/2025, 3:19:00 PM", updatedBy: "hrnh6531@gmail.com" },
  { id: "9d3f2c6a-5452-4910-a59e-d4ecd15c66ba", deviceType: "Tank", status: null, level: "60%", lastUpdated: "11/8/2025, 3:18:53 PM", updatedBy: "hrnh6531@gmail.com" },
];

export default function Reports() {
  const [selectedTank, setSelectedTank] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("overview");

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

  const filteredReports = reports.filter(r => {
    const tankOk = selectedTank === 'all' || r.deviceType === 'Tank';
    const q = query.trim().toLowerCase();
    const qOk = !q || r.id.toLowerCase().includes(q) || (r.status || '').toLowerCase().includes(q);
    return tankOk && qOk;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-soft">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-10">
            <FileText className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2 h-10 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5">
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-1">
            <TrendingUp className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-1">
            <ListChecks className="h-4 w-4" /> Data
          </TabsTrigger>
          <TabsTrigger value="filters" className="gap-1">
            <Filter className="h-4 w-4" /> Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-soft-lg transition-smooth hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" /> Active Pumps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-soft-muted mt-1">+2 since yesterday</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-soft-lg transition-smooth hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[hsl(var(--aqua))]" /> Avg Tank Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">71%</div>
                <p className="text-xs text-soft-muted mt-1">Stable range</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-soft-lg transition-smooth hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-4 w-4 text-warning" /> Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-xs text-soft-muted mt-1">Last 24h</p>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="shadow-soft-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-[hsl(var(--aqua))]" /> Tank Level Trend (Today)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={chartConfig} className="w-full aspect-[16/6]">
                <AreaChart data={levelSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="tank1Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(192 100% 42%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(192 100% 42%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tank2Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220 70% 62%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(220 70% 62%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tank3Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142 65% 40%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(142 65% 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="ts" tickLine={false} axisLine={false} />
                  <YAxis width={28} tickLine={false} axisLine={false} domain={[50, 90]} />
                  <Area dataKey="tank1" stroke="var(--color-tank1)" fill="url(#tank1Fill)" type="monotone" strokeWidth={2} />
                  <Area dataKey="tank2" stroke="var(--color-tank2)" fill="url(#tank2Fill)" type="monotone" strokeWidth={2} />
                  <Area dataKey="tank3" stroke="var(--color-tank3)" fill="url(#tank3Fill)" type="monotone" strokeWidth={2} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Input
              placeholder="Search reports..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-64"
            />
            <Select value={selectedTank} onValueChange={setSelectedTank}>
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder="Tank Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="tank-1">Tank 1</SelectItem>
                <SelectItem value="tank-2">Tank 2</SelectItem>
                <SelectItem value="tank-3">Tank 3</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 h-10">
              <Search className="h-4 w-4" /> Query
            </Button>
          </div>
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
        </TabsContent>

        <TabsContent value="filters" className="mt-6">
          <Card className="shadow-soft-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter Builder (Demo)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              <p className="text-soft-muted">This section could allow advanced query composition combining device type, status thresholds, time range, and anomaly flags. (Demo placeholder)</p>
              <div className="grid gap-3 md:grid-cols-3">
                <Select>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Device Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pump">Pump</SelectItem>
                    <SelectItem value="tank">Tank</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">ON</SelectItem>
                    <SelectItem value="off">OFF</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Level > %" className="h-10" />
              </div>
              <div className="flex gap-2">
                <Button className="gap-2 h-10"><Search className="h-4 w-4" /> Run</Button>
                <Button variant="outline" className="h-10">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
