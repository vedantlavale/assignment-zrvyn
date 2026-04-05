import { Bell, ChevronRight, MessageCircle, Search } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Input } from "@/components/ui/input"

const labels: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
}

export function Topbar() {
  const location = useLocation()
  const currentLabel = labels[location.pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="px-4 pt-4 sm:px-6">
        <div className="flex h-16 items-center gap-3 rounded-lg border border-border bg-card px-4">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <div className="rounded-md border border-border bg-muted px-3 py-1.5 text-foreground">
              Personal account
            </div>
            <ChevronRight className="size-4" />
            <Link
              to="/"
              className="rounded-md border border-[#dce8d5] bg-[#edf4e8] px-3 py-1.5 font-medium text-primary"
            >
              {currentLabel}
            </Link>
          </div>
          <div className="relative ml-auto hidden w-full max-w-md md:block">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
          <button className="hidden h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex">
            <MessageCircle className="size-4" />
            Chat
          </button>
          <button className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="size-4" />
          </button>
          <div className="flex items-center gap-3 rounded-md border border-border bg-background px-2 py-1.5 pr-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#dbe9d5] text-sm font-semibold text-primary">
              VL
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Vedant Lavale</p>
              <p className="text-xs text-muted-foreground">@vedant</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
