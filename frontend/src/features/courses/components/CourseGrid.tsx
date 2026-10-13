import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CourseCard } from './CourseCard'
import type { ICourse } from '../../../types'
import { SearchX, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

interface CourseGridProps {
  courses: ICourse[]
  loading: boolean
  onSelectCourse?: (course: ICourse) => void
  onResetFilter?: () => void
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  loading,
  onSelectCourse,
  onResetFilter,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const INITIAL_LIMIT = 8

  // Reset scroll về đầu khi danh sách khóa học thay đổi (ví dụ đổi bộ lọc)
  useEffect(() => {
    setCurrentIndex(0)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'auto' })
    }
  }, [courses])

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
      const clampedIndex = Math.max(0, Math.min(courses.length - 1, nextIndex))
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-none p-4 border border-slate-200 animate-pulse space-y-4"
          >
            <div className="aspect-video bg-slate-200 rounded-none w-full" />
            <div className="h-4 bg-slate-200 rounded-none w-3/4" />
            <div className="h-3 bg-slate-200 rounded-none w-1/2" />
            <div className="h-8 bg-slate-200 rounded-none w-full mt-4" />
          </div>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-none border border-slate-200 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-none bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-1">{t('courses.noCourses')}</h4>
        <p className="text-sm text-slate-500 mb-6">
          {t('courses.noCoursesDesc')}
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="px-5 py-2.5 rounded-none text-sm font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-all cursor-pointer"
          >
            {t('courses.viewAll')}
          </button>
        )}
      </div>
    )
  }

  const hasMore = courses.length > INITIAL_LIMIT

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Mobile Swipe Helper: Hiển thị hướng dẫn kéo & số lượng khóa học hiện tại */}
      <div className="flex sm:hidden items-center justify-between pb-1 px-1 text-xs">
        <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 border border-amber-300 rounded-none">
          ← Kéo ngang để xem môn học →
        </span>
        <span className="text-[11px] font-bold text-[#0B2545] bg-white px-2.5 py-0.5 border border-slate-300 rounded-none shadow-2xs">
          {currentIndex + 1} / {courses.length}
        </span>
      </div>

      {/* Wrapper Khóa học & 2 nút điều hướng trái/phải đặt ngang với thẻ khóa học */}
      <div className="relative">
        {/* Nút lùi Trái (Mobile only, ngang giữa thẻ khóa học) */}
        {courses.length > 1 && (
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
            aria-label="Xem khóa học trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Nút tiến Phải (Mobile only, ngang giữa thẻ khóa học) */}
        {courses.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleScroll('right')
            }}
            disabled={currentIndex >= courses.length - 1}
            className={`sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8.5 h-11 bg-white/95 text-slate-800 border border-slate-300 shadow-md flex items-center justify-center rounded-none active:scale-95 transition-all cursor-pointer ${
              currentIndex >= courses.length - 1
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                : 'hover:bg-amber-400 hover:text-slate-950 hover:border-amber-500'
            }`}
            aria-label="Xem khóa học kế tiếp"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Courses: Trên điện thoại mỗi khung hiển thị đúng 1 khóa (w-full min-w-full snap-start), Lưới 4 cột trên Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScrollEvent}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-3 sm:pb-0 no-scrollbar"
        >
          {courses.map((course, idx) => {
            const isHiddenOnDesktop = !isExpanded && idx >= INITIAL_LIMIT
            return (
              <div
                key={course.id}
                className={`w-full min-w-full shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink flex flex-col ${
                  isHiddenOnDesktop ? 'sm:hidden' : ''
                }`}
              >
                <CourseCard
                  course={course}
                  onSelectCourse={onSelectCourse}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Button Xem thêm nếu có nhiều hơn 8 khóa học (Chỉ hiện trên Desktop, ẩn hoàn toàn trên điện thoại) */}
      {hasMore && (
        <div className="hidden sm:flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-3.5 bg-white hover:bg-amber-50 text-slate-900 hover:text-amber-950 font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-slate-300 hover:border-amber-500 shadow-sm transition-all flex items-center gap-2.5 rounded-none active:scale-98 cursor-pointer"
          >
            <span>
              {isExpanded
                ? t('courses.collapse')
                : t('courses.viewMore', { count: courses.length - INITIAL_LIMIT })}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-600" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
