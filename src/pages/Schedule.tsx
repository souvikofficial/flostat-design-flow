import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlockSelector } from "@/components/BlockSelector";
import { EventPill, EventStatus } from "@/components/EventPill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, RotateCw } from "lucide-react";

interface ScheduleEvent {
  id: string;
  title: string;
  device: string;
  startHour: number;
  durationHours: number;
  status: EventStatus;
  deviceId: string;
}

const devices = [
  { id: "pump-a1", name: "Pump A1" },
  { id: "valve-v03", name: "Valve V-03" },
  { id: "tank-t1", name: "Tank T1" },
  { id: "pump-b2", name: "Pump B2" },
];

const events: ScheduleEvent[] = [
  {
    id: "evt-1",
    title: "Maintenance",
    device: "Pump A1",
    startHour: 9,
    durationHours: 2,
    status: "scheduled",
    deviceId: "pump-a1",
  },
  {
    id: "evt-2",
    title: "Inspection",
    device: "Tank T1",
    startHour: 14,
    durationHours: 1.5,
    status: "scheduled",
    deviceId: "tank-t1",
  },
  {
    id: "evt-3",
    title: "Calibration",
    device: "Valve V-03",
    startHour: 10,
    durationHours: 2,
    status: "active",
    deviceId: "valve-v03",
  },
  {
    id: "evt-4",
    title: "Service",
    device: "Pump B2",
    startHour: 13,
    durationHours: 3,
    status: "scheduled",
    deviceId: "pump-b2",
  },
];

export default function Schedule() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [timeWindow, setTimeWindow] = useState<string>("today");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const filteredEvents =
    selectedDevice === "all"
      ? events
      : events.filter((evt) => evt.deviceId === selectedDevice);

  const handleReset = () => {
    setSelectedBlocks([]);
    setSelectedDevice("all");
    setSelectedEventId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
        <p className="text-muted-foreground mt-1">Plan and manage maintenance schedules</p>
      </div>

      {/* Top Toolbar */}
      <Card className="shadow-elevation-2">
        <CardHeader className="border-b bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <BlockSelector
              selectedBlocks={selectedBlocks}
              onBlocksChange={setSelectedBlocks}
            />

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={timeWindow} onValueChange={setTimeWindow}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="aqua" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
            <Button variant="outline" size="icon">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-card border-b">
            <div className="flex">
              <div className="w-32 shrink-0 border-r bg-muted/30 px-4 py-3 text-sm font-semibold">
                Device
              </div>
              <div className="flex-1 grid grid-cols-24 border-l">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-r px-2 py-3 text-center text-xs font-medium text-muted-foreground"
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="relative">
            {devices.map((device, idx) => {
              const deviceEvents = filteredEvents.filter(
                (evt) => evt.deviceId === device.id
              );

              return (
                <div key={device.id} className="flex border-b hover:bg-muted/20">
                  <div className="w-32 shrink-0 border-r bg-card px-4 py-4 text-sm font-medium">
                    {device.name}
                  </div>
                  <div className="flex-1 relative h-16 grid grid-cols-24 border-l">
                    {hours.map((hour) => (
                      <div key={hour} className="border-r" />
                    ))}

                    {/* Current time indicator */}
                    {idx === 0 && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                        style={{
                          left: `${(currentHour / 24) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-destructive" />
                      </div>
                    )}

                    {/* Event pills */}
                    {deviceEvents.map((event) => (
                      <EventPill
                        key={event.id}
                        {...event}
                        selected={selectedEventId === event.id}
                        onSelect={() =>
                          setSelectedEventId(
                            selectedEventId === event.id ? null : event.id
                          )
                        }
                        onEdit={() => console.log("Edit event:", event.id)}
                        onDelete={() => console.log("Delete event:", event.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredEvents.length === 0 && (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-semibold">No scheduled events</p>
                  <p className="text-sm mt-1">
                    Click "Add Schedule" to create a new event
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
