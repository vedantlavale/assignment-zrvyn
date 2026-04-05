import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useTransactionContext } from "@/context/TransactionContext"
import { useCountUp } from "@/hooks/useCountUp"
import { formatCompactCurrency, formatCurrency, groupByMonth } from "@/lib/utils"

const StatValue = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const animatedValue = useCountUp(Math.max(0, Math.round(value)))
  const isPercent = suffix === "%"

  return <span>{isPercent ? `${animatedValue}%` : `${formatCurrency(animatedValue)}${suffix}`}</span>
}

export function SummaryCards() {
  const { transactions } = useTransactionContext()
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome ? (totalBalance / totalIncome) * 100 : 0

  const monthly = groupByMonth(transactions, 2)
  const currentBalance = monthly[1]?.balance ?? 0
  const previousBalance = monthly[0]?.balance ?? 0
  const monthChange = previousBalance
    ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100
    : 0

  const cards = [
    {
      label: "My balance",
      value: totalBalance,
      helper: `${monthChange >= 0 ? "↑" : "↓"} ${Math.abs(monthChange).toFixed(1)}% vs last month`,
      icon: Wallet,
      tone: "text-primary",
      trendClass: monthChange >= 0 ? "text-income" : "text-expense",
    },
    {
      label: "Monthly income",
      value: totalIncome,
      helper: `↑ ${formatCompactCurrency(monthly[1]?.income ?? 0)} this month`,
      icon: TrendingUp,
      tone: "text-income",
      trendClass: "text-income",
    },
    {
      label: "Monthly expenses",
      value: totalExpenses,
      helper: `↓ ${formatCompactCurrency(monthly[1]?.expense ?? 0)} this month`,
      icon: TrendingDown,
      tone: "text-expense",
      trendClass: "text-expense",
    },
    {
      label: "Savings Rate",
      value: Math.round(savingsRate),
      helper: savingsRate >= 20 ? "Healthy cash cushion" : "Watch discretionary spend",
      icon: PiggyBank,
      tone: savingsRate >= 20 ? "text-income" : "text-amber-500",
      trendClass: savingsRate >= 20 ? "text-income" : "text-amber-500",
      suffix: "%",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.label} className="overflow-hidden bg-white">
            <CardContent className="p-5">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                </div>
                <div className={`rounded-full border border-border bg-white p-2.5 ${card.tone}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-[2rem] font-semibold tabular-nums tracking-tight">
                  <StatValue value={card.value} suffix={card.suffix} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${card.trendClass}`}>
                  {card.trendClass === "text-expense" ? (
                    <ArrowDownRight className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                  <span>{card.helper}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
