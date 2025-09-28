import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import AdminSidebar from "../components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const { currentUserData } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard | 6 Kilo Gibi Gubae";
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 overflow-auto relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden flex items-center px-4 py-3 bg-white shadow sticky  top-0 left-0 z-50 w-full text-gray-700"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          <span className="ml-2 font-medium">
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </span>
        </button>

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
