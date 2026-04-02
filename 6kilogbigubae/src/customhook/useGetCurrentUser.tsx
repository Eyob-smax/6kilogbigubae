import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { clearAuthState, fetchCurrentUser } from "../features/auth/authSlice";

export default function useGetCurrentUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, status, loading, hasInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const pathname = window.location.pathname;

  useEffect(() => {
    if (hasInitialized || status !== "idle") {
      return;
    }

    if (pathname === "/admin/login") {
      dispatch(clearAuthState());
      return;
    }

    dispatch(fetchCurrentUser());
  }, [dispatch, hasInitialized, pathname, status]);

  return {
    hasInitialized,
    loading: !hasInitialized || loading || status === "idle",
    isAuthenticated,
    status,
  };
}
