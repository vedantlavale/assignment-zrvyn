import { cn } from "@/lib/utils"

export function ProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden bg-muted", className)}>
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  )
}
