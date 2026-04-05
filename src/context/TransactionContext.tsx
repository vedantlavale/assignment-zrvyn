import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"

import { mockTransactions } from "@/data/mockData"
import type { Filters, Transaction } from "@/types"

interface TransactionState {
  transactions: Transaction[]
  filters: Filters
}

type TransactionAction =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "EDIT_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<Filters> }
  | { type: "RESET_FILTERS" }
  | { type: "HYDRATE"; payload: Transaction[] }

interface TransactionContextValue extends TransactionState {
  dispatch: React.Dispatch<TransactionAction>
}

const STORAGE_KEY = "fdb_transactions"

export const defaultFilters: Filters = {
  search: "",
  type: "all",
  categories: [],
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
}

const initialState: TransactionState = {
  transactions: mockTransactions,
  filters: defaultFilters,
}

const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      }
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      }
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
      }
    case "HYDRATE":
      return {
        ...state,
        transactions: action.payload,
      }
    default:
      return state
  }
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

const getInitialTransactions = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return initialState
  }

  try {
    const parsed = JSON.parse(stored) as Transaction[]
    return {
      ...initialState,
      transactions: parsed.length > 0 ? parsed : mockTransactions,
    }
  } catch {
    return initialState
  }
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    transactionReducer,
    undefined,
    getInitialTransactions
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions))
  }, [state.transactions])

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  )

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactionContext() {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within TransactionProvider"
    )
  }

  return context
}
