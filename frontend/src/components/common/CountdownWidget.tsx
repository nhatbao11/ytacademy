import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flame, Clock, Sparkles } from 'lucide-react'
import { useDailyCountdown } from '../../hooks/useDailyCountdown'

interface CountdownWidgetProps {
  variant?: 'sidebar' | 'banner' | 'inline'
  originalPriceText?: string
  salePriceText?: string
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({
  variant = 'sidebar',
  originalPriceText,
}) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const {
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    isActive,
    currentSlotLabel,
  } = useDailyCountdown()

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-none whitespace-nowrap">
        <Flame className="w-3.5 h-3.5 text-red-600 fill-red-500 animate-pulse shrink-0" />
        <span className="text-slate-600 font-medium">
          {isActive ? t('countdown.miniRemaining') : (currentLang === 'en' ? 'Next slot in:' : 'Ca tới sau:')}
        </span>
        <span className="font-mono font-black text-red-700 tracking-wider">
          {formattedHours}:{formattedMinutes}:{formattedSeconds}
        </span>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-[#0B2545] text-white p-3 sm:px-6 sm:py-3 rounded-none shadow-md border-b-2 border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-white/20 rounded-none shrink-0 animate-bounce">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-amber-300">
                  {t('countdown.bannerPrefix')}
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 font-black uppercase rounded-none">
                  -15% DISCOUNT
                </span>
                <span className="text-[11px] bg-white/10 text-white px-2 py-0.5 font-mono">
                  {currentSlotLabel}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-200 hidden sm:block">
                {t('countdown.bannerEndingSoon')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-200 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{isActive ? t('countdown.endsIn') : (currentLang === 'en' ? 'Starts in' : 'Bắt đầu sau')}:</span>
            </span>

            <div className="flex items-center gap-1 font-mono">
              <div className="bg-[#07172C] border border-amber-400/40 text-amber-400 px-2 py-1 text-xs sm:text-sm font-black min-w-7 text-center shadow-inner">
                {formattedHours}
              </div>
              <span className="text-amber-300 font-black animate-pulse">:</span>
              <div className="bg-[#07172C] border border-amber-400/40 text-amber-400 px-2 py-1 text-xs sm:text-sm font-black min-w-7 text-center shadow-inner">
                {formattedMinutes}
              </div>
              <span className="text-amber-300 font-black animate-pulse">:</span>
              <div className="bg-[#07172C] border border-amber-400/40 text-amber-400 px-2 py-1 text-xs sm:text-sm font-black min-w-7 text-center shadow-inner">
                {formattedSeconds}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: 'sidebar' variant
  return (
    <div className="bg-gradient-to-br from-red-50 via-rose-50 to-amber-50/50 border-2 border-red-500 p-3.5 rounded-none space-y-2.5 shadow-xs">
      <div className="flex items-center justify-between text-xs font-black text-red-600 uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 fill-red-600 text-red-600 animate-pulse" />
          <span>{t('countdown.flashSaleTitle')}</span>
        </span>
        <span className="text-[11px] bg-red-600 text-white px-2 py-0.5 font-black tracking-wider rounded-none shadow-xs">
          -15%
        </span>
      </div>

      {/* Thông tin khung giờ vàng cố định */}
      <div className="flex items-center justify-between text-[11px] text-slate-700 bg-white/90 px-2.5 py-1.5 border border-red-200">
        <span className="font-medium text-slate-700 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>{isActive ? (currentLang === 'en' ? 'Active Slot:' : 'Khung giờ:') : (currentLang === 'en' ? 'Next Slot:' : 'Ca kế tiếp:')}</span>
          <strong className="text-red-700 font-black">{currentSlotLabel}</strong>
        </span>
        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
          {isActive ? (currentLang === 'en' ? 'LIVE' : 'ĐANG MỞ') : (currentLang === 'en' ? 'UPCOMING' : 'SẮP TỚI')}
        </span>
      </div>

      <div className="bg-[#07172C] border border-slate-700 p-2.5 rounded-none text-white">
        <div className="flex items-center justify-center gap-2">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="bg-[#0B2545] border border-amber-400/40 text-amber-400 px-2.5 py-1 text-sm sm:text-base font-black font-mono min-w-9 text-center shadow-inner">
              {formattedHours}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">
              {t('countdown.hours')}
            </span>
          </div>

          <span className="text-amber-400 font-black text-sm pb-3 animate-pulse">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="bg-[#0B2545] border border-amber-400/40 text-amber-400 px-2.5 py-1 text-sm sm:text-base font-black font-mono min-w-9 text-center shadow-inner">
              {formattedMinutes}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">
              {t('countdown.minutes')}
            </span>
          </div>

          <span className="text-amber-400 font-black text-sm pb-3 animate-pulse">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="bg-[#0B2545] border border-amber-400/40 text-amber-400 px-2.5 py-1 text-sm sm:text-base font-black font-mono min-w-9 text-center shadow-inner">
              {formattedSeconds}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">
              {t('countdown.seconds')}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-slate-600 text-center leading-tight font-medium">
          {t('countdown.endsNotice')}
        </p>
        {originalPriceText && (
          <p className="text-[10px] text-slate-500 text-center">
            <span className="italic">{currentLang === 'en' ? 'Standard tuition: ' : 'Học phí niêm yết: '}</span>
            <span className="font-bold text-slate-700 line-through">{originalPriceText}</span>
          </p>
        )}
      </div>
    </div>
  )
}
