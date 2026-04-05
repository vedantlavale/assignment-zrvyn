import { useMemo } from "react"

import { useTransactionContext } from "@/context/TransactionContext"
import { categoryPalette, groupByMonth } from "@/lib/utils"

export function useInsights() {
  const { transactions } = useTransactionContext()

  return useMemo(() => {
    const monthly = groupByMonth(transactions, 6)
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const expenseByCategory = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      }, {})

    const highestCategoryEntry = Object.entries(expenseByCategory).sort(
      (left, right) => right[1] - left[1]
    )[0]

    const thisMonth = monthly[monthly.length - 1]
    const bestSavingsMonth = [...monthly].sort(
      (left, right) => right.balance - left.balance
    )[0]

    const foodPercent = totalExpenses
      ? (expenseByCategory["Food & Dining"] || 0) / totalExpenses
      : 0
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0

    let smartTip = "Your spending mix looks healthy. Keep reviewing monthly trends."
    if (foodPercent > 0.3) {
      smartTip = "Food & Dining is your top expense. Try meal prep on busy weekdays."
    } else if (savingsRate < 0.1) {
      smartTip =
        "Your savings rate is below 10%. Review shopping and entertainment spend."
    } else if ((expenseByCategory.Shopping || 0) > (expenseByCategory.Utilities || 0) * 2) {
      smartTip = "Shopping spend is running hot. Consider a discretionary cap next month."
    }

    return {
      monthly,
      highestSpending: highestCategoryEntry
        ? {
            category: highestCategoryEntry[0],
            amount: highestCategoryEntry[1],
            percent: totalExpenses
              ? (highestCategoryEntry[1] / totalExpenses) * 100
              : 0,
            color:
              categoryPalette[highestCategoryEntry[0]] || "var(--color-accent)",
          }
        : null,
      bestSavingsMonth,
      thisMonth,
      smartTip,
      savingsRate,
    }
  }, [transactions])
}
