import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Swal from "sweetalert2";

export default function ProtectedAdminsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUserData } = useSelector((state: RootState) => state.auth);
  if (!currentUserData?.isSuperAdmin) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to view this page.",
    }).then(() => {
      window.location.href = "/admin/login";
    });
  }

  return children;
}
