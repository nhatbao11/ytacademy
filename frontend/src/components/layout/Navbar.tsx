import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShoppingCart,
  KeyRound,
  BookOpen,
  User,
} from 'lucide-react'
import { BrandLogo } from '../common/BrandLogo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useCartStore } from '../../features/cart/cartStore'
import type { CourseCategory } from '../../types'

interface NavbarProps {
  currentView: 'home' | 'my-courses' | 'classroom' | 'course-detail'
  onNavigateView: (view: 'home' | 'my-courses') => void
  onOpenActivation: () => void
  onOpenAuth: (mode: 'login' | 'register') => void
  searchQuery?: string
  onSearchChange?: (val: string) => void
  onSelectCategory?: (cat: CourseCategory) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onOpenActivation,
  onOpenAuth,
}) => {
  const { t } = useTranslation()
  const { toggleCart, getTotalCount } = useCartStore()

  const cartCount = getTotalCount()

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-3">
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigateView('home')}
              className="flex items-center cursor-pointer"
              aria-label="YT Academy Trang chủ"
            >
              <BrandLogo className="h-6 sm:h-7 md:h-8" />
            </button>
          </div>

          {/* Right: Actions (Luôn hiển thị trực tiếp bên ngoài trên mọi kích thước màn hình) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* "Khóa học của tôi" */}
            <button
              type="button"
              onClick={() => onNavigateView(currentView === 'my-courses' ? 'home' : 'my-courses')}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 md:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all rounded-none cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'my-courses'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
              title={t('nav.myCourses')}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t('nav.myCourses')}</span>
              <span className="sm:hidden">{t('nav.myCoursesShort')}</span>
              <span
                className={`text-[10px] font-black px-1 sm:px-1.5 py-0.2 rounded-none ml-0.5 ${
                  currentView === 'my-courses'
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                3
              </span>
            </button>

            {/* Kích hoạt khóa học (Hiện từ sm trở lên, trên mobile hiển thị tại banner hình 3) */}
            <button
              type="button"
              onClick={onOpenActivation}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 transition-colors rounded-none shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
              title={t('nav.activation')}
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>{t('nav.activation')}</span>
            </button>

            {/* Shopping Cart */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-colors rounded-none shrink-0 cursor-pointer"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-600 text-white font-black text-[10px] flex items-center justify-center rounded-none shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Login (Hiện từ sm trở lên, trên mobile hiển thị tại banner hình 3) */}
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-colors rounded-none shrink-0 cursor-pointer whitespace-nowrap"
              title={t('nav.account')}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>{t('nav.login')}</span>
            </button>

            {/* Language Switcher */}
            <div className="border-l border-slate-200 pl-1 sm:pl-2 shrink-0">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
