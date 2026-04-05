import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ToastContextProvider } from "@/components/ui/use-toast"
import { AppProvider } from "@/context/AppContext"
import { TransactionProvider } from "@/context/TransactionContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="zorvyn-theme">
        <AppProvider>
          <TransactionProvider>
            <ToastContextProvider>
              <App />
              <Toaster />
            </ToastContextProvider>
          </TransactionProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
