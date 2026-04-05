import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
