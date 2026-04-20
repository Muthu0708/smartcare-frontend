import { Navigate } from "react-router-dom";

export const DoctorRoute = ({ children }: any) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "Doctor") {
    return <Navigate to="/" />;
  }

  return children;
};