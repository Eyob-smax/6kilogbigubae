import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import {
  addRole,
  deleteRole,
  fetchRoles,
  updateRole,
} from "../../features/roles/rolesSlice";
import RoleCard from "../../components/superadmin/RoleCard";
import RoleModal from "../../components/superadmin/RoleModal";
import LoadingScreen from "../../components/ui/LoadingScreen";
import { DEFAULT_PERMISSIONS, Role } from "../../types";

export default function ManageRoles() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    roles = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.roles);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const sortedRoles = useMemo(() => {
    return [...roles].sort((a, b) => a.name.localeCompare(b.name));
  }, [roles]);

  const closeModal = useCallback(() => {
    setSelectedRole(null);
    setIsModalOpen(false);
  }, []);

  const openAddModal = useCallback(() => {
    setSelectedRole(null);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((role: Role) => {
    setSelectedRole(role);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((role: Role) => {
    setSelectedRole(role);
    setModalMode("delete");
    setIsModalOpen(true);
  }, []);

  const handleSaveRole = useCallback(
    (roleData: Partial<Role>) => {
      const payload: Partial<Role> = {
        ...DEFAULT_PERMISSIONS,
        ...roleData,
        name: roleData.name?.trim(),
      };

      if (modalMode === "add") {
        dispatch(addRole(payload));
      } else if (modalMode === "edit" && selectedRole?.id) {
        dispatch(updateRole({ id: selectedRole.id, roleData: payload }));
      }

      closeModal();
    },
    [dispatch, modalMode, selectedRole, closeModal],
  );

  const handleDeleteRole = useCallback(() => {
    if (selectedRole?.id) {
      dispatch(deleteRole(selectedRole.id));
    }
    closeModal();
  }, [dispatch, selectedRole, closeModal]);

  const handleSavePermissions = useCallback(
    (role: Role, permissions: Partial<Role>) => {
      if (!role.id) {
        return;
      }

      dispatch(
        updateRole({
          id: role.id,
          roleData: {
            ...DEFAULT_PERMISSIONS,
            ...permissions,
          },
        }),
      );
    },
    [dispatch],
  );

  if (loading && roles.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen px-4 sm:px-10 py-10 pb-16 font-inter">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-extrabold tracking-tight gradient-title">
              Roles Management
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Create and maintain roles with precise permission sets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/superadmin")}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 transition-all duration-200 whitespace-nowrap"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Back</span>
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all duration-200 whitespace-nowrap"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Role</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium">
              {sortedRoles.length === 0
                ? "No roles yet"
                : `Showing ${sortedRoles.length} role${sortedRoles.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {sortedRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6c63ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21V7a2 2 0 0 0-2-2h-4" />
                  <path d="M14 21V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
                  <path d="M3 21h18" />
                </svg>
              </div>
              <p className="text-sm">No roles have been added yet.</p>
              <p className="text-xs">
                Click <strong className="text-slate-500">Add Role</strong> to
                get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" role="list">
              {sortedRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onSavePermissions={handleSavePermissions}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && modalMode === "delete" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto transform transition-all duration-300 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Confirm</h3>
            <p className="mb-6">
              You are about to delete <strong>{selectedRole?.name}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                No
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && modalMode !== "delete" && (
        <RoleModal
          mode={modalMode}
          initialData={selectedRole}
          onSave={handleSaveRole}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
