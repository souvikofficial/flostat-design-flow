import { cn } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EventStatus = "scheduled" | "active" | "completed" | "cancelled";

interface EventPillProps {
  title: string;
  device: string;
  startHour: number;
  durationHours: number;
  status: EventStatus;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const statusColors: Record<EventStatus, string> = {
  scheduled: "bg-[hsl(192,100%,42%)]/80 border-[hsl(192,100%,42%)]", // Aqua/indigo theme
  active: "bg-success/80 border-success",
  completed: "bg-muted/80 border-muted-foreground",
  cancelled: "bg-destructive/80 border-destructive",
};

const statusDots: Record<EventStatus, string> = {
  scheduled: "bg-[hsl(192,100%,42%)]",
  active: "bg-success",
  completed: "bg-muted-foreground",
  cancelled: "bg-destructive",
};

export function EventPill({
  title,
  device,
  startHour,
  durationHours,
  status,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  className,
}: EventPillProps) {
  const width = `${(durationHours / 24) * 100}%`;
  const left = `${(startHour / 24) * 100}%`;

  return (
    <div
      className={cn(
        "absolute group cursor-pointer rounded border-2 px-2 py-1 text-white transition-all hover:shadow-lg hover:z-10",
        statusColors[status],
        selected && "ring-2 ring-success ring-offset-2 ring-offset-background z-20",
        className
      )}
      style={{
        left,
        width,
        minWidth: "80px",
      }}
      onClick={onSelect}
    >
      <div className="flex items-start gap-1.5">
        <div
          className={cn(
            "mt-1 h-2 w-2 rounded-full shrink-0",
            statusDots[status]
          )}
        />
        <div className="flex-1 min-w-0 text-xs">
          <div className="font-semibold truncate">{title}</div>
          <div className="text-white/80 truncate text-[10px]">{device}</div>
        </div>
      </div>

      {selected && (
        <div className="absolute -top-8 right-0 flex gap-1 bg-card border rounded-md shadow-elevation-2 p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
