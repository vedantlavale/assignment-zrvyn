import { clsx, type ClassValue } from "clsx"
import { format, parseISO, startOfMonth, subMonths } from "date-fns"
import { twMerge } from "tailwind-merge"

import type { MonthlyAggregate, Transaction } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

export const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)

export const monthKey = (date: Date) => format(date, "yyyy-MM")

export const groupByMonth = (
  transactions: Transaction[],
  months = 6
): MonthlyAggregate[] => {
  const monthStarts = Array.from({ length: months }, (_, index) =>
    startOfMonth(subMonths(new Date(), months - 1 - index))
  )

  return monthStarts.map((monthStart) => {
    const key = monthKey(monthStart)
    const monthTransactions = transactions.filter(
      (transaction) => monthKey(parseISO(transaction.date)) === key
    )
    const income = monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expense = monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    return {
      key,
      label: format(monthStart, "MMM"),
      income,
      expense,
      balance: income - expense,
    }
  })
}

export const categoryPalette: Record<string, string> = {
  "Food & Dining": "#fb7185",
  Transport: "#38bdf8",
  Shopping: "#a78bfa",
  Entertainment: "#f59e0b",
  Health: "#2dd4bf",
  Utilities: "#60a5fa",
  Salary: "#22c55e",
  Freelance: "#34d399",
  Investments: "#818cf8",
  Other: "#94a3b8",
}
