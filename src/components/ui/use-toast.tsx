import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type ToastItem = {
  id: string
  title: string
  description?: string
}

const ToastContext = createContext<{
  items: ToastItem[]
  toast: (item: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
} | null>(null)

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID()
      setItems((current) => [...current, { ...item, id }])
      window.setTimeout(() => dismiss(id), 3000)
    },
    [dismiss]
  )

  const value = useMemo(
    () => ({
      items,
      toast,
      dismiss,
    }),
    [dismiss, items, toast]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastContextProvider")
  }

  return context
}
