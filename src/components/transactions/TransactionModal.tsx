import { LoaderCircle, Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useTransactions } from "@/hooks/useTransactions"
import { categories, type Category, type Transaction, type TransactionType } from "@/types"

type FormState = {
  description: string
  amount: string
  type: TransactionType
  category: Category
  date: string
  note: string
}

const emptyState: FormState = {
  description: "",
  amount: "",
  type: "expense",
  category: "Food & Dining",
  date: new Date().toISOString().slice(0, 10),
  note: "",
}

export function TransactionModal({
  editingTransaction,
  open,
  onOpenChange,
}: {
  editingTransaction?: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { dispatch } = useTransactions()
  const { toast } = useToast()
  const [form, setForm] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date,
        note: editingTransaction.note || "",
      })
      return
    }

    setForm(emptyState)
  }, [editingTransaction, open])

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (form.description.trim().length < 2) {
      nextErrors.description = "Description must be at least 2 characters."
    }

    if (!form.amount || Number(form.amount) <= 0) {
      nextErrors.amount = "Amount must be greater than 0."
    }

    if (!form.date) {
      nextErrors.date = "Date is required."
    } else if (form.date > new Date().toISOString().slice(0, 10)) {
      nextErrors.date = "Future dates are not allowed."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 500))

    const transaction: Transaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim() || undefined,
    }

    dispatch({
      type: editingTransaction ? "EDIT_TRANSACTION" : "ADD_TRANSACTION",
      payload: transaction,
    })
    toast({
      title: editingTransaction ? "Transaction updated" : "Transaction added",
      description: editingTransaction
        ? "Your changes have been saved."
        : "The new transaction is now in the ledger.",
    })
    setSaving(false)
    onOpenChange(false)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!editingTransaction ? (
        <DialogTrigger asChild>
          <Button className="fixed right-6 bottom-24 z-30 size-14 rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/30 md:bottom-6">
            <Plus className="size-5" />
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            Fill in the transaction details. Amounts stay positive; type controls
            the sign.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
            />
            {errors.description ? (
              <p className="text-sm text-expense">{errors.description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                min="1"
                value={form.amount}
                onChange={(event) => setField("amount", event.target.value)}
              />
              {errors.amount ? (
                <p className="text-sm text-expense">{errors.amount}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setField("date", event.target.value)}
              />
              {errors.date ? (
                <p className="text-sm text-expense">{errors.date}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <RadioGroup
              className="flex gap-6"
              value={form.type}
              onValueChange={(value) => setField("type", value as TransactionType)}
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="income" />
                Income
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="expense" />
                Expense
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={form.category}
              onValueChange={(value) => setField("category", value as Category)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) =>
                    form.type === "income"
                      ? ["Salary", "Freelance", "Investments", "Other"].includes(category)
                      : !["Salary", "Freelance", "Investments"].includes(category)
                  )
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>
            <Textarea
              value={form.note}
              onChange={(event) => setField("note", event.target.value)}
              placeholder="Optional context"
            />
          </div>

          <Button type="submit" className="h-11 w-full rounded-xl" disabled={saving}>
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {saving ? "Saving..." : editingTransaction ? "Save changes" : "Add transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
