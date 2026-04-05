import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"

import type { Role } from "@/types"

type ThemeMode = "light"

interface AppState {
  role: Role
  theme: ThemeMode
}

type AppAction =
  | { type: "SET_ROLE"; payload: Role }
  | { type: "SET_THEME"; payload: ThemeMode }

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>
}

const ROLE_KEY = "fdb_role"
const THEME_KEY = "fdb_theme"

const getInitialState = (): AppState => ({
  role: (localStorage.getItem(ROLE_KEY) as Role) || "viewer",
  theme: "light",
})

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload }
    case "SET_THEME":
      return { ...state, theme: "light" }
    default:
      return state
  }
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState)

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, state.role)
    localStorage.setItem(THEME_KEY, "light")
    document.documentElement.classList.remove("dark")
    document.documentElement.style.colorScheme = "light"
  }, [state.role, state.theme])

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }

  return context
}
