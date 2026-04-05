import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionContext } from "@/context/TransactionContext"
import { formatCompactCurrency, formatCurrency, groupByMonth } from "@/lib/utils"

export function BalanceTrendChart() {
  const { transactions } = useTransactionContext()

  const data = useMemo(() => {
    let cumulativeIncome = 0
    let cumulativeExpense = 0

    return groupByMonth(transactions, 6).map((month) => {
      cumulativeIncome += month.income
      cumulativeExpense += month.expense

      return {
        ...month,
        cumulativeIncome,
        cumulativeExpense,
        net: cumulativeIncome - cumulativeExpense,
      }
    })
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Income and expense momentum — last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) =>
                index % 2 === 0 ? formatCompactCurrency(value) : ""
              }
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              width={72}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const income = Number(payload[0]?.value || 0)
                const expense = Number(payload[1]?.value || 0)

                return (
                  <div className="border border-border bg-card px-4 py-3 text-sm shadow-lg">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider">{label}</p>
                    <div className="space-y-1 font-mono text-xs tabular-nums">
                      <p className="text-income">Income: {formatCurrency(income)}</p>
                      <p className="text-expense">Expense: {formatCurrency(expense)}</p>
                      <p className="border-t border-border pt-1 font-semibold text-foreground">
                        Net: {formatCurrency(income - expense)}
                      </p>
                    </div>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeIncome"
              stroke="var(--color-income)"
              fill="url(#incomeFill)"
              dot={false}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cumulativeExpense"
              stroke="var(--color-expense)"
              fill="url(#expenseFill)"
              dot={false}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
