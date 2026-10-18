import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShoppingCart,
  KeyRound,
  BookOpen,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { BrandLogo } from '../common/BrandLogo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useCartStore } from '../../features/cart/cartStore'
import { useAuthStore } from '../../features/auth/authStore'
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
}) => {
  const { t } = useTranslation()
  const { toggleCart, getTotalCount } = useCartStore()
  const { isLoggedIn, user, enrolledCourseIds, logout, openAuthModal } = useAuthStore()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const cartCount = getTotalCount()

  const handleMyCoursesClick = () => {
    if (!isLoggedIn) {
      openAuthModal('login', 'auth.loginToViewMyCourses', () => {
        onNavigateView('my-courses')
      })
      return
    }
    onNavigateView(currentView === 'my-courses' ? 'home' : 'my-courses')
  }

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

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* "Khóa học của tôi" - Yêu cầu đăng nhập nếu chưa đăng nhập */}
            <button
              type="button"
              onClick={handleMyCoursesClick}
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
              {isLoggedIn && enrolledCourseIds.length > 0 && (
                <span
                  className={`text-[10px] font-black px-1 sm:px-1.5 py-0.2 rounded-none ml-0.5 ${
                    currentView === 'my-courses'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {enrolledCourseIds.length}
                </span>
              )}
            </button>

            {/* Kích hoạt khóa học */}
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

            {/* Auth / Account Profile */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors rounded-none cursor-pointer whitespace-nowrap"
                >
                  <div className="w-4 h-4 bg-[#0B2545] text-amber-400 flex items-center justify-center text-[10px] font-black rounded-none">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.name || t('auth.myProfile')}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 shadow-xl py-1 z-50 rounded-none animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        onNavigateView('my-courses')
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('nav.myCourses')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        logout()
                        onNavigateView('home')
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 border-t border-slate-100 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-colors rounded-none shrink-0 cursor-pointer whitespace-nowrap"
                title={t('nav.account')}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{t('nav.login')}</span>
              </button>
            )}

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
