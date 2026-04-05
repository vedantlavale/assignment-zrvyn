import { cn } from "@/lib/utils"

export function ProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted/70", className)}>
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  )
}
