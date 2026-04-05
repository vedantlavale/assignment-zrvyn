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
    <main className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-6", className)}>
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Overview</p>
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions}
      </div>

      {isViewer ? (
        <Card className="mb-6 border-[#dce8d5] bg-[#f3f8ef]">
          <CardContent className="flex items-center gap-3 p-4 text-sm">
            <Info className="size-4 text-primary" />
            <span>You are viewing in read-only mode.</span>
          </CardContent>
        </Card>
      ) : null}

      {children}
    </main>
  )
}
