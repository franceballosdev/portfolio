import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="uppercase">{language === 'es' ? 'EN' : 'ES'}</span>
    </motion.button>
  );
};

export default LanguageToggle;
