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
        <CardDescription>Track income and expense momentum over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.22} />
                <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.55} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) =>
                index % 2 === 0 ? formatCompactCurrency(value) : ""
              }
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
                  <div className="rounded-md border border-border bg-white px-4 py-3 text-sm text-foreground shadow-lg">
                    <p className="mb-2 font-medium">{label}</p>
                    <div className="space-y-1 font-mono tabular-nums">
                      <p>Income: {formatCurrency(income)}</p>
                      <p>Expenses: {formatCurrency(expense)}</p>
                      <p>Net: {formatCurrency(income - expense)}</p>
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
              strokeWidth={2.5}
            />
            <Area
              type="monotone"
              dataKey="cumulativeExpense"
              stroke="var(--color-expense)"
              fill="url(#expenseFill)"
              dot={false}
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
