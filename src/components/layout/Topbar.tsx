import { Bell, ChevronRight, Moon, Search, Sun } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { useTheme } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"

const labels: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
}

export function Topbar() {
  const location = useLocation()
  const currentLabel = labels[location.pathname] || "Dashboard"
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  // Determine if currently in dark mode (for icon display)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-3 px-5">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <span className="text-xs font-medium uppercase tracking-wider">Personal</span>
          <ChevronRight className="size-3.5" />
          <Link
            to="/"
            className="border-b border-primary pb-0.5 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            {currentLabel}
          </Link>
        </div>
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="h-9 pl-9 text-sm" />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode (D)"}
          className="flex size-9 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>

        <button className="flex size-9 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="size-3.5" />
        </button>
        <div className="flex items-center gap-2.5 border border-border bg-background px-2.5 py-1.5">
          <div className="flex size-7 items-center justify-center bg-primary/10 text-[11px] font-bold text-primary">
            VL
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight">Vedant</p>
            <p className="text-[10px] text-muted-foreground">@vedant</p>
          </div>
        </div>
      </div>
    </header>
  )
}
