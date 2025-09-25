import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import AdminSidebar from "../components/admin/AdminSidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const { currentUserData } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    document.title = "Admin Dashboard | 6 Kilo Gibi Gubae";
  }, []);

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

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Welcome, {currentUserData?.username || "TestAdmin"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Student ID: {currentUserData?.studentid || "00000"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
