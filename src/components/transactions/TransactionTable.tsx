import { format, parseISO } from "date-fns"
import { Pencil, SearchX, Trash2 } from "lucide-react"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useRole } from "@/hooks/useRole"
import { useTransactions } from "@/hooks/useTransactions"
import { categoryPalette, cn, formatCurrency } from "@/lib/utils"
import type { Transaction } from "@/types"

export function TransactionTable({
  onEdit,
}: {
  onEdit: (transaction: Transaction) => void
}) {
  const { filteredTransactions, dispatch } = useTransactions()
  const { isAdmin } = useRole()
  const { toast } = useToast()
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const handleDelete = () => {
    if (!pendingDelete) {
      return
    }

    dispatch({ type: "DELETE_TRANSACTION", payload: pendingDelete })
    toast({ title: "Transaction deleted", description: "The record was removed." })
    setPendingDelete(null)
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium">No transactions match your filters.</p>
            <p className="text-xs text-muted-foreground">
              Adjust the filter bar or clear filters to see all activity.
            </p>
          </div>
          <Button variant="link" onClick={() => dispatch({ type: "RESET_FILTERS" })}>
            Clear filters
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  {isAdmin ? <TableHead className="text-right">Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {format(parseISO(transaction.date), "d MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-64 truncate font-medium">
                        {transaction.description}
                      </div>
                      {transaction.note ? (
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {transaction.note}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="border-transparent"
                        style={{
                          backgroundColor: `${categoryPalette[transaction.category]}18`,
                          color: categoryPalette[transaction.category],
                        }}
                      >
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-transparent",
                          transaction.type === "income"
                            ? "bg-income/10 text-income"
                            : "bg-expense/10 text-expense"
                        )}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono tabular-nums",
                        transaction.type === "income" ? "text-income" : "text-expense"
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    {isAdmin ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => onEdit(transaction)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="text-expense"
                                onClick={() => setPendingDelete(transaction.id)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The transaction will be
                                  removed from your local dashboard data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setPendingDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:hidden">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {format(parseISO(transaction.date), "d MMM yyyy")}
                  </p>
                </div>
                <p
                  className={cn(
                    "font-mono text-sm tabular-nums",
                    transaction.type === "income" ? "text-income" : "text-expense"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  className="border-transparent"
                  style={{
                    backgroundColor: `${categoryPalette[transaction.category]}18`,
                    color: categoryPalette[transaction.category],
                  }}
                >
                  {transaction.category}
                </Badge>
                <Badge
                  className={cn(
                    "border-transparent",
                    transaction.type === "income"
                      ? "bg-income/10 text-income"
                      : "bg-expense/10 text-expense"
                  )}
                >
                  {transaction.type}
                </Badge>
              </div>
              {transaction.note ? (
                <p className="text-xs text-muted-foreground">{transaction.note}</p>
              ) : null}
              {isAdmin ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-expense"
                    onClick={() => {
                      dispatch({ type: "DELETE_TRANSACTION", payload: transaction.id })
                      toast({
                        title: "Transaction deleted",
                        description: "The record was removed.",
                      })
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
