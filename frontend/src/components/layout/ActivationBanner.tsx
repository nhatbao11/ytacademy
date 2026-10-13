import React from 'react'
import { KeyRound, ArrowRight } from 'lucide-react'

interface ActivationBannerProps {
  onOpenActivation: () => void
}

export const ActivationBanner: React.FC<ActivationBannerProps> = ({ onOpenActivation }) => {
  return (
    <section className="py-10 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0B2545] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Bạn đã có mã kích hoạt khóa học?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Nhập mã nhận được từ trung tâm để mở khóa bài giảng và tài liệu ngay.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenActivation}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-500 transition-all shrink-0 flex items-center gap-2 active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Kích hoạt ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
