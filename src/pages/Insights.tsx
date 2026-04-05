import { useEffect, useState } from "react"

import { InsightCards } from "@/components/insights/InsightCards"
import { MonthlyComparison } from "@/components/insights/MonthlyComparison"
import { PageShell } from "@/components/layout/PageShell"
import { Skeleton } from "@/components/ui/skeleton"

export function Insights() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <PageShell
      title="Insights"
      description="Derived signals from your transaction history, optimized for quick decisions."
    >
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40" />
            ))}
          </div>
          <Skeleton className="h-[380px]" />
        </div>
      ) : (
        <div className="space-y-4">
          <InsightCards />
          <MonthlyComparison />
        </div>
      )}
    </PageShell>
  )
}
