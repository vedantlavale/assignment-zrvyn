import { compareDesc, compareAsc, isAfter, isBefore, parseISO } from "date-fns"

import { useTransactionContext } from "@/context/TransactionContext"

export function useTransactions() {
  const { transactions, filters, dispatch } = useTransactionContext()

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      const matchesType =
        filters.type === "all" || transaction.type === filters.type
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(transaction.category)

      const transactionDate = parseISO(transaction.date)
      const matchesFrom = filters.dateFrom
        ? !isBefore(transactionDate, parseISO(filters.dateFrom))
        : true
      const matchesTo = filters.dateTo
        ? !isAfter(transactionDate, parseISO(filters.dateTo))
        : true

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesFrom &&
        matchesTo
      )
    })
    .sort((left, right) => {
      if (filters.sortBy === "amount") {
        const diff = left.amount - right.amount
        return filters.sortOrder === "asc" ? diff : -diff
      }

      const result =
        filters.sortOrder === "asc"
          ? compareAsc(parseISO(left.date), parseISO(right.date))
          : compareDesc(parseISO(left.date), parseISO(right.date))
      return result
    })

  return {
    transactions,
    filters,
    filteredTransactions,
    dispatch,
  }
}
