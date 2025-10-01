// src/pages/AdminLogin.tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { loginAdmin, clearAuthError } from "../features/auth/authSlice";
import { User, Lock, AlertCircle } from "react-feather";
import headerLogo from "../assets/headerLogo.png";

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearAuthError());
    dispatch(loginAdmin({ studentId, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 holy-cross-bg">
      <motion.div
        className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="rounded-full mb-6 sm:mb-8">
            <div className="flex items-center justify-center bg-white p-3 sm:p-4 rounded-full">
              <img
                src={headerLogo}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full"
                alt="Logo"
              />
            </div>
          </div>

          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-liturgical-blue">
            {t("admin.login.title")}
          </h2>
        </div>

        <form
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="studentId" className="sr-only">
                {t("admin.login.studentId")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 sm:py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                  placeholder={`${t(
                    "admin.login.studentId"
                  )} (use hyphen (-) not (/))`}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t("admin.login.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 sm:py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base"
                  placeholder={t("admin.login.password")}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {localError && (
            <div className="flex items-center text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{localError}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2 h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t("admin.login.submit")}...
                </span>
              ) : (
                t("admin.login.submit")
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <div>
        <Link
          to={"/"}
          className="text-xs sm:text-sm text-indigo-600 absolute bg-[#fffefe] top-[8%] sm:top-[10%] left-[3%] sm:left-[5%] hover:text-indigo-500 mt-3 sm:mt-4 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-sm shadow-slate-900/15"
        >
          {t("admin.login.backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
