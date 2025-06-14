import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

const AdminDashboard = () => {
  const { admin } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = 'Admin Dashboard | 6 Kilo Gibi Gubae';
  }, []);

  const displayAdmin = admin || { adminUsername: 'TestAdmin', studentId: '000000' };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 overflow-auto relative">
        {/* Mobile toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-50 text-gray-700"
        >
          <Menu size={28} />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {displayAdmin.adminUsername}</h1>
            <p className="text-gray-600">Student ID: {displayAdmin.studentId}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
