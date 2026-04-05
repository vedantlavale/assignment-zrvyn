import { useAppContext } from "@/context/AppContext"

export const useRole = () => {
  const { role } = useAppContext()

  return {
    role,
    isAdmin: role === "admin",
    isViewer: role === "viewer",
  }
}
