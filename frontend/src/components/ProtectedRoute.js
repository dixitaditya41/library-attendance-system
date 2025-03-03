import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authToken = localStorage.getItem("authToken");
  const adminStatus = localStorage.getItem("isAdmin") === "true";

  if (!authToken || !adminStatus) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
