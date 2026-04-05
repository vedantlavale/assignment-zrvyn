import { BarChart3, LayoutDashboard, Table2, UserRound } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppContext } from "@/context/AppContext"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Table2 },
  { to: "/insights", label: "Insights", icon: BarChart3 },
]

export function Sidebar() {
  const { role, dispatch } = useAppContext()

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar md:flex md:w-16 md:flex-col lg:w-64">
        <div className="border-b border-sidebar-border px-4 py-5 lg:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BarChart3 className="size-4.5" />
            </div>
            <div className="hidden lg:block">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Zorvyn
              </p>
              <h2 className="font-semibold tracking-tight">Personal finance</h2>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors md:justify-center lg:justify-start",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border px-3 py-4">
          <div className="hidden px-1 lg:block">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Access
            </p>
          </div>
          <Select
            value={role}
            onValueChange={(value) =>
              dispatch({ type: "SET_ROLE", payload: value as "viewer" | "admin" })
            }
          >
            <SelectTrigger className="h-11 bg-background">
              <div className="flex items-center gap-2">
                <UserRound className="size-4" />
                <span className="hidden lg:inline">Role</span>
              </div>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </aside>

      <nav className="fixed right-4 bottom-4 left-4 z-40 rounded-lg border border-border bg-card p-2 shadow-lg md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
