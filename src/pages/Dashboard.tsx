import { useEffect, useState } from "react"

import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart"
import { CashFlowChart } from "@/components/dashboard/CashFlowChart"
import { DailySpendingChart } from "@/components/dashboard/DailySpendingChart"
import { SpendingBreakdown } from "@/components/dashboard/SpendingBreakdown"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { PageShell } from "@/components/layout/PageShell"
import { Skeleton } from "@/components/ui/skeleton"

export function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <PageShell
      title="Dashboard"
      description="Snapshot of balances, cash flow, and spending composition."
    >
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Skeleton className="h-[380px]" />
            <Skeleton className="h-[380px]" />
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      ) : (
        <div className="space-y-4">
          <SummaryCards />
          <div className="grid gap-4 xl:grid-cols-2">
            <BalanceTrendChart />
            <SpendingBreakdown />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <CashFlowChart />
            <DailySpendingChart />
          </div>
        </div>
      )}
    </PageShell>
  )
}
