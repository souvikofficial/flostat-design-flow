import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning" | "error";
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      className: "bg-success text-success-foreground",
      defaultLabel: "Active",
    },
    inactive: {
      className: "bg-muted text-muted-foreground",
      defaultLabel: "Inactive",
    },
    warning: {
      className: "bg-warning text-warning-foreground",
      defaultLabel: "Warning",
    },
    error: {
      className: "bg-destructive text-destructive-foreground",
      defaultLabel: "Error",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || config.defaultLabel}
    </span>
  );
}
