import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi'

  const toggleLanguage = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors rounded-none"
      title={currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <span className="tracking-wider">{currentLang === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  )
}
