import { useMemo } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, eachDayOfInterval, subDays } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionContext } from "@/context/TransactionContext"
import { formatCurrency } from "@/lib/utils"

export function DailySpendingChart() {
  const { transactions } = useTransactionContext()

  const data = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 29)
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now })

    const expensesByDay = transactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        const key = t.date
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      }, {})

    let runningTotal = 0
    return days.map((day) => {
      const key = format(day, "yyyy-MM-dd")
      const spent = expensesByDay[key] || 0
      runningTotal += spent
      return {
        date: format(day, "d MMM"),
        dailySpend: spent,
        cumulative: runningTotal,
      }
    })
  }, [transactions])

  const totalSpent = data.reduce((sum, d) => sum + d.dailySpend, 0)
  const avgDaily = totalSpent / data.length
  const peakDay = data.reduce((max, d) => (d.dailySpend > max.dailySpend ? d : max), data[0])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Daily Spending</CardTitle>
            <CardDescription>Expense pattern over the last 30 days</CardDescription>
          </div>
          <div className="flex gap-5">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Avg/Day
              </p>
              <p className="font-mono text-sm font-semibold tabular-nums">
                {formatCurrency(Math.round(avgDaily))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Peak
              </p>
              <p className="font-mono text-sm font-semibold tabular-nums text-expense">
                {formatCurrency(peakDay?.dailySpend ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="dailySpendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              interval={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              width={48}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const spent = Number(payload[0]?.value || 0)
                return (
                  <div className="border border-border bg-card px-3 py-2.5 text-xs shadow-lg">
                    <p className="mb-1 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="font-mono tabular-nums text-expense">
                      {spent > 0 ? formatCurrency(spent) : "No spending"}
                    </p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="dailySpend"
              stroke="var(--color-expense)"
              fill="url(#dailySpendFill)"
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
