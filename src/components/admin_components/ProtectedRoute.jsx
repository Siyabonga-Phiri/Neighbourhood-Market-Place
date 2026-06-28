import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/feed" />;
  }

  return children;
}