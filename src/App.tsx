import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingScreen from "./components/ui/LoadingScreen";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageAdmins = lazy(() => import("./pages/admin/ManageAdmins"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
