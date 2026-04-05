import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { items, dismiss } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {items.map((item) => (
        <Toast
          key={item.id}
          open
          onOpenChange={(open) => {
            if (!open) {
              dismiss(item.id)
            }
          }}
        >
          <ToastTitle>{item.title}</ToastTitle>
          {item.description ? (
            <ToastDescription>{item.description}</ToastDescription>
          ) : null}
        </Toast>
      ))}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none" />
    </ToastProvider>
  )
}
