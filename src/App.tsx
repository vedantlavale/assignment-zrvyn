import { AnimatePresence, motion } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom"

import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { Dashboard } from "@/pages/Dashboard"
import { Insights } from "@/pages/Insights"
import { Transactions } from "@/pages/Transactions"

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Sidebar />
      <div className="pb-20 md:ml-16 md:pb-0 lg:ml-60">
        <Topbar />
        <AppRoutes />
      </div>
    </div>
  )
}

export default App
