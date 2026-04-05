import { Lightbulb, PiggyBank, Trophy, Wallet2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress"
import { useInsights } from "@/hooks/useInsights"
import { formatCurrency } from "@/lib/utils"

export function InsightCards() {
  const { highestSpending, bestSavingsMonth, thisMonth, smartTip } = useInsights()

  const incomeRatio = thisMonth?.income
    ? Math.min((thisMonth.balance / thisMonth.income) * 100, 100)
    : 0

  const cards = [
    {
      title: "Highest Spending",
      icon: Trophy,
      content: highestSpending ? (
        <>
          <p className="text-lg font-semibold">{highestSpending.category}</p>
          <p className="font-mono text-sm">{formatCurrency(highestSpending.amount)}</p>
          <p className="text-sm text-muted-foreground">
            {highestSpending.percent.toFixed(1)}% of expenses
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No expense data yet.</p>
      ),
    },
    {
      title: "Best Savings Month",
      icon: PiggyBank,
      content: bestSavingsMonth ? (
        <>
          <p className="text-lg font-semibold">{bestSavingsMonth.label}</p>
          <p className="font-mono text-sm">{formatCurrency(bestSavingsMonth.balance)}</p>
          <p className="text-sm text-muted-foreground">
            Highest monthly surplus in the last 6 months
          </p>
        </>
      ) : null,
    },
    {
      title: "This Month Ratio",
      icon: Wallet2,
      content: (
        <>
          <p className="text-lg font-semibold">{formatCurrency(thisMonth?.balance ?? 0)}</p>
          <ProgressBar value={incomeRatio < 0 ? 0 : incomeRatio} className="mt-3" />
          <p className="mt-2 text-sm text-muted-foreground">
            {formatCurrency(thisMonth?.income ?? 0)} income vs{" "}
            {formatCurrency(thisMonth?.expense ?? 0)} expense
          </p>
        </>
      ),
    },
    {
      title: "Smart Tip",
      icon: Lightbulb,
      content: <p className="text-sm leading-6 text-muted-foreground">{smartTip}</p>,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="rounded-2xl bg-muted/60 p-3">
                  <Icon className="size-4 text-accent" />
                </div>
              </div>
              <div className="space-y-2">{card.content}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
