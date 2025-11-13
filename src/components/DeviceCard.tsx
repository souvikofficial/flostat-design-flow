import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Droplets, Gauge, ThermometerSun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface DeviceCardProps {
  id: string;
  name: string;
  type: "pump" | "valve" | "tank" | "sump";
  status: "active" | "inactive" | "warning" | "error";
  value: number;
  unit: string;
  threshold?: { min: number; max: number };
  location: string;
}

const typeIcons = {
  pump: Droplets,
  valve: Gauge,
  tank: ThermometerSun,
  sump: Droplets,
} as const;

export function DeviceCard({ name, type, status, value, unit, threshold, location }: DeviceCardProps) {
  const Icon = typeIcons[type];
  const initialActive = status === "active";
  const [isOn, setIsOn] = useState<boolean>(initialActive);
  const derivedStatus: "active" | "inactive" | "warning" | "error" =
    status === "warning" || status === "error" ? status : isOn ? "active" : "inactive";
  const isActive = derivedStatus === "active";
  const nextActionLabel = type === "valve" ? (isOn ? "Close valve" : "Open valve") : (isOn ? "Turn power off" : "Turn power on");

  return (
    <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isActive ? "bg-aqua/10" : "bg-muted"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-aqua" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
            </div>
          </div>
          <StatusBadge status={derivedStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold">{value}</span>
            <span className="ml-2 text-sm text-muted-foreground">{unit}</span>
          </div>
          <Badge variant="outline" className="text-xs">{type.toUpperCase()}</Badge>
        </div>

        {threshold && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {threshold.min}</span>
              <span>Max: {threshold.max}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  value >= threshold.min && value <= threshold.max 
                    ? "bg-success" 
                    : "bg-warning"
                )}
                style={{ width: `${Math.min((value / threshold.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {type !== "tank" && (
          <div className="flex items-center justify-between border rounded-md p-2.5">
            <span className="text-sm font-medium">{type === "valve" ? "Valve" : "Power"}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isOn ? (type === "valve" ? "OPEN" : "ON") : (type === "valve" ? "CLOSED" : "OFF")}
              </span>
              <Switch
                checked={isOn}
                onCheckedChange={setIsOn}
                aria-label={nextActionLabel}
              />
            </div>
          </div>
        )}

        {/* Live region for assistive tech announcing status changes */}
        <span className="sr-only" aria-live="polite">
          {name} status {derivedStatus}
        </span>

        {/* Details button removed per request */}
      </CardContent>
    </Card>
  );
}
