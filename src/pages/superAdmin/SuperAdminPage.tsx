import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Admin, Permissions, DEFAULT_PERMISSIONS } from "../../types";
import AdminCard from "../../components/superadmin/AdminCard";
import AdminModal from "../../components/superadmin/AdminModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../features/admins/adminsSlice";
import type { AppDispatch, RootState } from "../../app/store";
import LoadingScreen from "../../components/ui/LoadingScreen";

const ManageAdmins: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();

  const { admins = [], loading } = useSelector(
    (state: RootState) => state.admin,
  );
  const { currentUserData } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const filteredAdmins = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Array.isArray(admins)
      ? admins.filter(
          (admin: Admin) =>
            admin?.studentid?.toLowerCase()?.includes(term) ||
            admin?.adminusername?.toLowerCase()?.includes(term),
        )
      : [];
  }, [admins, searchTerm]);

  const openAddModal = useCallback(() => {
    setSelectedAdmin(null);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((admin: Admin) => {
    if (admin.isSuperAdmin) return;
    setSelectedAdmin(admin);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((admin: Admin) => {
    if (admin.isSuperAdmin) return;
    setSelectedAdmin(admin);
    setModalMode("delete");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  }, []);

  const handleSaveAdmin = useCallback(
    (adminData: Partial<Admin>) => {
      if (modalMode === "add") {
        const payload: Partial<Admin> = {
          ...adminData,
          studentid: adminData.studentid?.trim(),
          adminusername: adminData.adminusername?.trim(),
        };

        if (payload.adminpassword) {
          payload.adminpassword = payload.adminpassword.trim();
        }

        dispatch(addAdmin(payload));
      } else if (modalMode === "edit" && selectedAdmin?.studentid) {
        const payload = { ...adminData };
        if (payload.studentid) {
          payload.studentid = payload.studentid.trim();
        }
        if (payload.adminusername) {
          payload.adminusername = payload.adminusername.trim();
        }

        const normalizedPassword = payload.adminpassword?.trim();
        if (!normalizedPassword) {
          delete payload.adminpassword;
        } else {
          payload.adminpassword = normalizedPassword;
        }

        dispatch(
          updateAdmin({ id: selectedAdmin.studentid, adminData: payload }),
        );
      }
      closeModal();
    },
    [dispatch, modalMode, selectedAdmin, closeModal],
  );

  const handleDeleteAdmin = useCallback(() => {
    if (selectedAdmin?.studentid) {
      dispatch(deleteAdmin(selectedAdmin.studentid));
    }
    closeModal();
  }, [dispatch, selectedAdmin, closeModal]);

  const handleSavePermissions = useCallback(
    (admin: Admin, permissions: Permissions) => {
      if (admin.isSuperAdmin) return;
      dispatch(
        updateAdmin({
          id: admin.studentid,
          adminData: {
            permissions: {
              ...DEFAULT_PERMISSIONS,
              ...(permissions ?? {}),
            },
          },
        }),
      );
    },
    [dispatch],
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen  px-4 sm:px-10 py-10 pb-16 font-inter ">
      <div className="max-w-6xl mx-auto">
        {/* === Page Header === */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-extrabold tracking-tight gradient-title">
              Welcome, Super Admin
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              {`Student ID: ${currentUserData?.studentid ?? ""}`}
            </p>
          </div>

          <button
            id="add-admin-btn"
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
            <span>Add Admin</span>
          </button>
        </header>

        {/* === Admin List === */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium">
              {filteredAdmins.length === 0
                ? "No admins yet"
                : `Showing ${filteredAdmins.length} admin${filteredAdmins.length !== 1 ? "s" : ""}`}
            </span>
            {admins.length > 0 && (
              <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                {admins.length} total
              </span>
            )}
          </div>

          <div className="mb-5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student ID or username"
              className="w-full sm:max-w-sm px-3.5 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
            />
          </div>

          {filteredAdmins.length === 0 ? (
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-sm">No admins have been added yet.</p>
              <p className="text-xs">
                Click <strong className="text-slate-500">Add Admin</strong> to
                get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3" role="list">
              {filteredAdmins.map((admin, i) => (
                <AdminCard
                  key={admin.userid || admin.studentid || i}
                  admin={admin}
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
            <>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Confirm</h3>
              <p className="mb-6">
                You are about to delete{" "}
                <strong>{selectedAdmin?.adminusername}</strong>?
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                >
                  No
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
                >
                  Yes
                </button>
              </div>
            </>
          </div>
        </div>
      )}

      {isModalOpen && modalMode !== "delete" && (
        <AdminModal
          mode={modalMode}
          initialData={selectedAdmin}
          onSave={handleSaveAdmin}
          onCancel={closeModal}
        />
      )}
    </div>
  );
});

export default ManageAdmins;
