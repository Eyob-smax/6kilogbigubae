import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedAdminsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUserData } = useSelector((state: RootState) => state.auth);
  const isLoaded = currentUserData !== null;
  const isAuthorized = !!currentUserData?.isSuperAdmin;

  useEffect(() => {
    if (isLoaded && !isAuthorized) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to view this page.",
      });
    }
  }, [isLoaded, isAuthorized]);

  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
