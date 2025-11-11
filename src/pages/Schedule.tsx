import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  { id: 1, title: "Pump A1 Maintenance", time: "09:00 - 11:00", date: "2024-01-15", type: "maintenance", device: "Pump A1" },
  { id: 2, title: "Tank T1 Inspection", time: "14:00 - 15:30", date: "2024-01-15", type: "inspection", device: "Tank T1" },
  { id: 3, title: "Valve Calibration", time: "10:00 - 12:00", date: "2024-01-16", type: "calibration", device: "Valve V-03" },
  { id: 4, title: "System Backup", time: "00:00 - 02:00", date: "2024-01-17", type: "backup", device: "All Systems" },
  { id: 5, title: "Pump B2 Service", time: "13:00 - 16:00", date: "2024-01-18", type: "maintenance", device: "Pump B2" },
];

const eventTypeColors = {
  maintenance: "bg-warning/10 text-warning border-warning/20",
  inspection: "bg-aqua/10 text-aqua border-aqua/20",
  calibration: "bg-success/10 text-success border-success/20",
  backup: "bg-secondary/10 text-secondary-foreground border-border",
};

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
          <p className="text-muted-foreground mt-1">Plan and manage maintenance schedules</p>
        </div>
        <Button variant="aqua" className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-elevation-2">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-aqua" />
                January 2024
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 0;
                const isToday = day === 15;
                const hasEvent = [15, 16, 17, 18].includes(day);
                return (
                  <div
                    key={i}
                    className={`
                      aspect-square p-2 rounded-lg border cursor-pointer transition-colors
                      ${day < 1 || day > 31 ? "text-muted-foreground/30" : "hover:bg-muted"}
                      ${isToday ? "border-aqua bg-aqua/5 font-semibold" : "border-border"}
                      ${hasEvent && !isToday ? "bg-secondary/10" : ""}
                    `}
                  >
                    {day > 0 && day <= 31 && (
                      <>
                        <div>{day}</div>
                        {hasEvent && (
                          <div className="mt-1 h-1 w-1 mx-auto rounded-full bg-aqua" />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-elevation-2">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{event.device}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${eventTypeColors[event.type as keyof typeof eventTypeColors]}`}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
