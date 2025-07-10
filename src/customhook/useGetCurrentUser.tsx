import { useEffect, useState } from "react";
import { setCurrentUser } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { api } from "../api/api";

export default function useGetCurrentUser() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/current");
        if (response?.data?.success && response?.data?.user?.isAuthenticated) {
          setIsAuthenticated(true);
          dispatch(
            setCurrentUser({
              studentid: response?.data?.user?.studentid,
              username: response?.data?.user?.adminusername,
              isSuperAdmin: response?.data?.user?.isSuperAdmin,
            })
          );
        } else {
          setIsAuthenticated(false);
          await Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You are not authorized.",
          });
        }
      } catch (error) {
        const { message } = error as { message: string };
        setIsAuthenticated(false);
        await Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: message,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading || isAuthenticated === null) {
    console.log("Loading authentication status...");
    return { loading: true, isAuthenticated: false };
  }
  return { loading: false, isAuthenticated };
}
