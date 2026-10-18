import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayCircle, Clock, BookOpen, Lock, LogIn } from 'lucide-react'
import { mockEnrolledCourses } from '../learningData'
import { mockCourses } from '../../courses/courseService'
import { useAuthStore } from '../../auth/authStore'
import type { IEnrolledCourse } from '../types'

interface MyCoursesViewProps {
  onEnterClassroom: (enrolled: IEnrolledCourse) => void
  onViewDetail: (enrolled: IEnrolledCourse) => void
  onGoToStore: () => void
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  onEnterClassroom,
  onViewDetail,
  onGoToStore,
}) => {
  const { t } = useTranslation()
  const { isLoggedIn, enrolledCourseIds, openAuthModal } = useAuthStore()
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')

  // Nếu chưa đăng nhập: Yêu cầu đăng nhập trước khi xem khóa học
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-100/70 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 border border-slate-200 text-center space-y-4 rounded-none shadow-sm">
          <div className="w-14 h-14 bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto rounded-none">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">
              {t('auth.requireLoginTitle')}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('auth.requireLoginDesc')}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('auth.loginActionBtn')}</span>
            </button>

            <button
              type="button"
              onClick={onGoToStore}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-none transition-colors cursor-pointer"
            >
              {t('cart.exploreCourses')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tạo danh sách các khóa học đã đăng ký dựa trên enrolledCourseIds
  const userEnrolledCourses: IEnrolledCourse[] = enrolledCourseIds
    .map((id) => {
      const existing = mockEnrolledCourses.find((e) => e.course.id === id)
      if (existing) return existing

      const course = mockCourses.find((c) => c.id === id)
      if (!course) return null

      return {
        id: `enrolled-${course.id}`,
        course,
        status: 'active' as const,
        expireDate: '31/12/2026',
        completedLessons: 0,
        totalLessons: course.chapters?.length || course.lessonsCount || 20,
        progressPercent: 0,
      }
    })
    .filter((item): item is IEnrolledCourse => item !== null)

  const filtered = userEnrolledCourses.filter((item) => {
    if (filter === 'active') return item.status === 'active'
    if (filter === 'expired') return item.status === 'expired'
    return true
  })

  return (
    <div className="bg-slate-100/70 min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('myCourses.title')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('myCourses.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToStore}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-none transition-colors cursor-pointer"
            >
              {t('myCourses.enrollNew')}
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          {[
            { id: 'all', label: t('myCourses.tabAll') },
            { id: 'active', label: t('myCourses.tabActive') },
            { id: 'expired', label: t('myCourses.tabExpired') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-none transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#0B2545] text-amber-400'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses List */}
        {filtered.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 border border-slate-200 text-center space-y-3 rounded-none shadow-2xs">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center mx-auto rounded-none">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t('myCourses.emptyCategoryCoursesTitle')}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('myCourses.emptyCategoryCoursesDesc')}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToStore}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none transition-colors cursor-pointer"
              >
                {t('cart.exploreCourses')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const isExpired = item.status === 'expired'

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-none p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
                >
                  {/* Expired Ribbon Stamp */}
                  {isExpired && (
                    <div className="absolute top-2 right-2 md:top-auto md:left-28 z-10 select-none">
                      <span className="inline-block px-2.5 py-0.5 rounded-none border border-red-500 text-red-600 font-black text-[11px] uppercase tracking-wider bg-red-50 rotate-[-12deg] shadow-xs">
                        {t('myCourses.expiredBadge')}!
                      </span>
                    </div>
                  )}

                  {/* Left: Thumbnail & Course Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-36 aspect-video rounded-none overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-full h-full object-cover rounded-none"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 inline-block uppercase">
                        {item.course.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                        {item.course.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <img
                            src={item.course.instructor.avatar}
                            alt={item.course.instructor.name}
                            className="w-4 h-4 object-cover object-top border border-slate-300 rounded-none shrink-0"
                          />
                          <span>{item.course.instructor.name}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t('myCourses.expiresOn')}: {item.expireDate}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-1.5 flex items-center gap-3 max-w-xs">
                        <div className="flex-1 bg-slate-100 rounded-none h-2 overflow-hidden border border-slate-200">
                          <div
                            className="bg-emerald-500 h-full rounded-none transition-all duration-500"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 shrink-0">
                          {item.completedLessons}/{item.totalLessons} {t('myCourses.lessonsDone')} ({item.progressPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions Buttons */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => onEnterClassroom(item)}
                      className="flex-1 md:flex-initial px-4 py-2 rounded-none text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>▶ {t('myCourses.enterClass')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetail(item)}
                      className="flex-1 md:flex-initial px-4 py-2 rounded-none text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t('myCourses.viewDetail')}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
