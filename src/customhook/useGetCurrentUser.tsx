import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchCurrentUser } from "../features/auth/authSlice";

export default function useGetCurrentUser() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, status, loading, hasInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!hasInitialized && status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, hasInitialized, status]);

  return {
    hasInitialized,
    loading: !hasInitialized || loading || status === "idle",
    isAuthenticated,
    status,
  };
}
