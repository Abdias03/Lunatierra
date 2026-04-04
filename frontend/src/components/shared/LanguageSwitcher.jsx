import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language.split('-')[0] || 'es');

  useEffect(() => {
    const handleLanguageChange = (language) => {
      setCurrentLanguage(language.split('-')[0]);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const languages = [
    { code: 'es', label: t('language.spanish') },
    { code: 'en', label: t('language.english') }
  ];

  return (
    <div
      data-testid="language-switcher"
      className="language-switcher flex items-center gap-2 self-start rounded-full border border-earth-100 bg-white/90 p-1 shadow-sm"
      aria-label={t('language.label')}
    >
      {languages.map((language) => {
        const isActive = currentLanguage === language.code;

        return (
          <button
            key={language.code}
            data-testid={`language-option-${language.code}`}
            type="button"
            onClick={() => i18n.changeLanguage(language.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isActive ? 'bg-leaf-500 text-white' : 'text-earth-500 hover:bg-earth-50'
            }`}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
