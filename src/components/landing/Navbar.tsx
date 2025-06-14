import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { Link } from "react-router-dom";
import headerLogo from "../../assets/headerLogo.png";

const menu = [
  { key: "about", id: "about" },
  { key: "vision", id: "vision" },
  { key: "structure", id: "structure" },
  { key: "involvement", id: "involvement" },

  { key: "events", id: "events" },
  { key: "contact", id: "contact" },
];

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    closeMenu();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src={headerLogo}
            alt="Header Logo"
            className={`w-10 h-10 rounded-full ${
              scrolled ? "opacity-100" : "opacity-80"
            }`}
          />
          <h1
            className={`font-bold text-xl ${
              scrolled ? "text-liturgical-blue" : "text-white"
            }`}
          >
            {t("siteName")}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium hover:text-gold transition-colors ${
                    scrolled ? "text-liturgical-blue" : "text-white"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/admin/login" className="btn-gold">
              {t("hero.login")}
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            className={`p-1 rounded-md ${
              scrolled ? "text-liturgical-blue" : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 md:hidden"
        >
          <ul className="space-y-4">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-liturgical-blue font-medium py-2"
                >
                  {t(`nav.${item.key}`)}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/admin/login"
                className="block w-full text-left text-liturgical-blue font-medium py-2"
              >
                {t("hero.login")}
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
