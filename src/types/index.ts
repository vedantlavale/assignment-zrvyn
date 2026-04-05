export const categories = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Salary",
  "Freelance",
  "Investments",
  "Other",
] as const

export type Category = (typeof categories)[number]

export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionType
  category: Category
  note?: string
}

export type Role = "viewer" | "admin"

export type SortField = "date" | "amount"
export type SortOrder = "asc" | "desc"

export interface Filters {
  search: string
  type: "all" | TransactionType
  categories: Category[]
  dateFrom: string
  dateTo: string
  sortBy: SortField
  sortOrder: SortOrder
}

export interface MonthlyAggregate {
  key: string
  label: string
  income: number
  expense: number
  balance: number
}
