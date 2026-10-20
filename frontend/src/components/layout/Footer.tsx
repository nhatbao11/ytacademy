import React from 'react'
import { useTranslation } from 'react-i18next'
import { BrandLogo } from '../common/BrandLogo'
import { Phone, Mail, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#07172C] text-slate-300 pt-10 pb-8 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs">
          {/* Brand info */}
          <div className="space-y-3">
            <BrandLogo className="h-9" variant="white" />
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t('footer.about')}
            </p>
            <div className="space-y-2 text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:0822082407" className="hover:text-amber-400 transition-colors font-medium">
                  {t('footer.hotline')}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:ytacademy.edu@gmail.com" className="hover:text-amber-400 transition-colors">
                  {t('footer.email')}
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.programsTitle')}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#courses-section" className="hover:text-amber-400 transition-colors">ACCA Qualification</a></li>
              <li><a href="#courses-section" className="hover:text-amber-400 transition-colors">ICAEW Qualification</a></li>
              <li><a href="#courses-section" className="hover:text-amber-400 transition-colors">CFA Program</a></li>
              <li><a href="#courses-section" className="hover:text-amber-400 transition-colors">Unlock Big4 Interview</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.policiesTitle')}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">{t('footer.paymentPolicy')}</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">{t('footer.privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">{t('footer.complaintPolicy')}</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">{t('footer.termsOfService')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - Tối giản, không tốn diện tích */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>{t('footer.copyright')}</div>

          {/* 2 icon đơn giản tối giản */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61558436517466"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#1877F2] transition-colors p-1"
              title="Facebook YT Academy"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@yt.academy.edu?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="TikTok @yt.academy.edu"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-amber-400 font-semibold">Learn Today - Grow Tomorrow!</span>
            <span className="text-slate-700">•</span>
            <a href="/admin" className="text-slate-500 hover:text-amber-400 font-medium transition-colors">
              Quản Trị
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}