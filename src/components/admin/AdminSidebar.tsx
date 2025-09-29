import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../../store/hooks";
import { logoutAdmin } from "../../features/auth/authSlice";
import {
  Users,
  UserCog,
  BarChart2,
  LogOut,
  Home,
  LucideHome,
} from "lucide-react";
import { t } from "i18next";
import { memo, useCallback, useMemo } from "react";
import headerLogo from "../../assets/headerLogo.png";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

type AdminSidebarProps = {
  isOpen: boolean;
  closeSidebar: () => void;
};

const AdminSidebar = ({ isOpen, closeSidebar }: AdminSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You're about to log out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "No, cancel",
    });
    if (!confirm.isConfirmed) return;

    await dispatch(logoutAdmin());
    navigate("/admin/login");
  }, [dispatch, navigate]);

  const { currentUserData } = useSelector((state: RootState) => state.auth);

  const navLinks = useMemo(() => {
    const links = [
      {
        to: "/admin",
        icon: <Home size={20} />,
        label: t("admin.dashboard.title"),
      },
      {
        to: "/admin/users",
        icon: <Users size={20} />,
        label: t("admin.dashboard.users"),
      },
      {
        to: "/admin/analytics",
        icon: <BarChart2 size={20} />,
        label: t("admin.dashboard.analytics"),
      },
    ];

    if (currentUserData?.isSuperAdmin) {
      links.push({
        to: "/admin/admins",
        icon: <UserCog size={20} />,
        label: t("admin.dashboard.admins"),
      });
    }

    return links;
  }, [currentUserData?.isSuperAdmin]);

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 z-50 h-full w-64 bg-liturgical-blue text-white shadow-xl md:hidden"
          >
            <SidebarContent
              locationPath={location.pathname}
              navLinks={navLinks}
              handleLogout={handleLogout}
              closeSidebar={closeSidebar}
              isMobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:h-screen md:bg-liturgical-blue md:text-white md:shadow-xl">
        <SidebarContent
          locationPath={location.pathname}
          navLinks={navLinks}
          handleLogout={handleLogout}
          closeSidebar={closeSidebar}
        />
      </div>
    </>
  );
};

const SidebarContent = memo(
  ({
    locationPath,
    navLinks,
    handleLogout,
    closeSidebar,
    isMobile = false,
  }: {
    locationPath: string;
    navLinks: { to: string; icon: JSX.Element; label: string }[];
    handleLogout: () => void;
    closeSidebar: () => void;
    isMobile?: boolean;
  }) => {
    return (
      <>
        <div
          className={`${
            isMobile ? "pt-20" : "pt-6"
          } flex items-center justify-between px-4 py-6`}
        >
          <img
            src={headerLogo}
            alt="Header Logo"
            className="w-12 h-12 rounded-full"
          />
          <Link
            to="/"
            className="ml-3 text-lg font-bold text-white hover:text-gold transition-colors"
            onClick={closeSidebar}
          >
            <LucideHome size={24} className="inline-block mr-2" />
          </Link>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map(({ to, icon, label }, index) => (
              <motion.li
                key={to}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink
                  to={to}
                  end={true}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-white/10 text-gold" : "hover:bg-white/5"
                    }`
                  }
                  aria-current={locationPath === to ? "page" : undefined}
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start space-x-3 px-4 py-3 rounded-lg w-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label={t("admin.dashboard.logout")}
          >
            <LogOut size={20} />
            <span>{t("admin.dashboard.logout")}</span>
          </button>
        </div>
      </>
    );
  }
);

export default AdminSidebar;
