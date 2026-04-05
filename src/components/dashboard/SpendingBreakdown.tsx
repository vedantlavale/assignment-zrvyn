import { useMemo } from "react"
import { Cell, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionContext } from "@/context/TransactionContext"
import { categoryPalette, formatCurrency } from "@/lib/utils"

export function SpendingBreakdown() {
  const { transactions } = useTransactionContext()

  const data = useMemo(() => {
    const totals = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      }, {})

    const entries = Object.entries(totals).sort((left, right) => right[1] - left[1])
    const topFive = entries.slice(0, 5)
    const otherAmount = entries.slice(5).reduce((sum, [, amount]) => sum + amount, 0)
    const total = entries.reduce((sum, [, amount]) => sum + amount, 0)
    const merged = otherAmount > 0 ? [...topFive, ["Other", otherAmount] as const] : topFive

    return merged.map(([name, amount]) => ({
      name,
      amount,
      fill: categoryPalette[name],
      percent: total ? (amount / total) * 100 : 0,
    }))
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All expenses</CardTitle>
        <CardDescription>Category mix based on your tracked outgoing payments</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="25%"
              outerRadius="95%"
              barSize={18}
              data={data}
              startAngle={180}
              endAngle={-180}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null
                  }

                  const item = payload[0].payload as { name: string; amount: number; percent: number }

                  return (
                    <div className="rounded-md border border-border bg-white px-4 py-3 text-sm text-foreground shadow-lg">
                      <p className="mb-2 font-medium">{item.name}</p>
                      <p className="font-mono">{formatCurrency(item.amount)}</p>
                      <p className="font-mono text-muted-foreground">{item.percent.toFixed(1)}% of expenses</p>
                    </div>
                  )
                }}
              />
              <RadialBar background dataKey="amount" cornerRadius={24} isAnimationActive>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {data.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <div>
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.percent.toFixed(1)}% of expenses
                    </p>
                  </div>
                </div>
                <p className="font-mono text-sm tabular-nums">
                  {formatCurrency(entry.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
