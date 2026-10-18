import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  ShoppingCart,
  ShieldCheck,
} from 'lucide-react'
import type { ICourse } from '../../../types'
import { formatCurrency } from '../../../utils/format'
import { useCartStore } from '../../cart/cartStore'

interface CourseDetailModalProps {
  course: ICourse | null
  onClose: () => void
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose }) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const { addToCart, items } = useCartStore()

  if (!course) return null

  const isInCart = items.some((item) => item.course.id === course.id)
  const displayTitle = currentLang === 'en' && course.titleEn ? course.titleEn : course.title
  const displayCategory = currentLang === 'en' && course.categoryNameEn ? course.categoryNameEn : course.categoryName
  const displayDuration = currentLang === 'en' && course.durationHoursEn ? course.durationHoursEn : course.durationHours
  const displayDescription = currentLang === 'en' && course.descriptionEn ? course.descriptionEn : course.description
  const instructorTitle = currentLang === 'en' ? 'ACCA Lecturer' : course.instructor.title
  const instructorExperience = currentLang === 'en'
    ? 'Extensive experience training ACCA students with outstanding pass rates'
    : course.instructor.experience

  const handleEnroll = () => {
    addToCart(course)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-none shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image banner */}
        <div className="relative aspect-21/9 w-full bg-slate-900 overflow-hidden rounded-none">
          <img
            src={course.thumbnail}
            alt={displayTitle}
            className="w-full h-full object-cover opacity-60 rounded-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-none bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 rounded-none bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider mb-2 inline-block">
              {displayCategory}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900">{course.rating.toFixed(1)}</span>
              <span className="text-slate-400">({course.reviewCount} {t('courses.reviews')})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{course.studentCount} {t('courseDetail.studentsCount')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{t('courseDetailModal.hoursOnline', { hours: displayDuration })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{t('courseDetailModal.lessonsDetailed', { count: course.lessonsCount })}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('courseDetail.courseIntro')}
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {displayDescription}
            </p>
          </div>

          {/* Instructor Box */}
          <div className="p-4 rounded-none bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-14 h-14 rounded-none object-cover ring-2 ring-amber-400/30"
            />
            <div>
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                {t('courseDetailModal.instructorTitleLabel')}
              </div>
              <div className="text-base font-bold text-slate-900">{course.instructor.name}</div>
              <div className="text-xs text-slate-500">{instructorTitle}</div>
              <div className="text-xs text-slate-400 mt-0.5">{instructorExperience}</div>
            </div>
          </div>

          {/* Highlights / What You Will Learn */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {t('courseDetailModal.studentBenefits')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('courseDetailModal.benefit1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('courseDetailModal.benefit2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('courseDetailModal.benefit3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('courseDetailModal.benefit4')}</span>
              </div>
            </div>
          </div>

          {/* Bottom Pricing & Checkout Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 line-through">
                {formatCurrency(course.originalPrice, currentLang)}
              </div>
              <div className="text-2xl font-black text-[#0B2545] flex items-center gap-2">
                <span>{formatCurrency(course.salePrice, currentLang)}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-none bg-red-100 text-red-700">
                  {t('courseDetailModal.savePercent', { percent: course.discountPercent })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleEnroll}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-none font-bold text-sm bg-amber-400 hover:bg-amber-500 text-slate-950 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isInCart ? t('courseDetailModal.openCartToCheckout') : t('courses.buyNow')}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t('cart.guarantee')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
