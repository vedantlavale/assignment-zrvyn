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
          <BarChart data={monthly}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.35} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactCurrency(value)}
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
                  <div className="rounded-xl border border-border bg-[#101728] px-4 py-3 text-sm text-white shadow-2xl">
                    <p className="mb-2 font-medium">{label}</p>
                    <div className="space-y-1 font-mono">
                      <p>Income: {formatCurrency(income)}</p>
                      <p>Expense: {formatCurrency(expense)}</p>
                      <p>Net savings: {formatCurrency(income - expense)}</p>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[10, 10, 0, 0]} isAnimationActive />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[10, 10, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
