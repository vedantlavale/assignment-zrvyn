import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

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

  const totalExpenses = data.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>Category breakdown of outgoing payments</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) {
                      return null
                    }

                    const item = payload[0].payload as { name: string; amount: number; percent: number }

                    return (
                      <div className="border border-border bg-card px-4 py-3 text-sm shadow-lg">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider">{item.name}</p>
                        <p className="font-mono text-xs tabular-nums">{formatCurrency(item.amount)}</p>
                        <p className="font-mono text-xs text-muted-foreground">{item.percent.toFixed(1)}%</p>
                      </div>
                    )
                  }}
                />
                <Pie
                  data={data}
                  dataKey="amount"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-0">
            <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Category
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Amount
              </span>
            </div>
            {data.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between border-b border-border/50 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2.5"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <div>
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {entry.percent.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="font-mono text-sm tabular-nums">
                  {formatCurrency(entry.amount)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
