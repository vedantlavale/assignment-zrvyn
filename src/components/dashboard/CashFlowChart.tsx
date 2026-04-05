import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactionContext } from "@/context/TransactionContext"
import { formatCompactCurrency, formatCurrency, groupByMonth } from "@/lib/utils"

export function CashFlowChart() {
  const { transactions } = useTransactionContext()

  const data = useMemo(() => {
    return groupByMonth(transactions, 6).map((month) => ({
      label: month.label,
      income: month.income,
      expense: -month.expense,
      net: month.balance,
    }))
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Monthly income vs expenses with net position</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barCategoryGap="18%">
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
              tickFormatter={(value) => formatCompactCurrency(Math.abs(value))}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              width={72}
            />
            <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1} />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const income = Number(payload[0]?.value || 0)
                const expense = Math.abs(Number(payload[1]?.value || 0))
                const net = income - expense

                return (
                  <div className="border border-border bg-card px-4 py-3 text-sm shadow-lg">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider">{label}</p>
                    <div className="space-y-1 font-mono text-xs tabular-nums">
                      <p className="text-income">In: {formatCurrency(income)}</p>
                      <p className="text-expense">Out: {formatCurrency(expense)}</p>
                      <p className="border-t border-border pt-1 font-semibold text-foreground">
                        Net: {formatCurrency(net)}
                      </p>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="income" isAnimationActive>
              {data.map((_, index) => (
                <Cell key={`income-${index}`} fill="var(--color-income)" />
              ))}
            </Bar>
            <Bar dataKey="expense" isAnimationActive>
              {data.map((_, index) => (
                <Cell key={`expense-${index}`} fill="var(--color-expense)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
