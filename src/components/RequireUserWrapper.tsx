import { Navigate, Outlet } from "react-router-dom"
import { useUserAuth } from "../hooks/useUserAuth"

export const RequireUserWrapper = ({ role }: { role?: string }) => {
  const { user } = useUserAuth()
  if (!user) {
    return <Navigate to='/' />
  }
  if (role && user.role != role) {
    return <Navigate to='/' />
  }
  return <Outlet />
}