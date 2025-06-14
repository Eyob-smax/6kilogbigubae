
import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Shield, ShieldAlert } from 'lucide-react';
import { Admin } from '../../types';
import AdminForm from '../../components/admin/AdminForm';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../features/admins/adminsSlice';
import type { AppDispatch } from '../../app/store';
import { useTranslation } from 'react-i18next';

const ManageAdmins = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const admins = useSelector((state: any) => state.admin.admins);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const filteredAdmins = Array.isArray(admins)
    ? admins.filter((admin: Admin) => {
        const term = searchTerm.toLowerCase();
        return (
          admin.studentId.toLowerCase().includes(term) ||
          admin.adminUsername.toLowerCase().includes(term)
        );
      })
    : [];

  const openAddModal = () => {
    setSelectedAdmin(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openDeleteModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveAdmin = (adminData: Admin) => {
    if (modalMode === 'add') {
      dispatch(addAdmin({ ...adminData, id: String(Date.now()) }));
    } else if (modalMode === 'edit' && selectedAdmin?.id) {
      dispatch(updateAdmin({ id: selectedAdmin.id, adminData }));
    }
    closeModal();
  };

  const handleDeleteAdmin = () => {
    if (selectedAdmin?.id) dispatch(deleteAdmin(selectedAdmin.id));
    closeModal();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('admin.dashboard.admins')}</h2>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
          className="input-field pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin: Admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{admin.studentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.adminUsername}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {admin.isSuperAdmin ? (
                        <>
                          <ShieldAlert size={16} className="text-red-500 mr-1" />
                          <span className="text-sm font-medium">Super Admin</span>
                        </>
                      ) : (
                        <>
                          <Shield size={16} className="text-green-500 mr-1" />
                          <span className="text-sm">Regular Admin</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openEditModal(admin)} className="text-indigo-600 hover:text-indigo-900">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(admin)}
                        className={`${
                          admin.adminUsername === 'admin'
                            ? 'text-red-300 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        disabled={admin.adminUsername === 'admin'}
                        title={admin.adminUsername === 'admin' ? 'Cannot delete main admin' : ''}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            {modalMode === 'delete' ? (
              <>
                <h3 className="text-xl font-semibold mb-4">{t('forms.confirm')}</h3>
                <p className="mb-6">Are you sure you want to delete admin "{selectedAdmin?.adminUsername}"?</p>
                <div className="flex justify-end space-x-3">
                  <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    {t('forms.no')}
                  </button>
                  <button onClick={handleDeleteAdmin} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    {t('forms.yes')}
                  </button>
                </div>
              </>
            ) : (
              <AdminForm mode={modalMode} initialData={selectedAdmin} onSave={handleSaveAdmin} onCancel={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
