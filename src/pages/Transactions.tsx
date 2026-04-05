import { useEffect, useState } from "react"

import { PageShell } from "@/components/layout/PageShell"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { TransactionModal } from "@/components/transactions/TransactionModal"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { Skeleton } from "@/components/ui/skeleton"
import { useRole } from "@/hooks/useRole"
import type { Transaction } from "@/types"

export function Transactions() {
  const { isAdmin } = useRole()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setOpen(true)
  }

  return (
    <PageShell
      title="Transactions"
      description="Filter, review, and manage ledger entries across the last six months."
    >
      <div className="space-y-4">
        <TransactionFilters />
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-[420px]" />
          </div>
        ) : (
          <TransactionTable onEdit={handleEdit} />
        )}
      </div>

      {isAdmin ? (
        <TransactionModal
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen)
            if (!nextOpen) {
              setEditingTransaction(null)
            }
          }}
          editingTransaction={editingTransaction}
        />
      ) : null}
    </PageShell>
  )
}
