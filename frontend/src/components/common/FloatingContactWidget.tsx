import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PhoneCall, X, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

const HOTLINE_DISPLAY = '0989.123.456'
const HOTLINE_TEL = 'tel:0989123456'
const ZALO_URL = 'https://zalo.me/0989123456'

export const FloatingContactWidget: React.FC = () => {
  const { t } = useTranslation()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isBubbleOpen, setIsBubbleOpen] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Danh sách các thông điệp tư vấn lộ trình & hỗ trợ chuyển động luân phiên (Đa ngôn ngữ)
  const consultationMessages = [
    {
      id: 'route',
      tag: t('floatingWidget.tagRoute'),
      title: t('floatingWidget.titleRoute'),
      desc: t('floatingWidget.descRoute'),
      ctaText: t('floatingWidget.ctaRoute'),
      target: 'zalo',
    },
    {
      id: 'support',
      tag: t('floatingWidget.tagSupport'),
      title: t('floatingWidget.titleSupport'),
      desc: t('floatingWidget.descSupport'),
      ctaText: t('floatingWidget.ctaSupport'),
      target: 'zalo',
    },
    {
      id: 'hotline',
      tag: t('floatingWidget.tagHotline'),
      title: t('floatingWidget.titleHotline'),
      desc: t('floatingWidget.descHotline'),
      ctaText: t('floatingWidget.ctaHotline'),
      target: 'phone',
    },
    {
      id: 'materials',
      tag: t('floatingWidget.tagMaterials'),
      title: t('floatingWidget.titleMaterials'),
      desc: t('floatingWidget.descMaterials'),
      ctaText: t('floatingWidget.ctaMaterials'),
      target: 'zalo',
    },
  ]

  // Tự động xoay vòng thông điệp mỗi 6 giây (nếu không hover)
  useEffect(() => {
    if (!isBubbleOpen || isHovered) return

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % consultationMessages.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [isBubbleOpen, isHovered, consultationMessages.length])

  const currentMsg = consultationMessages[currentIdx] || consultationMessages[0]

  const handleAction = (target: string) => {
    if (target === 'phone') {
      window.location.href = HOTLINE_TEL
    } else {
      window.open(ZALO_URL, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-5 z-40 flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* 1. BÓNG THOẠI TƯ VẤN (Speech Bubble - Góc vuông sắc sảo) */}
      {isBubbleOpen && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-[#0B2545] border-2 border-amber-400 text-white p-3 sm:p-3.5 shadow-2xl max-w-[260px] sm:max-w-[320px] rounded-none animate-fadeIn transition-all duration-300"
        >
          {/* Header bóng thoại */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 inline-block animate-pulse rounded-none" />
              <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentMsg.tag}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsBubbleOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded-none transition-colors"
              title={t('common.close')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nội dung thông điệp luân phiên */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-xs sm:text-sm leading-snug">
              {currentMsg.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-normal">
              {currentMsg.desc}
            </p>
          </div>

          {/* Action button inside bubble */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between">
            {/* Dots indicator */}
            <div className="flex items-center gap-1">
              {consultationMessages.map((msg, idx) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 transition-all rounded-none ${
                    idx === currentIdx ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Message ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAction(currentMsg.target)}
              className="px-2.5 py-1 text-[11px] font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors flex items-center gap-1 rounded-none shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{currentMsg.ctaText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mũi nhọn tam giác chỉ xuống nút Zalo/Điện thoại */}
          <div
            className="absolute -bottom-2 right-6 w-0 h-0 
              border-l-[8px] border-l-transparent 
              border-r-[8px] border-r-transparent 
              border-t-[8px] border-t-amber-400"
          />
        </div>
      )}

      {/* 2. CỤM NÚT HÀNH ĐỘNG (ZALO + ĐIỆN THOẠI RUNG LẮC) */}
      <div className="flex flex-col items-end gap-2.5">
        {/* NÚT CHAT ZALO */}
        <div className="relative group flex items-center gap-2">
          {/* Tooltip khi hover (Desktop) */}
          <span className="hidden sm:group-hover:inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-md border border-slate-700 rounded-none animate-fadeIn">
            {t('floatingWidget.ctaRoute')}
          </span>

          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-12 h-12 sm:w-13 sm:h-13 bg-[#0068FF] hover:bg-[#0053cc] text-white flex flex-col items-center justify-center shadow-xl border-2 border-white rounded-none transition-transform duration-200 active:scale-95 animate-ring-wiggle"
            title="Chat Zalo"
          >
            {/* Vòng sóng tỏa phía sau */}
            <span className="absolute inset-0 bg-[#0068FF] opacity-40 animate-radar-ripple pointer-events-none rounded-none" />

            {/* Chữ Zalo chuẩn nhận diện thương hiệu */}
            <span className="text-[13px] font-black tracking-tight leading-none text-white drop-shadow-xs">
              Zalo
            </span>
            <span className="text-[9px] font-bold text-blue-100 uppercase tracking-tighter scale-90">
              {t('common.contact')}
            </span>
          </a>
        </div>

        {/* NÚT GỌI HOTLINE (ĐIỆN THOẠI) */}
        <div className="relative group flex items-center gap-2">
          {/* Tooltip khi hover (Desktop) */}
          <span className="hidden sm:group-hover:inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-md border border-slate-700 rounded-none animate-fadeIn">
            Hotline: {HOTLINE_DISPLAY}
          </span>

          <a
            href={HOTLINE_TEL}
            className="relative w-12 h-12 sm:w-13 sm:h-13 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center shadow-xl border-2 border-white rounded-none transition-transform duration-200 active:scale-95 animate-ring-wiggle"
            style={{ animationDelay: '1.5s' }}
            title={`Hotline: ${HOTLINE_DISPLAY}`}
          >
            {/* Vòng sóng tỏa phía sau */}
            <span
              className="absolute inset-0 bg-red-600 opacity-40 animate-radar-ripple pointer-events-none rounded-none"
              style={{ animationDelay: '1s' }}
            />

            <PhoneCall className="w-5 h-5 text-white drop-shadow-xs" />
            <span className="text-[9px] font-bold text-red-100 uppercase tracking-tighter scale-90">
              {t('floatingWidget.ctaHotline')}
            </span>
          </a>
        </div>

        {/* Nút bật lại bóng thoại nếu người dùng đã bấm tắt */}
        {!isBubbleOpen && (
          <button
            type="button"
            onClick={() => setIsBubbleOpen(true)}
            className="w-8 h-8 bg-[#0B2545] hover:bg-[#133966] text-amber-400 border border-amber-400 flex items-center justify-center shadow-md rounded-none transition-transform hover:scale-105 cursor-pointer"
            title="Tư vấn lộ trình"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
