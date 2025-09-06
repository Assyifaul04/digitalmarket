import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const message = title && description ? `${title}: ${description}` : title || description

    switch (variant) {
      case "destructive":
        return sonnerToast.error(message)
      case "success":
        return sonnerToast.success(message)
      default:
        return sonnerToast(message)
    }
  }

  return { toast }
}