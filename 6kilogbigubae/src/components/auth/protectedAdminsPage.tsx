import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../ui/LoadingScreen";

export default function ProtectedAdminsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUserData, hasInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const isAuthorized = !!currentUserData?.isSuperAdmin;

  if (!hasInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
