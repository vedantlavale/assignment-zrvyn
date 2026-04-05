import * as ToastPrimitives from "@radix-ui/react-toast"
import { CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider
const ToastViewport = ToastPrimitives.Viewport

function Toast({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Root>) {
  return (
    <ToastPrimitives.Root
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    >
      <CheckCircle2 className="mt-0.5 size-5 text-income" />
      <div className="grid gap-1">{children}</div>
    </ToastPrimitives.Root>
  )
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Title>) {
  return <ToastPrimitives.Title className={cn("text-sm font-medium", className)} {...props} />
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Description>) {
  return (
    <ToastPrimitives.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport }
