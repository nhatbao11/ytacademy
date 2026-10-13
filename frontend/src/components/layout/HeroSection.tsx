import React from 'react'
import { useTranslation } from 'react-i18next'
import { Search, User, KeyRound } from 'lucide-react'

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectCategory?: (cat: any) => void
  onRegisterNow?: () => void
  onOpenActivation?: () => void
  onOpenAuth?: (mode: 'login' | 'register') => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onRegisterNow,
  onOpenActivation,
  onOpenAuth,
}) => {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center text-white overflow-hidden">
      {/* Background with real Executive Finance & ACCA Accounting Workspace */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/webp" srcSet="/hero-bg.webp" />
          <img
            src="/hero-bg.jpg"
            alt="YT Academy ACCA Training"
            className="w-full h-full object-cover object-center filter brightness-65 contrast-110"
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* Navy gradient overlay for optimal contrast and brand alignment */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07172C]/75 via-[#0B2545]/70 to-[#07172C]/85" />
      </div>

      {/* Centered Focus Box - Tinh gọn 100% chuẩn BISC Online */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center py-8 sm:py-10 space-y-5 sm:space-y-6">
        {/* Mobile Quick Action Buttons - Nơi người dùng chỉ định ở Hình 3 */}
        <div className="sm:hidden w-full max-w-sm mx-auto">
          <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-[#07172C]/85 border border-white/20 backdrop-blur-md rounded-none shadow-lg">
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-xs uppercase tracking-wide border border-white/25 rounded-none transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{t('nav.login')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenActivation}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wide rounded-none shadow-sm transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>{t('nav.activation')}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-amber-400 font-bold text-xs sm:text-sm tracking-widest uppercase">
            {t('hero.badge')}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {t('hero.mainTitle')}
          </h1>
        </div>

        {/* Central Search Form (Góc vuông) */}
        <div className="max-w-lg mx-auto space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const el = document.getElementById('courses-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center bg-white p-1 border border-white/20 rounded-none shadow-2xl"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="w-full px-3 py-2 text-slate-900 text-xs sm:text-sm placeholder-slate-400 outline-none rounded-none"
            />
            <button
              type="submit"
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 rounded-none cursor-pointer"
            >
              {t('hero.searchBtn')}
            </button>
          </form>

          {/* Primary CTA Button (Chuẩn BISC Online: ĐĂNG KÝ HỌC NGAY) */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (onRegisterNow) onRegisterNow()
                else {
                  const el = document.getElementById('courses-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all rounded-none shadow-xl active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{t('hero.registerNow')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
