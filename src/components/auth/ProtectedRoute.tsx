import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const SKIP_PROTECTION = true;

  // if (!isAuthenticated && !SKIP_PROTECTION) {
  //   return <Navigate to="/admin/login" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
