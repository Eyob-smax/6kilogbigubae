import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher relative">
      <button
        className="flex items-center space-x-1 text-liturgical-blue hover:text-liturgical-blue/80 transition-colors"
        onClick={toggleDropdown}
      >
        <GlobeIcon size={20} />
        <span className="hidden sm:inline">{i18n.language === 'am' ? 'አማርኛ' : 'English'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-liturgical-blue/10 font-semibold' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm amharic ${i18n.language === 'am' ? 'bg-liturgical-blue/10 font-semibold' : ''}`}
            onClick={() => changeLanguage('am')}
          >
            አማርኛ
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;