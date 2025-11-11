import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Droplets, Gauge, ThermometerSun } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceCardProps {
  id: string;
  name: string;
  type: "pump" | "valve" | "tank";
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
};

export function DeviceCard({ name, type, status, value, unit, threshold, location }: DeviceCardProps) {
  const Icon = typeIcons[type];
  const isActive = status === "active";

  return (
    <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              isActive ? "bg-aqua/10" : "bg-muted"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                isActive ? "text-aqua" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{location}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold">{value}</span>
            <span className="ml-2 text-sm text-muted-foreground">{unit}</span>
          </div>
          <Badge variant="outline" className="text-xs">{type.toUpperCase()}</Badge>
        </div>

        {threshold && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {threshold.min}</span>
              <span>Max: {threshold.max}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
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

        <div className="flex gap-2">
          <Button 
            variant={isActive ? "outline" : "aqua"} 
            size="sm" 
            className="flex-1"
          >
            {isActive ? "Turn OFF" : "Turn ON"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
