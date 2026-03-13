import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus, Edit, Trash2, X, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../features/users/userSlice";
import type { AppDispatch, RootState } from "../../app/store";
import { DEFAULT_PERMISSIONS, EMPTY_USER_FILTERS, User } from "../../types";
import UserForm from "../../components/admin/UserForm";
import LoadingScreen from "../../components/ui/LoadingScreen";
import Swal from "sweetalert2";
import { memo } from "react";
import Pagination from "../../components/Pagination";
import FilterModal from "../../components/FilterModal";

const UserRow = memo(
  ({
    user,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
  }: {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    canEdit: boolean;
    canDelete: boolean;
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
            onClick={() => canEdit && onEdit(user)}
            disabled={!canEdit}
            className={
              canEdit
                ? "text-indigo-600 hover:text-indigo-900"
                : "text-indigo-300 cursor-not-allowed"
            }
            aria-label="Edit user"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => canDelete && onDelete(user)}
            disabled={!canDelete}
            className={
              canDelete
                ? "text-red-600 hover:text-red-900"
                : "text-red-300 cursor-not-allowed"
            }
            aria-label="Delete user"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  ),
);

UserRow.displayName = "UserRow";

const ManageUsers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users = [],
    loading,
    pagination,
  } = useSelector((state: RootState) => state.user);
  const { currentUserData } = useSelector((state: RootState) => state.auth);

  const adminPermissions = useMemo(
    () => currentUserData?.permissions || { ...DEFAULT_PERMISSIONS },
    [currentUserData?.permissions],
  );
  const adminId = currentUserData?.studentid;
  const isSuperAdmin = !!currentUserData?.isSuperAdmin;
  const canRegisterUsers = isSuperAdmin || adminPermissions.registerUsers;

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ ...EMPTY_USER_FILTERS });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchInput);
      setPage(1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Convert null filter values to undefined for the API params
  const toFetchParams = useCallback(
    () => ({
      page,
      limit,
      q: appliedSearch || undefined,
      gender: filters.gender ?? undefined,
      batch: filters.batch ?? undefined,
      participation: filters.participation ?? undefined,
      sponsorshiptype: filters.sponsorshiptype ?? undefined,
      cafeteriaaccess: filters.cafeteriaaccess ?? undefined,
      tookcourse: filters.tookcourse ?? undefined,
      departmentname: filters.departmentname ?? undefined,
      clergicalstatus: filters.clergicalstatus ?? undefined,
    }),
    [page, limit, appliedSearch, filters],
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    dispatch(fetchUsers(toFetchParams()));
  }, [dispatch, toFetchParams]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  const openModal = useCallback(
    (mode: "add" | "edit" | "delete", user: User | null = null) => {
      setModalMode(mode);
      setSelectedUser(user);
      setIsModalOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSaveUser = useCallback(
    (userData: User) => {
      if (modalMode === "add") {
        if (!canRegisterUsers) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You are not allowed to register users.",
          });
          return;
        }
        dispatch(addUser(userData)).then(() => {
          dispatch(fetchUsers(toFetchParams()));
        });
      } else if (modalMode === "edit" && selectedUser?.studentid) {
        dispatch(updateUser({ id: selectedUser.studentid, userData })).then(
          () => {
            dispatch(fetchUsers(toFetchParams()));
          },
        );
        closeModal();
      }
    },
    [
      dispatch,
      modalMode,
      selectedUser,
      closeModal,
      toFetchParams,
      canRegisterUsers,
    ],
  );

  const canEditUser = useCallback(
    (user: User) => {
      if (isSuperAdmin || adminPermissions.editAnyUser) return true;
      if (
        adminPermissions.editSpecificUsers ||
        adminPermissions.registerUsers
      ) {
        return !!adminId && user.createdBy === adminId;
      }
      return false;
    },
    [isSuperAdmin, adminPermissions, adminId],
  );

  const canDeleteUser = useCallback(
    (user: User) => {
      if (isSuperAdmin || adminPermissions.removeAnyUsers) return true;
      if (
        adminPermissions.removeSpecificUsers ||
        adminPermissions.registerUsers
      ) {
        return !!adminId && user.createdBy === adminId;
      }
      return false;
    },
    [isSuperAdmin, adminPermissions, adminId],
  );

  const handleDeleteUser = useCallback(() => {
    if (selectedUser?.studentid) {
      dispatch(deleteUser(selectedUser.studentid)).then(() => {
        dispatch(fetchUsers(toFetchParams()));
      });
    }
    closeModal();
  }, [dispatch, selectedUser, closeModal, toFetchParams]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-4 w-full mx-auto">
      {pagination && (
        <div className="mb-4 w-full">
          {pagination.totalUsers}{" "}
          <span className="text-liturgical-blue">users found</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("admin.users.title")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          <button
            onClick={() => canRegisterUsers && openModal("add")}
            disabled={!canRegisterUsers}
            className={`inline-flex items-center justify-center px-4 py-2 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto ${
              canRegisterUsers
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-300 cursor-not-allowed"
            }`}
          >
            <Plus size={18} className="mr-2" />
            {t("admin.users.add")}
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      {Object.values(filters).some((v) => v !== null) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Active Filters:
            </span>
            <button
              onClick={() => setFilters({ ...EMPTY_USER_FILTERS })}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.gender && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Gender: {filters.gender}
              </span>
            )}
            {filters.batch && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Batch: {filters.batch}
              </span>
            )}
            {filters.departmentname && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Dept: {filters.departmentname}
              </span>
            )}
            {filters.clergicalstatus && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Clergy: {filters.clergicalstatus}
              </span>
            )}
            {filters.sponsorshiptype && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Sponsor: {filters.sponsorshiptype}
              </span>
            )}
            {filters.cafeteriaaccess !== null && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Cafe: {filters.cafeteriaaccess ? "Yes" : "No"}
              </span>
            )}
            {filters.tookcourse !== null && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Course: {filters.tookcourse ? "Yes" : "No"}
              </span>
            )}
            {filters.participation && (
              <span className="px-2 py-1 bg-white text-xs rounded border">
                Participation: {filters.participation.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
          placeholder={t("admin.users.search")}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setAppliedSearch(searchInput);
              setPage(1);
            }
          }}
        />
        {searchInput && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchInput("");
              setAppliedSearch("");
              setPage(1);
            }}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mb-3 text-xs text-gray-500">
        Search applies after half a seconds, or press Enter to search now.
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
            {users.map((user: User) => (
              <UserRow
                key={user.userid}
                user={user}
                onEdit={(u) => canEditUser(u) && openModal("edit", u)}
                onDelete={(u) => canDeleteUser(u) && openModal("delete", u)}
                canEdit={canEditUser(user)}
                canDelete={canDeleteUser(user)}
              />
            ))}
            {users.length === 0 && (
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

      {/* pagination controls */}
      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPage={(p) => setPage(p)}
            isLoading={loading}
            limit={limit}
            onLimitChange={(n) => {
              setLimit(n);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(ManageUsers);
