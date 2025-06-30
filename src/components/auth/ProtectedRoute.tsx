// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { api } from "../../api/api";
import LoadingScreen from "../ui/LoadingScreen";
import Swal from "sweetalert2";
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/current");
        if (response.data.success && response.data.user?.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        const { message } = error as { message: string };
        console.error("Authentication check failed:", message);
        setIsAuthenticated(false);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (error) {
    return Swal.fire({
      icon: "error",
      title: "Authentication Error",
      text: error,
    });
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
