import type { ReactNode } from "react"
import { Info } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useRole } from "@/hooks/useRole"
import { cn } from "@/lib/utils"

export function PageShell({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  const { isViewer } = useRole()

  return (
    <main className={cn("mx-auto max-w-7xl px-5 py-6", className)}>
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
            Overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {actions}
      </div>

      {isViewer ? (
        <Card className="mb-6 border-primary/20 bg-primary/[0.04]">
          <CardContent className="flex items-center gap-3 p-3.5 text-xs">
            <Info className="size-3.5 text-primary" />
            <span>You are viewing in read-only mode.</span>
          </CardContent>
        </Card>
      ) : null}

      {children}
    </main>
  )
}
