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
            <div className="space-y-1.5 text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footer.hotline')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footer.email')}</span>
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

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>{t('footer.copyright')}</div>
          <div className="text-amber-400 font-semibold">Learn Today - Grow Tomorrow!</div>
        </div>
      </div>
    </footer>
  )
}