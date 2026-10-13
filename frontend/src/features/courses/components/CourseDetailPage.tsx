import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Clock,
  BookOpen,
  Infinity,
  Smartphone,
  CheckCircle2,
  ShoppingCart,
  Send,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BadgeCheck,
} from 'lucide-react'
import type { ICourse, ICourseReview } from '../../../types'
import { formatCurrency } from '../../../utils/format'
import { useCartStore } from '../../cart/cartStore'
import { mockCourses } from '../courseService'

interface CourseDetailPageProps {
  course: ICourse
  onBackToHome: () => void
  onSelectRelatedCourse: (c: ICourse) => void
  onEnrollNow: (c: ICourse) => void
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  onBackToHome,
  onSelectRelatedCourse,
  onEnrollNow,
}) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const { addToCart, items } = useCartStore()

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('intro')
  const isManualScrollingRef = useRef(false)
  const manualScrollTimerRef = useRef<number | null>(null)

  // Accordion chapters
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    'fa-chap-1': true,
    'fa-chap-2': true,
    'rev-chap-1': true,
    'rev-chap-2': true,
  })

  // Reviews state (từng khóa học có danh sách nhận xét riêng)
  const [reviewsList, setReviewsList] = useState<ICourseReview[]>(course.reviews || [])
  const [userStars, setUserStars] = useState(5)
  const [userName, setUserName] = useState('')
  const [userReview, setUserReview] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Sync reviews when course changes
  useEffect(() => {
    setReviewsList(course.reviews || [])
  }, [course])

  // Scroll-spy: Khi người dùng lướt xuống, tab tương ứng trên thanh sticky sẽ tự động sáng chính xác
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrollingRef.current) return

      const sectionIds = ['intro', 'curriculum', 'instructor', 'reviews', 'related']

      // Nếu cuộn gần hết trang, tự động kích hoạt mục cuối cùng
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveTab('related')
        return
      }

      // Ngưỡng tính toán vị trí theo viewport (thanh sticky nằm ở top 64px, cao ~45px)
      const threshold = 170
      let currentActive = 'intro'

      for (const id of sectionIds) {
        const el = document.getElementById(`sec-${id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= threshold) {
            currentActive = id
          }
        }
      }

      setActiveTab(currentActive)
    }

    // Đồng bộ ngay khi vừa render
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current)
    }
  }, [])

  // Nhấn vào tab để cuộn mượt đến đúng phần đó
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    isManualScrollingRef.current = true
    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current)
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false
    }, 800)

    const el = document.getElementById(`sec-${tabId}`)
    if (el) {
      const yOffset = -120 // Header height + sticky tabs height + padding
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      })
    }
  }

  const isInCart = items.some((item) => item.course.id === course.id)

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddToCart = () => {
    addToCart(course)
  }

  // Gửi nhận xét mới (thêm ngay vào danh sách đánh giá của khóa học)
  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userReview.trim()) return

    const newRev: ICourseReview = {
      id: `rev-${Date.now()}`,
      userName: userName.trim() || (currentLang === 'en' ? 'Verified Student' : 'Học viên ACCA'),
      userRole: currentLang === 'en' ? 'Verified Learner' : 'Học viên khóa học',
      rating: userStars,
      date: new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : 'vi-VN'),
      comment: userReview.trim(),
    }

    setReviewsList([newRev, ...reviewsList])
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setUserReview('')
      setUserName('')
    }, 2500)
  }

  // Tính điểm đánh giá trung bình & tỷ lệ sao
  const totalStars = reviewsList.reduce((acc, r) => acc + r.rating, 0)
  const avgRating = reviewsList.length > 0 ? (totalStars / reviewsList.length).toFixed(1) : '5.0'

  const count5 = reviewsList.filter((r) => r.rating === 5).length
  const count4 = reviewsList.filter((r) => r.rating === 4).length
  const count3 = reviewsList.filter((r) => r.rating === 3).length
  const totalCount = reviewsList.length || 1

  const pct5 = Math.round((count5 / totalCount) * 100)
  const pct4 = Math.round((count4 / totalCount) * 100)
  const pct3 = Math.round((count3 / totalCount) * 100)

  const relatedCourses = mockCourses.filter((c) => c.id !== course.id).slice(0, 4)

  return (
    <div className="bg-slate-50 min-h-screen pb-28 lg:pb-20">
      {/* Top Banner (Góc vuông, tông tối - Chuẩn Slide 2) */}
      <div className="bg-[#0B2545] text-white py-8 sm:py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 pb-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 rounded-none cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('courseDetail.backHome')}</span>
            </button>
            <span>&gt;</span>
            <span className="text-amber-400 font-semibold">{course.categoryName}</span>
            <span>&gt;</span>
            <span className="text-slate-400 truncate max-w-[120px] sm:max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Header Info */}
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 rounded-none">
                {t('courseDetail.intlQualification')} • {course.levelName}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {course.targetAudience}
              </p>

              {/* Instructor & Rating Meta row */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-7 h-7 object-cover object-top border border-amber-400 rounded-none"
                  />
                  <span className="font-bold text-white hover:text-amber-300 transition-colors">
                    {course.instructor.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">{avgRating}</span>
                  <span className="text-slate-400">
                    ({reviewsList.length} {t('courses.reviews')})
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>0 {t('courseDetail.studentsCount')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Layout: Left Content & Right Sticky Sidebar (Góc vuông) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
          {/* LEFT COLUMN: Course Tabs & Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Sticky Navigation Tabs (Phù hợp trên cả Mobile & Desktop, hiển thị đầy đủ 5 mục không bị khuất trên điện thoại) */}
            <div className="bg-white/95 backdrop-blur-xs border-2 border-slate-300 p-1 sticky top-14 sm:top-16 z-30 grid grid-cols-5 gap-1 sm:flex sm:items-center sm:gap-1.5 rounded-none shadow-md -mx-2 sm:mx-0 px-1 sm:px-1">
              {[
                {
                  id: 'intro',
                  shortLabel: t('courseDetail.tabIntroShort'),
                  fullLabel: t('courseDetail.tabIntro'),
                },
                {
                  id: 'curriculum',
                  shortLabel: t('courseDetail.tabCurriculumShort'),
                  fullLabel: t('courseDetail.tabCurriculum'),
                },
                {
                  id: 'instructor',
                  shortLabel: t('courseDetail.tabInstructorShort'),
                  fullLabel: t('courseDetail.tabInstructor'),
                },
                {
                  id: 'reviews',
                  shortLabel: t('courseDetail.tabReviewsShort'),
                  fullLabel: `${t('courseDetail.tabReviews')} (${reviewsList.length})`,
                },
                {
                  id: 'related',
                  shortLabel: t('courseDetail.tabRelatedShort'),
                  fullLabel: t('courseDetail.tabRelated'),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`py-2 px-0.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider text-center transition-all rounded-none cursor-pointer border-b-2 flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-[#0B2545] text-amber-400 border-amber-400 shadow-xs'
                      : 'text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={tab.fullLabel}
                >
                  <span className="sm:hidden truncate">{tab.shortLabel}</span>
                  <span className="hidden sm:inline whitespace-nowrap">{tab.fullLabel}</span>
                </button>
              ))}
            </div>

            {/* SECTION 1: "Bạn sẽ học được gì" & Giới thiệu khóa học */}
            <div id="sec-intro" className="space-y-6 scroll-mt-32">
              <div className="bg-white p-6 sm:p-7 border border-slate-300 rounded-none space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                  {t('courseDetail.whatYouWillLearn')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t('courseDetail.afterCourseDesc')}
                </p>

                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 4 Giá trị cốt lõi khi học tại YT Academy */}
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 space-y-2.5 rounded-none">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('courseDetail.coreValuesBoxTitle')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <strong className="text-amber-600 font-mono">01.</strong>
                      <span><strong>{t('coreValues.v1Title')}:</strong> {t('courseDetail.v1Short')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <strong className="text-amber-600 font-mono">02.</strong>
                      <span><strong>{t('coreValues.v2Title')}:</strong> {t('courseDetail.v2Short')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <strong className="text-amber-600 font-mono">03.</strong>
                      <span><strong>{t('coreValues.v3Title')}:</strong> {t('courseDetail.v3Short')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <strong className="text-amber-600 font-mono">04.</strong>
                      <span><strong>{t('coreValues.v4Title')}:</strong> {t('courseDetail.v4Short')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Giới thiệu khóa học */}
              <div className="bg-white p-6 sm:p-7 border border-slate-300 rounded-none space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                  {t('courseDetail.courseIntro')}
                </h2>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 font-normal">
                  <p>{course.fullDescription}</p>
                  <p className="text-slate-600">
                    {t('courseDetail.diplomaNotice')}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: "Nội dung khóa học" (Curriculum Accordion - Góc vuông) */}
            <div id="sec-curriculum" className="bg-white p-6 sm:p-7 border border-slate-300 rounded-none space-y-4 scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                    {t('courseDetail.curriculumTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.chapters.length > 0 ? course.chapters.length : 12} {t('courseDetail.chaptersCount')} • {course.lessonsCount} {t('courseDetail.lessonsCount')} • {t('courseDetail.duration')} {course.durationHours}
                  </p>
                </div>
              </div>

              {/* Chapters list (Góc vuông) */}
              <div className="space-y-2">
                {course.chapters.length > 0 ? (
                  course.chapters.map((chap) => {
                    const isOpen = !!openChapters[chap.id]
                    return (
                      <div
                        key={chap.id}
                        className="border border-slate-300 rounded-none overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleChapter(chap.id)}
                          className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left text-xs sm:text-sm font-bold text-slate-900 transition-colors rounded-none cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{chap.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 shrink-0 ml-2">
                            <span className="text-[11px] font-normal text-slate-500">
                              {chap.lessonsCount} {t('courses.lessons')} {chap.totalDuration && `• ${chap.totalDuration}`}
                            </span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && chap.lessons && (
                          <div className="divide-y divide-slate-200 bg-white">
                            {chap.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 pl-6 text-xs text-slate-800 hover:bg-amber-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{lesson.title}</span>
                                </div>
                                <span className="text-[11px] text-slate-400">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-300 text-xs text-slate-700 rounded-none">
                    {t('courseDetail.syllabusStandard')}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: "Thông tin giảng viên" */}
            <div id="sec-instructor" className="bg-white p-6 sm:p-7 border border-slate-300 rounded-none space-y-4 scroll-mt-32">
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                {t('courseDetail.instructorTitle')}
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-slate-50 border border-slate-300 rounded-none">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover object-top border-2 border-amber-400 rounded-none shrink-0"
                />

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-xs font-bold text-amber-700">
                    {course.instructor.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {course.instructor.experience}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>0 {t('courseDetail.studentsCount')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>5 {t('courseDetail.coursesCount')}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: "Học viên đánh giá" (Có đầy đủ danh sách nhận xét thực tế từng môn) */}
            <div id="sec-reviews" className="bg-white p-6 sm:p-7 border border-slate-300 rounded-none space-y-6 scroll-mt-32">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                  {t('courseDetail.studentReviews')} ({reviewsList.length})
                </h2>
                <span className="text-xs font-bold text-amber-600">
                  ★ {avgRating} / 5.0
                </span>
              </div>

              {/* Tổng quan xếp hạng sao */}
              <div className="flex flex-col sm:flex-row items-center gap-8 p-5 bg-slate-50 border border-slate-300 rounded-none">
                <div className="text-center sm:border-r sm:border-slate-300 sm:pr-8 shrink-0">
                  <div className="text-5xl font-black text-[#0B2545] leading-none">
                    {avgRating}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 py-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {reviewsList.length} {t('courses.reviews')}
                  </div>
                </div>

                {/* Star bars */}
                <div className="flex-1 space-y-2 w-full text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">5 {t('courses.stars')}</span>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-none overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-none" style={{ width: `${pct5}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700">{pct5}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">4 {t('courses.stars')}</span>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-none overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-none" style={{ width: `${pct4}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700">{pct4}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">3 {t('courses.stars')}</span>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-none overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-none" style={{ width: `${pct3}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-700">{pct3}%</span>
                  </div>
                </div>
              </div>

              {/* Danh sách các bài đánh giá của học viên */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-2 border-slate-200">
                  Nhận xét từ học viên ({reviewsList.length})
                </h3>

                {reviewsList.length > 0 ? (
                  <div className="space-y-3">
                    {reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-slate-50/70 border border-slate-200 rounded-none space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar tròn với chữ cái đầu */}
                            <div className="w-9 h-9 rounded-none bg-[#0B2545] text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                              {rev.userName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {rev.userName}
                                </h4>
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-none">
                                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                  <span>{currentLang === 'en' ? 'Verified' : 'Đã học'}</span>
                                </span>
                              </div>
                              {rev.userRole && (
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {rev.userRole}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-0.5 text-amber-400 justify-end">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    {t('courseDetail.noReviewsYet')}
                  </p>
                )}
              </div>

              {/* Form gửi đánh giá học viên mới */}
              <form onSubmit={handleSendReview} className="space-y-3 pt-4 border-t border-slate-200">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
                  {t('courseDetail.writeReview')}
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600">Đánh giá của bạn:</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserStars(s)}
                        className="p-0.5 hover:scale-110 cursor-pointer"
                        title={`${s} sao`}
                      >
                        <Star className={`w-5 h-5 ${s <= userStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Họ và tên của bạn (Ví dụ: Nguyễn Văn A)"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-none focus:border-amber-500 focus:bg-white outline-none"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder={t('courseDetail.writeReviewPlaceholder')}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-none focus:border-amber-500 focus:bg-white outline-none"
                />

                {isSubmitted ? (
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-none text-xs font-bold border border-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('courseDetail.reviewSuccess')}</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 uppercase tracking-wider transition-colors flex items-center gap-1.5 rounded-none cursor-pointer shadow-xs active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('courseDetail.submitReview')}</span>
                  </button>
                )}
              </form>
            </div>

            {/* SECTION 5: "Khóa học liên quan" (Giao diện lớn, rõ nét, dễ xem) */}
            <div id="sec-related" className="bg-white p-6 sm:p-8 border border-slate-300 rounded-none space-y-6 scroll-mt-32">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-6 bg-amber-400 rounded-none shrink-0" />
                  <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-wide">
                    {t('courseDetail.relatedCourses')}
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {relatedCourses.length} {t('courseDetail.coursesCount')}
                </span>
              </div>

              <div className="space-y-4">
                {relatedCourses.map((rc) => (
                  <div
                    key={rc.id}
                    onClick={() => {
                      onSelectRelatedCourse(rc)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-4 sm:p-5 border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 hover:shadow-md transition-all duration-200 cursor-pointer group rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    {/* Left: Thumbnail & Course Information */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0 w-full md:w-auto">
                      {/* Big clear Thumbnail (16:9 ratio vector preview) */}
                      <div className="relative w-full sm:w-52 md:w-60 aspect-video shrink-0 overflow-hidden bg-slate-900 border border-slate-300 rounded-none shadow-sm">
                        <img
                          src={rc.thumbnail}
                          alt={rc.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
                          loading="lazy"
                          decoding="async"
                        />
                        {rc.discountPercent > 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white font-black text-xs shadow-sm rounded-none">
                            -{rc.discountPercent}%
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/85 text-amber-300 text-[11px] font-bold flex items-center gap-1 rounded-none shadow-sm border border-white/10">
                          <PlayCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{rc.lessonsCount} {t('courses.videos')}</span>
                        </span>
                      </div>

                      {/* Course details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-200 uppercase tracking-wide rounded-none">
                            {rc.levelName || rc.categoryName}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                          {rc.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 pt-0.5">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <img
                              src={rc.instructor.avatar}
                              alt={rc.instructor.name}
                              className="w-5 h-5 object-cover object-top border border-slate-300 rounded-none shrink-0"
                            />
                            <span>{rc.instructor.name}</span>
                          </div>

                          <span className="text-slate-300">•</span>

                          <span className="text-slate-500">
                            0 {t('courseDetail.studentsCount')}
                          </span>

                          <span className="text-slate-300">•</span>

                          <div className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{rc.rating > 0 ? rc.rating.toFixed(1) : '5.0'}</span>
                            <span className="text-slate-500 font-normal">
                              ({rc.reviewCount || rc.reviews?.length || 2} {t('courses.reviews')})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & CTA Button */}
                    <div className="w-full md:w-auto md:text-right shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div>
                        {rc.originalPrice > rc.salePrice && (
                          <div className="text-xs sm:text-sm text-slate-400 line-through">
                            {formatCurrency(rc.originalPrice, currentLang)}
                          </div>
                        )}
                        <div className="text-base sm:text-xl font-black text-[#0B2545]">
                          {formatCurrency(rc.salePrice, currentLang)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2545] group-hover:bg-amber-500 text-white group-hover:text-slate-950 font-bold text-xs uppercase tracking-wide transition-colors rounded-none shadow-sm">
                          <span>{t('courseDetail.viewDetail')}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Purchase Sidebar (Góc vuông sắc sảo - Chuẩn Slide 2) */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 z-10 space-y-4">
            <div className="bg-white border border-slate-300 shadow-md p-5 space-y-5 rounded-none">
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-900 rounded-none">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-none"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white font-black text-xs rounded-none">
                  -{course.discountPercent}%
                </span>
              </div>

              {/* Pricing Box */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">
                    {formatCurrency(course.salePrice, currentLang)}
                  </span>
                  {course.originalPrice > course.salePrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(course.originalPrice, currentLang)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons (Góc vuông) */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onEnrollNow(course)}
                  className="w-full py-3.5 px-4 font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-98 rounded-none cursor-pointer"
                >
                  {t('courseDetail.enrollNow')}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border rounded-none cursor-pointer ${
                    isInCart
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-[#0B2545] hover:bg-[#133966] text-amber-400 border-[#0B2545] shadow-xs active:scale-98'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isInCart ? t('courseDetail.inCartBtn') : t('courseDetail.addToCartBtn')}</span>
                </button>
              </div>

              {/* Features List */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{t('courseDetail.duration')}: <strong className="text-slate-900">{course.durationHours}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{t('courseDetail.curriculumTitle')}: <strong className="text-slate-900">{course.lessonsCount} {t('courseDetail.lessonsCount')}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Infinity className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{t('courseDetail.lifetimeAccess')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{t('courseDetail.allDevices')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR (Tối ưu trải nghiệm mua trên Mobile & Tablet <lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-slate-300 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-[#0B2545]">
              {formatCurrency(course.salePrice, currentLang)}
            </span>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 border border-red-200">
              -{course.discountPercent}%
            </span>
          </div>
          {course.originalPrice > course.salePrice && (
            <span className="text-[10px] text-slate-400 line-through block">
              {formatCurrency(course.originalPrice, currentLang)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`p-2.5 border transition-all rounded-none cursor-pointer ${
              isInCart
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-[#0B2545] border-slate-300 hover:bg-slate-200'
            }`}
            title={isInCart ? t('courseDetail.inCartBtn') : t('courseDetail.addToCartBtn')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEnrollNow(course)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all rounded-none cursor-pointer shadow-md active:scale-95"
          >
            {t('courseDetail.enrollNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
