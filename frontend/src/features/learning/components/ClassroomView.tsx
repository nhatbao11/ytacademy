import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CheckCircle2,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  BookOpen,
} from 'lucide-react'
import { mockSyllabusChapters } from '../learningData'
import type { IEnrolledCourse } from '../types'

interface ClassroomViewProps {
  enrolledCourse: IEnrolledCourse
  onBack: () => void
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  enrolledCourse,
  onBack,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'qa' | 'announcements'>('overview')
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    'chap-0': true,
    'chap-1': true,
  })
  const [currentLesson, setCurrentLesson] = useState(mockSyllabusChapters[1].lessons[0])
  const [reviewStars, setReviewStars] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const toggleChapter = (chapId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapId]: !prev[chapId] }))
  }

  const handleSelectLesson = (lesson: any) => {
    setCurrentLesson(lesson)
    setActiveTab('lessons')
  }

  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    setReviewSubmitted(true)
    setTimeout(() => {
      setReviewSubmitted(false)
      reviewText && setReviewText('')
    }, 2000)
  }

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Top Banner (Exact match to Slide 3 & 4) */}
      <div className="bg-[#07172C] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('classroom.back')}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Course thumbnail & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-28 sm:w-36 aspect-video rounded-none overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                <img
                  src={enrolledCourse.course.thumbnail}
                  alt={enrolledCourse.course.title}
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {enrolledCourse.course.categoryName}
                </span>
                <h1 className="text-lg sm:text-2xl font-black text-white">
                  {enrolledCourse.course.title}
                </h1>
                <p className="text-xs text-slate-400">
                  {t('classroom.lecturer')}: <span className="text-slate-200 font-semibold">{enrolledCourse.course.instructor.name}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('lessons')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors mt-1 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{t('classroom.startLearning')}</span>
                </button>
              </div>
            </div>

            {/* Progress Container (Exact match to Slide 3/4) */}
            <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-none max-w-sm w-full space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-semibold">
                <span>{t('classroom.progressTitle')}</span>
                <span className="text-amber-400 font-bold">{enrolledCourse.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-none h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full rounded-none transition-all duration-500"
                  style={{ width: `${enrolledCourse.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {t('classroom.completedCount', {
                  completed: enrolledCourse.completedLessons,
                  total: enrolledCourse.totalLessons,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Exact match to Slide 3 & 4) */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: t('classroom.tabOverview') },
            { id: 'lessons', label: t('classroom.tabLessons') },
            { id: 'qa', label: t('classroom.tabQA') },
            { id: 'announcements', label: t('classroom.tabAnnouncements') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600 bg-amber-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: TỔNG QUAN (Exact match to Slide 3 & 4) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Nội dung khóa học (Curriculum Chapters Accordion) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-none p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <span>{t('classroom.syllabus')}</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold">
                    {mockSyllabusChapters.length} {t('courseDetail.chaptersCount')} • 45 {t('courses.lessons')}
                  </span>
                </div>

                {/* Chapters Accordions */}
                <div className="space-y-2.5">
                  {mockSyllabusChapters.map((chap) => {
                    const isOpen = !!openChapters[chap.id]
                    return (
                      <div
                        key={chap.id}
                        className="border border-slate-200 rounded-none overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleChapter(chap.id)}
                          className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left text-xs sm:text-sm font-bold text-slate-800 transition-colors cursor-pointer"
                        >
                          <span>{chap.title}</span>
                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-[11px] font-normal">{chap.lessons.length} {t('courses.lessons')}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {chap.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => handleSelectLesson(lesson)}
                                className="w-full flex items-center justify-between p-3 hover:bg-amber-50/60 text-left text-xs transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  {lesson.isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0" />
                                  )}
                                  <span className={`font-medium ${lesson.isCompleted ? 'text-slate-700' : 'text-slate-900'}`}>
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                                  {lesson.duration}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right 1 Column: Giảng viên & Đánh giá khóa học (Slide 3 & 4) */}
            <div className="space-y-6">
              {/* Giảng viên card */}
              <div className="bg-white rounded-none p-5 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                  {t('classroom.instructorProfile')}
                </h3>
                <div className="flex items-center gap-3.5">
                  <img
                    src={enrolledCourse.course.instructor.avatar}
                    alt={enrolledCourse.course.instructor.name}
                    className="w-14 h-14 rounded-none object-cover ring-2 ring-amber-400/40"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {enrolledCourse.course.instructor.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {enrolledCourse.course.instructor.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {enrolledCourse.course.instructor.experience}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-none transition-colors cursor-pointer"
                >
                  {t('classroom.viewInstructor')}
                </button>
              </div>

              {/* Đánh giá khóa học card (Exact match to Slide 3 & 4) */}
              <div className="bg-white rounded-none p-5 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                  {t('classroom.courseEvaluation')}
                </h3>

                <form onSubmit={handleSendReview} className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-600 block mb-1">{t('classroom.satisfactionLevel')}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewStars(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t('classroom.reviewPlaceholder')}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-none focus:border-amber-400 focus:bg-white outline-none"
                    />
                  </div>

                  {reviewSubmitted ? (
                    <div className="p-2.5 rounded-none bg-emerald-50 text-emerald-700 text-xs text-center font-bold">
                      {t('classroom.reviewSuccess')}
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('classroom.sendReview')}</span>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BÀI HỌC & TÀI LIỆU (Classroom Video Player - Exact match to Slide 5) */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Split Screen Video Classroom Player (Exact visual match to Slide 5) */}
            <div className="bg-slate-900 rounded-none overflow-hidden shadow-2xl border border-slate-800">
              {/* Player Screen */}
              <div className="relative min-h-[460px] md:min-h-0 md:aspect-video w-full bg-slate-950 flex flex-col md:flex-row overflow-hidden">
                {/* Left Side: Video of Instructor on Whiteboard */}
                <div className="relative flex-1 bg-slate-900 border-r border-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                    alt="Giảng viên giảng dạy"
                    className="w-full h-full object-cover opacity-85 rounded-none"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-none bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-none bg-red-500 animate-pulse" />
                    <span>{t('classroom.liveClassBadge')}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-none bg-black/70 text-amber-300 text-xs font-bold">
                    {enrolledCourse.course.instructor.name}
                  </div>
                </div>

                {/* Right Side: Electronic Slide / Notes */}
                <div className="flex-1 bg-white p-6 sm:p-10 flex flex-col justify-between select-none">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase">YT ACADEMY TRAINING</span>
                      <span className="text-xs font-bold text-amber-600">ACCA PM / F5</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-600 block">CHAPTER 1</span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        MANAGING INFORMATION
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t('classroom.lecturer')}: {enrolledCourse.course.instructor.name}
                      </p>
                    </div>
                    <div className="pt-4 space-y-2 text-xs text-slate-700">
                      <div className="font-bold text-slate-900">0. TABLE OF CONTENT:</div>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                        <li>1.1. Sources of management information</li>
                        <li>1.2. Big Data & 4Vs in strategic decisions</li>
                        <li>1.3. Information systems and internal controls</li>
                        <li>1.4. Practice Question & Exam technique</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>© ytacademy.com.vn</span>
                    <span>1 / 18</span>
                  </div>
                </div>
              </div>

              {/* Bottom Player Navigation Controls (Exact match to Slide 5 bottom red box) */}
              <div className="p-3.5 bg-[#07172C] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-3 py-1.5 rounded-none bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
                  >
                    ☰ {t('classroom.syllabusList')}
                  </button>
                  <span className="text-slate-400 hidden sm:inline">
                    {t('classroom.currentLesson')}: <strong className="text-white">{currentLesson.title}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-none bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{t('classroom.prevLesson')}</span>
                  </button>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-none bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('classroom.nextLesson')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('classroom.pdfDocument')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Q&A / HỎI ĐÁP */}
        {activeTab === 'qa' && (
          <div className="bg-white rounded-none p-6 border border-slate-200 max-w-3xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t('classroom.qaForum')}</h3>
            <p className="text-xs text-slate-500">
              {t('classroom.qaForumDesc')}
            </p>
            <div className="space-y-3 pt-3">
              <textarea
                rows={3}
                placeholder={t('classroom.qaPlaceholder')}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-none outline-none focus:border-amber-400"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[#0B2545] text-amber-400 font-bold text-xs rounded-none cursor-pointer"
              >
                {t('classroom.sendQuestion')}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: THÔNG BÁO */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-none p-6 border border-slate-200 max-w-3xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t('classroom.announcementsTitle')}</h3>
            <div className="p-4 rounded-none bg-amber-50 border border-amber-200 text-xs text-slate-800 space-y-1">
              <div className="font-bold text-amber-900">{t('classroom.announcement1Title')}</div>
              <p>{t('classroom.announcement1Content')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
