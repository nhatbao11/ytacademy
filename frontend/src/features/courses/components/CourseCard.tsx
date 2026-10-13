import React from 'react'
import { useTranslation } from 'react-i18next'
import { Star, ShoppingCart, Check } from 'lucide-react'
import type { ICourse } from '../../../types'
import { formatCurrency } from '../../../utils/format'
import { useCartStore } from '../../cart/cartStore'

interface CourseCardProps {
  course: ICourse
  onSelectCourse?: (course: ICourse) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
  const { t } = useTranslation()
  const { addToCart, items } = useCartStore()

  const isInCart = items.some((item) => item.course.id === course.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(course)
  }

  return (
    <div
      onClick={() => onSelectCourse && onSelectCourse(course)}
      className="group bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer rounded-none"
    >
      {/* Thumbnail (Góc vuông) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 rounded-none">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
        />
        {course.discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white font-black text-[11px] shadow-sm rounded-none">
            -{course.discountPercent}%
          </span>
        )}
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-950/80 text-amber-300 text-[10px] font-bold flex items-center gap-1 rounded-none shadow-sm border border-white/10">
          <svg className="w-3 h-3 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
          </svg>
          <span>{course.lessonsCount} {t('courses.videos')}</span>
        </span>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {course.title}
          </h3>

          <div className="flex items-center gap-2">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-5 h-5 object-cover object-top border border-slate-300 rounded-none shrink-0"
            />
            <p className="text-xs text-slate-600 font-medium truncate">
              {course.instructor.name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-slate-800">
              {course.rating > 0 ? course.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-slate-500">
              ({course.reviewCount || course.reviews?.length || 0} {t('courses.reviews')})
            </span>
          </div>
        </div>

        {/* Pricing & Cart Action (Góc vuông) */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            {course.originalPrice > course.salePrice && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatCurrency(course.originalPrice)}
              </div>
            )}
            <div className="text-sm font-black text-[#0B2545]">
              {formatCurrency(course.salePrice)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`p-2 text-xs font-semibold transition-all border rounded-none cursor-pointer ${
              isInCart
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-amber-400 hover:bg-amber-500 border-amber-400 text-slate-950 active:scale-95'
            }`}
            title={isInCart ? t('courses.addedToCart') : t('courses.addToCart')}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
