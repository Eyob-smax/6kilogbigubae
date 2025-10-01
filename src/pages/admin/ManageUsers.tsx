import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  resetError,
} from "../../features/users/userSlice";
import { User } from "../../types";
import UserForm from "../../components/admin/UserForm";
import type { AppDispatch, RootState } from "../../app/store";
import LoadingScreen from "../../components/ui/LoadingScreen";
import Swal from "sweetalert2";
import { memo } from "react";
let isFirstRender = true;
const UserRow = memo(
  ({
    user,
    onEdit,
    onDelete,
  }: {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
  }) => (
    <tr key={user.userid} className="hover:bg-gray-50 text-sm">
      <td className="px-3 sm:px-6 py-4">{user.studentid}</td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        {user.firstname} {user.lastname}
      </td>
      <td className="px-3 sm:px-6 py-4 hidden md:table-cell">{user.phone}</td>
      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell truncate max-w-[120px]">
        {user.universityusers?.departmentname}
      </td>
      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-2xl text-xs sm:text-sm">
          {user.universityusers?.batch}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4">
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(user)}
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Edit user"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="text-red-600 hover:text-red-900"
            aria-label="Delete user"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
);

UserRow.displayName = "UserRow";

const ManageUsers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      dispatch(fetchUsers());
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error,
      }).then(() => dispatch(resetError()));
    }
  }, [error, dispatch]);

  const filteredUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return users.filter((user: User) =>
      [
        user.studentid,
        user.firstname,
        user.lastname,
        user.baptismalname,
        user.universityusers?.departmentname,
        user.universityusers?.participation,
        user.universityusers?.batch,
        user.region,
        user.phone,
        user.useremail,
        user.telegram_username,
        user.gender,
        user.universityusers?.activitylevel,
        user.clergicalstatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(lowerTerm)
    );
  }, [users, searchTerm]);

  const openModal = useCallback(
    (mode: "add" | "edit" | "delete", user: User | null = null) => {
      setModalMode(mode);
      setSelectedUser(user);
      setIsModalOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSaveUser = useCallback(
    (userData: User) => {
      if (modalMode === "add") {
        dispatch(addUser(userData));
      } else if (modalMode === "edit" && selectedUser?.studentid) {
        dispatch(updateUser({ id: selectedUser.studentid, userData }));
        closeModal();
      }
    },
    [dispatch, modalMode, selectedUser, closeModal]
  );

  const handleDeleteUser = useCallback(() => {
    if (selectedUser?.studentid) {
      dispatch(deleteUser(selectedUser.studentid));
    }
    closeModal();
  }, [dispatch, selectedUser, closeModal]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-4 w-full mx-auto">
      {users.length > 1 && (
        <div className="mb-4 w-full ">
          {filteredUsers.length}{" "}
          <span className="text-liturgical-blue">users found</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("admin.users.title")}
        </h2>
        <button
          onClick={() => openModal("add")}
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto"
        >
          <Plus size={18} className="mr-2" />
          {t("admin.users.add")}
        </button>
      </div>

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
          placeholder={t("admin.users.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base text-left">
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-3 sm:px-6 py-3">Name</th>
              <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Phone</th>
              <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">
                Department
              </th>
              <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">batch</th>
              <th className="px-3 sm:px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user: User) => (
              <UserRow
                key={user.userid}
                user={user}
                onEdit={(u) => openModal("edit", u)}
                onDelete={(u) => openModal("delete", u)}
              />
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 sm:px-6 py-4 text-center text-gray-500"
                >
                  {t("admin.users.no_users")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-auto max-h-[90vh] overflow-y-auto transform transition-all duration-300 sm:rounded-lg sm:max-w-2xl">
            {modalMode === "delete" ? (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">{t("forms.confirm")}</h3>
                <p className="text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong>{selectedUser?.firstname}</strong>?
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                  >
                    {t("forms.no")}
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
                  >
                    {t("forms.yes")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <UserForm
                  mode={modalMode}
                  initialData={selectedUser}
                  onCancel={closeModal}
                  onSubmit={handleSaveUser}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ManageUsers);
