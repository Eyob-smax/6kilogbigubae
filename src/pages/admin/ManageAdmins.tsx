import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { Admin } from "../../types";
import AdminForm from "../../components/admin/AdminForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../features/admins/adminsSlice";
import type { AppDispatch, RootState } from "../../app/store";
import LoadingScreen from "../../components/ui/LoadingScreen";
let isFirstRender = true;

const ManageAdmins: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();

  const { admins = [], loading } = useSelector(
    (state: RootState) => state.admin
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      dispatch(fetchAdmins());
      return;
    }
  }, [dispatch, admins]);

  const filteredAdmins = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Array.isArray(admins)
      ? admins.filter(
          (admin: Admin) =>
            admin?.studentid?.toLowerCase()?.includes(term) ||
            admin?.adminusername?.toLowerCase()?.includes(term)
        )
      : [];
  }, [admins, searchTerm]);

  const openAddModal = useCallback(() => {
    setSelectedAdmin(null);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((admin: Admin) => {
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
        dispatch(addAdmin(adminData));
      } else if (modalMode === "edit" && selectedAdmin?.studentid) {
        if (adminData.adminpassword === "") {
          adminData.adminpassword = "previous one";
        }
        dispatch(updateAdmin({ id: selectedAdmin.studentid, adminData }));
      }
      closeModal();
    },
    [dispatch, modalMode, selectedAdmin, closeModal]
  );

  const handleDeleteAdmin = useCallback(() => {
    if (selectedAdmin?.studentid) {
      dispatch(deleteAdmin(selectedAdmin.studentid));
    }
    closeModal();
  }, [dispatch, selectedAdmin, closeModal]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Manage Admins</h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto"
        >
          <Plus size={18} className="mr-2" />
          Add Admin
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
          placeholder="Search Admins"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-gray-600 uppercase tracking-wider text-xs font-semibold">
                Student ID
              </th>
              <th className="px-3 sm:px-6 py-3 text-gray-600 uppercase tracking-wider text-xs font-semibold">
                Username
              </th>
              <th className="px-3 sm:px-6 py-3 hidden md:table-cell text-gray-600 uppercase tracking-wider text-xs font-semibold">
                Role
              </th>
              <th className="px-3 sm:px-6 py-3 text-gray-600 uppercase tracking-wider text-xs font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin: Admin) => (
                <tr key={admin.studentid} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {admin.studentid}
                  </td>
                  <td className="px-3 sm:px-6 py-4">{admin.adminusername}</td>
                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center">
                      {admin.isSuperAdmin ? (
                        <>
                          <ShieldAlert
                            size={16}
                            className="text-red-500 mr-1"
                          />
                          <span className="text-sm font-medium">
                            Super Admin{" "}
                            {admins.find(
                              (a) => a.adminusername === admin.adminusername
                            )
                              ? "(You)"
                              : ""}
                          </span>
                        </>
                      ) : (
                        <>
                          <Shield size={16} className="text-green-500 mr-1" />
                          <span className="text-sm">Regular Admin</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label="Edit admin"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(admin)}
                        className={`${
                          admin.isSuperAdmin
                            ? "text-red-300 cursor-not-allowed"
                            : "text-red-600 hover:text-red-900"
                        }`}
                        disabled={admin.isSuperAdmin}
                        title={
                          admin.isSuperAdmin ? "Cannot delete main admin" : ""
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 sm:px-6 py-4 text-center text-gray-500"
                >
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg h-auto max-h-[90vh] overflow-y-auto transform transition-all duration-300 p-4 sm:p-6">
            {modalMode === "delete" ? (
              <>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  Confirm
                </h3>
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
            ) : (
              <AdminForm
                mode={modalMode}
                initialData={selectedAdmin}
                onSave={handleSaveAdmin}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ManageAdmins;
