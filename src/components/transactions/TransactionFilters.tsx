import { Filter, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultFilters } from "@/context/TransactionContext"
import { useTransactions } from "@/hooks/useTransactions"
import { categories } from "@/types"

export function TransactionFilters() {
  const { filters, dispatch } = useTransactions()

  const toggleCategory = (category: (typeof categories)[number]) => {
    const categoriesValue = filters.categories.includes(category)
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category]

    dispatch({ type: "SET_FILTER", payload: { categories: categoriesValue } })
  }

  return (
    <div className="sticky top-14 z-20 rounded-2xl border border-border/70 bg-background/90 p-4 shadow-sm backdrop-blur">
      <div className="grid gap-3 xl:grid-cols-[1.25fr_auto_auto_auto_auto_auto]">
        <Input
          placeholder="Search descriptions"
          value={filters.search}
          onChange={(event) =>
            dispatch({ type: "SET_FILTER", payload: { search: event.target.value } })
          }
        />

        <Tabs
          value={filters.type}
          onValueChange={(value) =>
            dispatch({
              type: "SET_FILTER",
              payload: { type: value as "all" | "income" | "expense" },
            })
          }
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 rounded-xl">
              <Filter className="size-4" />
              Categories
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="mb-3">
              <p className="font-medium">Filter categories</p>
              <p className="text-sm text-muted-foreground">
                Select one or more categories
              </p>
            </div>
            <div className="grid gap-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) =>
            dispatch({ type: "SET_FILTER", payload: { dateFrom: event.target.value } })
          }
        />

        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) =>
            dispatch({ type: "SET_FILTER", payload: { dateTo: event.target.value } })
          }
        />

        <div className="flex gap-2">
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split("-")
              dispatch({
                type: "SET_FILTER",
                payload: {
                  sortBy: sortBy as "date" | "amount",
                  sortOrder: sortOrder as "asc" | "desc",
                },
              })
            }}
          >
            <SelectTrigger className="min-w-40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date ↓</SelectItem>
              <SelectItem value="date-asc">Date ↑</SelectItem>
              <SelectItem value="amount-desc">Amount ↓</SelectItem>
              <SelectItem value="amount-asc">Amount ↑</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-10 rounded-xl"
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            disabled={JSON.stringify(filters) === JSON.stringify(defaultFilters)}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
