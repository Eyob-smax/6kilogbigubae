import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import useGetCurrentUser from "../../customhook/useGetCurrentUser";
import LoadingScreen from "../ui/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useGetCurrentUser();

  if (loading || isAuthenticated === null) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
