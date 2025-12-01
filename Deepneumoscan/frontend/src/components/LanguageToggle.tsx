import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
      aria-label="Toggle Language"
    >
      <Languages size={20} />
      <span className="font-medium">{language === 'en' ? 'EN' : 'ಕನ್ನಡ'}</span>
    </button>
  );
};
