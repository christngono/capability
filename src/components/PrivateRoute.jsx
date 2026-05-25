import { Navigate } from "react-router-dom"

export default function PrivateRoute({ children }) {
  if (sessionStorage.getItem("admin_auth") !== "true") {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
