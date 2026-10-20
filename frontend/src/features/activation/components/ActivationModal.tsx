import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, KeyRound, CheckCircle2, AlertCircle, Phone } from 'lucide-react'

interface ActivationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [activatedCourse, setActivatedCourse] = useState('')

  if (!isOpen) return null

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = code.trim().toUpperCase()

    if (!clean) return

    // Mock validation logic
    if (clean.startsWith('YT-') || clean === 'VIP2026' || clean.length >= 6) {
      setStatus('success')
      setActivatedCourse(
        clean.includes('ACCA')
          ? 'ACCA Financial Accounting (FA / F3)'
          : 'Khóa học Chuyên môn Quốc tế YT Academy'
      )
    } else {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setCode('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-slate-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-none text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-none bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{t('activation.modalTitle')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('activation.modalSubtitle')}</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-none bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{t('activation.success')}</h4>
              <p className="text-sm font-semibold text-amber-600 mt-1">{activatedCourse}</p>
              <p className="text-xs text-slate-500 mt-2">
                {t('activation.syncNotice')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-none font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('activation.startLearningNow')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t('activation.codeLabel')}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                placeholder={t('activation.inputPlaceholder')}
                className="w-full px-4 py-3 text-base uppercase font-semibold tracking-wider text-slate-900 bg-slate-50 border border-slate-200 rounded-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                {t('activation.sampleHint')} <span className="font-mono text-amber-600 font-bold">YT-ACCA-8899</span>
              </p>
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-none bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('activation.invalidCode')}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-none font-bold text-sm bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              {t('activation.submitBtn')}
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <a
                href="tel:0822082407"
                className="flex items-center gap-1 hover:text-amber-600 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('activation.supportHotline')}</span>
              </a>
              <span className="text-slate-400">{t('activation.instant247')}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
