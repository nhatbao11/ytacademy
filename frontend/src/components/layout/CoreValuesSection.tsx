import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookMarked,
  Compass,
  UsersRound,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface CoreValuesSectionProps {
  onConsultRoute?: () => void
}

export const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ onConsultRoute }) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const values = [
    {
      step: '01',
      title: t('coreValues.v1Title'),
      icon: BookMarked,
      desc: t('coreValues.v1Desc'),
    },
    {
      step: '02',
      title: t('coreValues.v2Title'),
      icon: Compass,
      desc: t('coreValues.v2Desc'),
    },
    {
      step: '03',
      title: t('coreValues.v3Title'),
      icon: UsersRound,
      desc: t('coreValues.v3Desc'),
    },
    {
      step: '04',
      title: t('coreValues.v4Title'),
      icon: BrainCircuit,
      desc: t('coreValues.v4Desc'),
    },
  ]

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const children = Array.from(container.children) as HTMLElement[]
      if (children.length > 0) {
        let closestIdx = 0
        let minDiff = Infinity
        children.forEach((child, idx) => {
          const diff = Math.abs(child.offsetLeft - container.offsetLeft - scrollLeft)
          if (diff < minDiff) {
            minDiff = diff
            closestIdx = idx
          }
        })
        if (closestIdx !== currentIndex) {
          setCurrentIndex(closestIdx)
        }
      }
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
      const clampedIndex = Math.max(0, Math.min(values.length - 1, nextIndex))
      const targetChild = container.children[clampedIndex] as HTMLElement
      if (targetChild) {
        container.scrollTo({
          left: targetChild.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        })
        setCurrentIndex(clampedIndex)
      }
    }
  }

  return (
    <section className="w-full relative pt-8 sm:pt-12 pb-8 sm:pb-12 overflow-hidden bg-[#07172C]">
      {/* Background Image Layer (Xử lý mờ và gradient navy giống hệt Hero Section trên cùng) */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/webp" srcSet="/core-values-bg.webp" />
          <img
            src="/core-values-bg.webp"
            alt="YT Academy Core Values Campus"
            className="w-full h-full object-cover object-center filter brightness-65 contrast-110"
            loading="lazy"
            decoding="async"
          />
        </picture>
        {/* Navy gradient overlay giống hệt Hero Section trên cùng, chuyển tiếp tự nhiên và hòa quyện vào Footer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07172C]/75 via-[#0B2545]/70 to-[#07172C]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block - Nổi bật, chữ trắng sáng rõ trên 1 hàng */}
        <div className="max-w-4xl mx-auto text-center space-y-2.5 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest border border-amber-500 rounded-none shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{t('coreValues.tag')}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md sm:whitespace-nowrap">
            {t('coreValues.title')}
          </h2>
        </div>

        {/* Mobile Swipe Helper: Hiển thị hướng dẫn & số thứ tự 1/4 */}
        <div className="flex sm:hidden items-center justify-between pb-2 px-1 text-xs text-white">
          <span className="text-[11px] font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 border border-white/20 rounded-none">
            ← Kéo ngang xem 4 giá trị →
          </span>
          <span className="text-[11px] font-bold text-amber-400 bg-slate-950/85 px-2.5 py-0.5 border border-amber-400/40 rounded-none shadow-2xs">
            {currentIndex + 1} / {values.length}
          </span>
        </div>

        {/* Wrapper 4 thẻ giá trị cốt lõi & 2 nút điều hướng trái/phải đặt ngang với thẻ */}
        <div className="relative mb-8">
          {/* Nút lùi Trái (Mobile only, ngang giữa thẻ) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleScroll('left')
            }}
            disabled={currentIndex === 0}
            className={`sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8.5 h-11 bg-white/95 text-slate-800 border border-slate-300 shadow-md flex items-center justify-center rounded-none active:scale-95 transition-all cursor-pointer ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                : 'hover:bg-amber-400 hover:text-slate-950 hover:border-amber-500'
            }`}
            aria-label="Giá trị trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Nút tiến Phải (Mobile only, ngang giữa thẻ) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleScroll('right')
            }}
            disabled={currentIndex >= values.length - 1}
            className={`sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8.5 h-11 bg-white/95 text-slate-800 border border-slate-300 shadow-md flex items-center justify-center rounded-none active:scale-95 transition-all cursor-pointer ${
              currentIndex >= values.length - 1
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                : 'hover:bg-amber-400 hover:text-slate-950 hover:border-amber-500'
            }`}
            aria-label="Giá trị kế tiếp"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 4 Core Value Cards - Mỗi khung 1 thẻ trên điện thoại (w-full min-w-full snap-start), Grid trên màn hình lớn */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScrollEvent}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-3 sm:pb-0 no-scrollbar"
          >
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.step}
                  className="w-full min-w-full shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink bg-white p-6 border-2 border-slate-200 hover:border-amber-400 transition-all duration-200 flex flex-col justify-between rounded-none shadow-xs hover:shadow-lg group hover:-translate-y-1"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-3xl font-black text-amber-500 tracking-wider font-mono">
                        {v.step}
                      </span>
                      <div className="w-10 h-10 bg-slate-50 border border-slate-200 group-hover:bg-amber-50 group-hover:border-amber-400 flex items-center justify-center rounded-none transition-colors">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                      {v.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {v.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Training Advisory Box - Tông than chì cao cấp viền vàng (Không bị xanh) */}
        <div className="bg-slate-950 text-white border-2 border-amber-400 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-none shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
              {t('coreValues.advisoryTitle')}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('coreValues.advisoryDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={onConsultRoute}
            className="w-full sm:w-auto px-7 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shrink-0 rounded-none shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('coreValues.consultBtn')}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
