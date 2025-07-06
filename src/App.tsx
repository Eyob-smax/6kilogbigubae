import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/ui/LoadingScreen";
import ProtectedAdminsPage from "./components/auth/protectedAdminsPage";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageAdmins = lazy(() => import("./pages/admin/ManageAdmins"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "admins",
        element: (
          <ProtectedAdminsPage>
            <ManageAdmins />
          </ProtectedAdminsPage>
        ),
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
]);
function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
