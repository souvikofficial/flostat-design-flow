import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, RotateCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ScheduleEvent {
  id: string;
  title: string;
  device: string;
  startHour: number;
  durationHours: number;
  status: EventStatus;
  deviceId: string;
}

const initialDevices = [
  { id: "pump-2", name: "Pump 2" },
  { id: "valve-3", name: "Valve 3" },
  { id: "pump-1", name: "Pump 1" },
  { id: "valve-1", name: "Valve 1" },
  { id: "valve-4", name: "Valve 4" },
  { id: "pump-ahub", name: "Pump AHub" },
  { id: "pump-3", name: "Pump 3" },
  { id: "valve-2", name: "Valve 2" },
];

const initialEvents: ScheduleEvent[] = [
  {
    id: "evt-1",
    title: "Scheduled",
    device: "Pump 2",
    startHour: 13,
    durationHours: 1,
    status: "scheduled",
    deviceId: "pump-2",
  },
  {
    id: "evt-2",
    title: "Scheduled",
    device: "Pump 2",
    startHour: 14,
    durationHours: 1,
    status: "scheduled",
    deviceId: "pump-2",
  },
  {
    id: "evt-3",
    title: "Scheduled",
    device: "Pump 2",
    startHour: 16,
    durationHours: 1,
    status: "scheduled",
    deviceId: "pump-2",
  },
  {
    id: "evt-4",
    title: "Scheduled",
    device: "Pump 2",
    startHour: 16.5,
    durationHours: 0.5,
    status: "scheduled",
    deviceId: "pump-2",
  },
  {
    id: "evt-5",
    title: "Scheduled",
    device: "Pump 2",
    startHour: 17,
    durationHours: 1,
    status: "scheduled",
    deviceId: "pump-2",
  },
  {
    id: "evt-6",
    title: "Scheduled",
    device: "Valve 3",
    startHour: 13,
    durationHours: 1,
    status: "scheduled",
    deviceId: "valve-3",
  },
  {
    id: "evt-7",
    title: "Scheduled",
    device: "Valve 1",
    startHour: 15,
    durationHours: 1.5,
    status: "scheduled",
    deviceId: "valve-1",
  },
  {
    id: "evt-8",
    title: "Scheduled",
    device: "Valve 1",
    startHour: 17,
    durationHours: 0.75,
    status: "scheduled",
    deviceId: "valve-1",
  },
  {
    id: "evt-9",
    title: "Scheduled",
    device: "Valve 4",
    startHour: 16,
    durationHours: 1,
    status: "scheduled",
    deviceId: "valve-4",
  },
  {
    id: "evt-10",
    title: "Scheduled",
    device: "Valve 2",
    startHour: 16,
    durationHours: 0.3,
    status: "scheduled",
    deviceId: "valve-2",
  },
  {
    id: "evt-11",
    title: "Scheduled",
    device: "Valve 2",
    startHour: 17.5,
    durationHours: 0.3,
    status: "scheduled",
    deviceId: "valve-2",
  },
];

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [windowStart, setWindowStart] = useState<number>(12);
  const [windowEnd, setWindowEnd] = useState<number>(18);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    device: "Pump 1",
    date: "11/17/2025",
    startTime: "12:00 PM",
    endTime: "01:00 PM",
    description: "",
  });
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  // Live 'now' time, updates periodically for the moving timeline
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    // Update every 30s to keep the line fresh without over-rendering
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const hours = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  const shiftWindow = (delta: number) => {
    const span = windowEnd - windowStart;
    const nextStart = Math.max(0, Math.min(24 - span, windowStart + delta));
    const nextEnd = nextStart + span;
    setWindowStart(nextStart);
    setWindowEnd(nextEnd);
  };

  // Device cycling with chevrons
  const handlePrevDevice = () => {
    const newIndex = currentDeviceIndex === 0 ? initialDevices.length - 1 : currentDeviceIndex - 1;
    setCurrentDeviceIndex(newIndex);
    setSelectedDevice(initialDevices[newIndex].id);
  };

  const handleNextDevice = () => {
    const newIndex = currentDeviceIndex === initialDevices.length - 1 ? 0 : currentDeviceIndex + 1;
    setCurrentDeviceIndex(newIndex);
    setSelectedDevice(initialDevices[newIndex].id);
  };

  // Update currentDeviceIndex when selectedDevice changes from dropdown
  useEffect(() => {
    if (selectedDevice !== "all") {
      const idx = initialDevices.findIndex((d) => d.id === selectedDevice);
      if (idx >= 0) {
        setCurrentDeviceIndex(idx);
      }
    }
  }, [selectedDevice]);

  const filteredEvents = selectedDevice === "all" ? events : events.filter((evt) => evt.deviceId === selectedDevice);

  const handleReset = () => {
    setSelectedBlocks([]);
    setSelectedDevice("all");
    setSelectedEventId(null);
  };

  const handleAddSchedule = () => {
    if (!scheduleForm.device || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime || !scheduleForm.description) {
      alert("Please fill in all fields");
      return;
    }

    // Find the device ID by name
    const device = initialDevices.find((d) => d.name === scheduleForm.device);
    if (!device) {
      alert("Device not found");
      return;
    }

    // Parse times to hours (simplified - assuming AM/PM format)
    const parseTime = (timeStr: string) => {
      const parts = timeStr.split(/[\s:]/);
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10) || 0;
      const isPM = timeStr.includes("PM");
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      return hour + minute / 60;
    };

    const startHour = parseTime(scheduleForm.startTime);
    const endHour = parseTime(scheduleForm.endTime);
    const durationHours = Math.max(0.5, endHour - startHour);

    const newEvent: ScheduleEvent = {
      id: `evt-${Date.now()}`,
      title: "Scheduled",
      device: scheduleForm.device,
      startHour,
      durationHours,
      status: "scheduled",
      deviceId: device.id,
    };

    setEvents([...events, newEvent]);
    console.log("Schedule added:", newEvent);
    alert(`Schedule added for ${scheduleForm.device}`);
    setIsScheduleOpen(false);
    setScheduleForm({
      device: "Pump 1",
      date: "11/17/2025",
      startTime: "12:00 PM",
      endTime: "01:00 PM",
      description: "",
    });
  };

  // Keyboard navigation across events
  const handleKeyNav: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const sorted = [...filteredEvents].sort((a, b) => a.startHour - b.startHour);
    const idx = sorted.findIndex((ev) => ev.id === selectedEventId);
    if (e.key === "ArrowRight") {
      const next = idx < 0 ? 0 : Math.min(sorted.length - 1, idx + 1);
      setSelectedEventId(sorted[next]?.id ?? null);
    } else if (e.key === "ArrowLeft") {
      const prev = idx < 0 ? 0 : Math.max(0, idx - 1);
      setSelectedEventId(sorted[prev]?.id ?? null);
    } else if (e.key === "Home") {
      setSelectedEventId(sorted[0]?.id ?? null);
    } else if (e.key === "End") {
      setSelectedEventId(sorted[sorted.length - 1]?.id ?? null);
    }
  };

  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  return (
    <div className="space-y-4 animate-fadeIn" tabIndex={0} onKeyDown={handleKeyNav}>
      {/* Top Toolbar */}
      <Card className="bg-gradient-card shadow-soft-lg border-border/50">
        <CardHeader className="border-b border-border/50 bg-secondary/5 p-4 transition-smooth">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-soft-muted uppercase tracking-wide">
              CALENDAR
            </div>
            <Button title="Refresh" aria-label="Refresh" variant="default" size="sm" className="bg-success/90 hover:bg-success/80 gap-2 shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5">
              <RotateCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-6 text-soft">Schedule Manager</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* 1. Block Selector */}
            <BlockSelector
              selectedBlocks={selectedBlocks}
              onBlocksChange={setSelectedBlocks}
              compact
            />

            {/* 2. Time Window with chevrons */}
            <div className="flex items-center gap-2">
              <Button title="Previous window" aria-label="Previous window" onClick={() => shiftWindow(-1)} variant="outline" size="icon" className="h-9 w-9 hover:shadow-soft-sm transition-smooth">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 border border-border/50 rounded-md bg-background/80 text-sm font-medium min-w-[140px] text-center h-9 flex items-center justify-center shadow-soft-sm">
                {String(windowStart).padStart(2, '0')}:00 - {String(windowEnd).padStart(2, '0')}:00
              </div>
              <Button title="Next window" aria-label="Next window" onClick={() => shiftWindow(1)} variant="outline" size="icon" className="h-9 w-9 hover:shadow-soft-sm transition-smooth">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 3. Device Filter 'All Devices' with chevrons */}
            <div className="flex items-center gap-2">
              <Button title="Previous device" aria-label="Previous device" variant="outline" size="icon" className="h-9 w-9 hover:shadow-soft-sm transition-smooth" onClick={handlePrevDevice}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="w-[160px] h-9 transition-smooth focus:shadow-soft-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  {initialDevices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button title="Next device" aria-label="Next device" variant="outline" size="icon" className="h-9 w-9 hover:shadow-soft-sm transition-smooth" onClick={handleNextDevice}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1" />

            {/* 4. Reset (ghost) */}
            <Button title="Reset filters" aria-label="Reset filters" variant="ghost" onClick={handleReset} className="text-soft-muted h-9 hover:text-soft transition-smooth">
              Reset
            </Button>
            
            {/* 5. Add Schedule (primary) */}
            <Button 
              title="Add schedule" 
              aria-label="Add schedule" 
              className="gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 h-9 shadow-soft-sm hover:shadow-soft-md transition-smooth hover:-translate-y-0.5"
              onClick={() => setIsScheduleOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
            
            {/* 6. Refresh */}
            <Button title="Refresh" aria-label="Refresh" variant="outline" size="icon" className="h-9 w-9 hover:shadow-soft-sm transition-smooth">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-soft-muted">
            <div className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(220,70%,62%)]" /> Scheduled</div>
            <div className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-success/90" /> Active</div>
            <div className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-muted" /> Completed</div>
            <div className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-destructive/90" /> Cancelled</div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-soft-sm">
            <div className="flex">
              <div className="w-48 shrink-0 border-r border-border/50 bg-secondary/5 px-4 py-3 text-sm font-semibold text-soft">
                Device / Hour
              </div>
              <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-r border-border/50 px-2 py-3 text-center text-xs font-medium text-soft-muted"
                  >
                    {hour}:00
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="relative min-h-[400px]">
            {/* Global current time indicator */}
            {currentHour >= windowStart && currentHour <= windowEnd && (
              <div
                className="pointer-events-none absolute top-[48px] bottom-0 w-0.5 bg-destructive/90 z-20"
                style={{ left: `${((currentHour - windowStart) / (windowEnd - windowStart)) * 100}%` }}
              >
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-destructive shadow-sm" />
                <div className="absolute -top-6 -translate-x-1/2 px-1.5 py-0.5 rounded bg-destructive text-white text-[10px] font-semibold tracking-wide shadow-soft-sm">
                  Now
                </div>
              </div>
            )}
            {initialDevices.map((device, idx) => {
              const deviceEvents = filteredEvents.filter(
                (evt) => evt.deviceId === device.id
              );

              return (
                <div key={device.id} className="flex border-b border-border/50 last:border-b-0 hover:bg-secondary/5 transition-smooth">
                  <div className="w-48 shrink-0 border-r border-border/50 bg-background px-4 py-6 text-sm font-medium text-soft">
                    {device.name}
                  </div>
                  <div
                    className="flex-1 relative h-20 grid"
                    style={{ gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))` }}
                    onMouseMove={(e) => {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const col = Math.floor((x / rect.width) * (hours.length));
                      const h = windowStart + Math.max(0, Math.min(hours.length - 1, col));
                      setHoveredHour(h);
                    }}
                    onMouseLeave={() => setHoveredHour(null)}
                    onDoubleClick={(e) => {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const col = Math.floor((x / rect.width) * (hours.length));
                      const h = windowStart + Math.max(0, Math.min(hours.length - 1, col));
                      // Prefill the modal with clicked device and hour
                      setScheduleForm({
                        device: device.name,
                        date: "11/17/2025",
                        startTime: `${String(Math.floor(h)).padStart(2, "0")}:00 ${"AM"}`,
                        endTime: `${String(Math.floor(h + 1)).padStart(2, "0")}:00 ${"AM"}`,
                        description: "",
                      });
                      setIsScheduleOpen(true);
                    }}
                    role="grid"
                    aria-label={`Timeline for ${device.name}`}
                  >
                    {hours.map((hour) => (
                      <div key={hour} className="border-r border-border/30 h-full" />
                    ))}

                    {/* Hovered column highlight */}
                    {hoveredHour !== null && hoveredHour >= windowStart && hoveredHour <= windowEnd && (
                      <div
                        className="pointer-events-none absolute top-0 bottom-0 bg-[hsl(var(--aqua))]/10 z-10"
                        style={{
                          left: `${((hoveredHour - windowStart) / (windowEnd - windowStart)) * 100}%`,
                          width: `${(1 / (windowEnd - windowStart)) * 100}%`,
                        }}
                      />
                    )}

                    {/* Event pills */}
                    {deviceEvents.map((event) => (
                      <EventPill
                        key={event.id}
                        {...event}
                        startHour={event.startHour}
                        durationHours={event.durationHours}
                        timeRangeStart={windowStart}
                        timeRangeEnd={windowEnd}
                        selected={selectedEventId === event.id}
                        onSelect={() =>
                          setSelectedEventId(
                            selectedEventId === event.id ? null : event.id
                          )
                        }
                        onEdit={() => {
                          // Edit event handler - update in local state
                          console.log("Edit event:", event.id);
                          // In a real scenario, you'd open an edit modal
                        }}
                        onDelete={() => {
                          // Delete event handler - remove from local state
                          setEvents(events.filter((e) => e.id !== event.id));
                          console.log("Delete event:", event.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {!isLoading && !error && filteredEvents.length === 0 && (
              <div className="flex items-center justify-center py-20 text-center">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">No scheduled events</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Click "Add Schedule" to create a new event for your devices
                  </p>
                  <Button className="mt-4 gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90" onClick={() => setIsScheduleOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Schedule
                  </Button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="space-y-3 text-center">
                  <RotateCw className="h-8 w-8 animate-spin mx-auto text-[hsl(var(--aqua))]" />
                  <p className="text-sm text-muted-foreground">Loading schedule...</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error loading schedule</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Schedule Event Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Schedule Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Device and Date Display */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Device:</span>
                <span className="text-sm font-medium">{scheduleForm.device}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">{scheduleForm.date}</span>
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="text-sm font-medium block mb-2">Start Time *</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  className="flex-1"
                  placeholder="12:00 PM"
                />
                <button className="p-2 border rounded-md hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="text-sm font-medium block mb-2">End Time *</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                  className="flex-1"
                  placeholder="01:00 PM"
                />
                <button className="p-2 border rounded-md hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium block mb-2">What needs to be done? *</label>
              <textarea
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                placeholder="Procedure, Replace valve seal, etc."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">0/300 characters</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddSchedule}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
