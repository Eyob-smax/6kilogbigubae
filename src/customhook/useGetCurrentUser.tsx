
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { useLocation } from "react-router-dom";

export default function useGetCurrentUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, status, loading, hasInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();

  useEffect(() => {
    // Only fetch current user if not on login page
    if (
      !hasInitialized &&
      status === "idle" &&
      location.pathname !== "/admin/login"
    ) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, hasInitialized, status, location.pathname]);

  return {
    hasInitialized,
    loading: !hasInitialized || loading || status === "idle",
    isAuthenticated,
    status,
  };
}
