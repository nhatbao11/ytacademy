import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayCircle, Clock, BookOpen } from 'lucide-react'
import { mockEnrolledCourses } from '../learningData'
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
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')

  const filtered = mockEnrolledCourses.filter((item) => {
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
                    <div className="absolute inset-0 bg-slate-950/30" />
                    <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded-none bg-black/60 text-amber-300 text-[10px] font-bold">
                      {item.course.categoryName}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                      {item.course.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.course.instructor.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('myCourses.expiresOn')}: {item.expireDate}</span>
                      </span>
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
      </div>
    </div>
  )
}
