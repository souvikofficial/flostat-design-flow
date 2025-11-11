import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Activity, Droplets, Gauge, ThermometerSun, Power, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const devices = [
  { id: 1, name: "Pump A1", type: "pump", status: "active", value: 3250, unit: "RPM", isOn: true },
  { id: 2, name: "Valve V-03", type: "valve", status: "active", value: 75, unit: "%", isOn: true },
  { id: 3, name: "Tank T1", type: "tank", status: "warning", value: 8500, unit: "L", isOn: true },
];

export default function SCADA() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SCADA Control</h1>
        <p className="text-muted-foreground mt-1">Real-time monitoring and control interface</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-elevation-2">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-aqua" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative h-96 border-2 border-dashed border-border rounded-lg bg-muted/10 p-6">
              {/* SCADA Canvas - Simplified visualization */}
              <div className="flex items-center justify-around h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-aqua/20 flex items-center justify-center border-2 border-aqua">
                    <Droplets className="h-10 w-10 text-aqua" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Pump A1</p>
                    <StatusBadge status="active" />
                  </div>
                  <div className="h-2 w-24 bg-aqua rounded-full" />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center border-2 border-success">
                    <Gauge className="h-10 w-10 text-success" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Valve V-03</p>
                    <StatusBadge status="active" />
                  </div>
                  <div className="h-2 w-24 bg-success rounded-full" />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-warning/20 flex items-center justify-center border-2 border-warning">
                    <ThermometerSun className="h-10 w-10 text-warning" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Tank T1</p>
                    <StatusBadge status="warning" />
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-card">
                  <Activity className="h-3 w-3 mr-1 text-success animate-pulse" />
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-elevation-2">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base">Device Monitor</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Power className={device.isOn ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground"} />
                      <span className="font-semibold text-sm">{device.name}</span>
                    </div>
                    <Switch checked={device.isOn} />
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{device.value}</span>
                    <span className="text-sm text-muted-foreground">{device.unit}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Control</span>
                      <span>{device.value}{device.unit}</span>
                    </div>
                    <Slider defaultValue={[device.value]} max={device.type === "pump" ? 4000 : 100} />
                  </div>

                  <StatusBadge status={device.status as any} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-elevation-2">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm p-3 border rounded-lg bg-warning/5 border-warning/20">
                <p className="font-medium text-warning">Tank T1 Low Level</p>
                <p className="text-xs text-muted-foreground mt-1">Level below threshold - 5 min ago</p>
              </div>
              <div className="text-sm p-3 border rounded-lg">
                <p className="font-medium text-muted-foreground">No critical alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
