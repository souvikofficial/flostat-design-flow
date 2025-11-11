import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, Calendar, FileText, TrendingUp } from "lucide-react";

const reports = [
  { id: "RPT-2024-001", name: "Monthly Operations Summary", type: "Operations", date: "2024-01-15", size: "2.4 MB", status: "completed" },
  { id: "RPT-2024-002", name: "Device Performance Analysis", type: "Analytics", date: "2024-01-14", size: "3.1 MB", status: "completed" },
  { id: "RPT-2024-003", name: "Energy Consumption Report", type: "Energy", date: "2024-01-13", size: "1.8 MB", status: "completed" },
  { id: "RPT-2024-004", name: "Maintenance Schedule Review", type: "Maintenance", date: "2024-01-12", size: "945 KB", status: "completed" },
  { id: "RPT-2024-005", name: "System Health Check", type: "System", date: "2024-01-11", size: "1.2 MB", status: "processing" },
  { id: "RPT-2024-006", name: "Quarterly Efficiency Report", type: "Analytics", date: "2024-01-10", size: "4.5 MB", status: "completed" },
];

const stats = [
  { label: "Total Reports", value: "156", icon: FileText },
  { label: "This Month", value: "24", icon: Calendar },
  { label: "Processing", value: "3", icon: TrendingUp },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and manage system reports</p>
        </div>
        <Button variant="aqua" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-elevation-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-aqua" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Date Range
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-elevation-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Report ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Size</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{report.id}</TableCell>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-secondary/20 px-2 py-1 text-xs font-medium">
                    {report.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{report.size}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={report.status === "completed" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2" disabled={report.status !== "completed"}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
