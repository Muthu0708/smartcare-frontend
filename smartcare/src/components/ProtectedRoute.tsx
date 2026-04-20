import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: ReactNode;
  role?: string;
}) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role?.toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};