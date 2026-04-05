import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useInsights } from "@/hooks/useInsights"
import { formatCompactCurrency, formatCurrency } from "@/lib/utils"

export function MonthlyComparison() {
  const { monthly } = useInsights()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>Income versus expenses across the last six months</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.4} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactCurrency(value)}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              width={72}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
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
            <Bar dataKey="income" fill="var(--color-income)" isAnimationActive />
            <Bar dataKey="expense" fill="var(--color-expense)" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
