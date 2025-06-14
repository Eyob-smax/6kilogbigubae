import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../features/users/userSlice';
import { User } from '../../types';
import UserForm from '../../components/admin/UserForm';
import type { AppDispatch } from '../../app/store';

const ManageUsers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { users = [] } = useSelector((state: any) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user: User) =>
        [user.studentid, user.firstname, user.lastname, user.baptismalname]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const openModal = (mode: 'add' | 'edit' | 'delete', user: User | null = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData: User) => {
    if (modalMode === 'add') {
      dispatch(addUser(userData));
    } else if (modalMode === 'edit' && selectedUser?.id) {
      dispatch(updateUser({ id: selectedUser.id, userData }));
    }
    closeModal();
  };

  const handleDeleteUser = () => {
    if (selectedUser?.id) {
      dispatch(deleteUser(selectedUser.id));
    }
    closeModal();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('admin.users.title')}</h2>
        <button
          onClick={() => openModal('add')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <Plus size={18} className="mr-2" />
          {t('admin.users.add')}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder={t('admin.users.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Baptismal</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Participation</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user: User) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.studentid}</td>
                <td className="px-6 py-4">{user.firstname} {user.lastname}</td>
                <td className="px-6 py-4">{user.baptismalname}</td>
                <td className="px-6 py-4">{user.universityusers?.departmentname}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    user.universityusers?.participation === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : user.universityusers?.participation === 'Occasional'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.universityusers?.participation}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openModal('edit', user)}
                      className="text-indigo-600 hover:text-indigo-900"
                      aria-label="Edit user"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openModal('delete', user)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {t('admin.users.no_results')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto transform transition-all duration-300">
            {modalMode === 'delete' ? (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">{t('forms.confirm')}</h3>
                <p className="text-gray-700">
                  {t('forms.delete_confirm')} <strong>{selectedUser?.firstname}</strong>?
                </p>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                  >
                    {t('forms.no')}
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    {t('forms.yes')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
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

export default ManageUsers;
