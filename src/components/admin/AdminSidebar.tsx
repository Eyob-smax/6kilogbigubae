import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { logoutAdmin } from '../../features/auth/authSlice';
import { Users, UserCog, BarChart2, LogOut, Home, Menu } from 'lucide-react';
import { t } from 'i18next';
import { useState, useEffect, useCallback } from 'react';
import headerLogo from '../../assets/headerLogo.png'; // Adjust the path as necessary

const AdminSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    const resultAction = await dispatch(logoutAdmin());
    if (logoutAdmin.fulfilled.match(resultAction)) {
      navigate('/admin/login');
    }
  }, [dispatch, navigate]);

  const navLinks = [
    { to: '/admin', icon: <Home size={20} />, label: t('admin.dashboard.title') },
    { to: '/admin/users', icon: <Users size={20} />, label: t('admin.dashboard.users') },
    { to: '/admin/admins', icon: <UserCog size={20} />, label: t('admin.dashboard.admins') },
    { to: '/admin/analytics', icon: <BarChart2 size={20} />, label: t('admin.dashboard.analytics') },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-liturgical-blue text-white sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 py-3 h-16">
          <div className="flex items-center space-x-2">
            <img src={headerLogo} alt="Logo" className="w-10 h-10 rounded-full" />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t('aria.closeMenu') : t('aria.openMenu')}
            aria-expanded={isOpen}
            className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 z-50 h-full w-64 bg-liturgical-blue text-white shadow-xl md:relative md:z-auto"
            >
              {/* Logo */}
              <div className="flex items-center px-4 py-6">
                <img src={headerLogo} alt="Header Logo" className="w-12 h-12 rounded-full" />
              </div>

              {/* Navigation Links */}
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
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive ? 'bg-white/10 text-gold' : 'hover:bg-white/5'
                          }`
                        }
                        aria-current={location.pathname === to ? 'page' : undefined}
                      >
                        {icon}
                        <span>{label}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                  aria-label={t('admin.dashboard.logoutAdmin')}
                >
                  <LogOut size={20} />
                  <span>{t('admin.dashboard.logoutAdmin')}</span>
                </button>
              </div>
            </motion.div>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
