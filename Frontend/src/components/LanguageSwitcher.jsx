import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const getCurrentLanguage = () => {
    return i18n.language === 'gu' ? 'ગુજરાતી' : 'English';
  };

  return (
    <div className="language-switcher" onClick={() => setIsOpen(!isOpen)}>
      <Globe size={16} />
      <span className="language-current">{getCurrentLanguage()}</span>
      <ChevronDown size={16} />
      
      {isOpen && (
        <div className="language-dropdown" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button 
            className={`language-option ${i18n.language === 'gu' ? 'active' : ''}`}
            onClick={() => changeLanguage('gu')}
          >
            ગુજરાતી
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
