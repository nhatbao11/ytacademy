import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from './components/layout/Navbar'
import { HeroSection } from './components/layout/HeroSection'
import { CategoryTabs } from './features/courses/components/CategoryTabs'
import { CourseGrid } from './features/courses/components/CourseGrid'
import { CourseDetailPage } from './features/courses/components/CourseDetailPage'
import { CartDrawer } from './features/cart/components/CartDrawer'
import { ActivationModal } from './features/activation/components/ActivationModal'
import { AuthModal } from './features/auth/components/AuthModal'
import { CoreValuesSection } from './components/layout/CoreValuesSection'
import { Footer } from './components/layout/Footer'
import { FloatingContactWidget } from './components/common/FloatingContactWidget'
import { CountdownWidget } from './components/common/CountdownWidget'
import { MyCoursesView } from './features/learning/components/MyCoursesView'
import { ClassroomView } from './features/learning/components/ClassroomView'
import { mockEnrolledCourses } from './features/learning/learningData'
import { useCourses } from './features/courses/useCourses'
import { useCartStore } from './features/cart/cartStore'
import { useAuthStore } from './features/auth/authStore'
import type { ICourse } from './types'
import type { IEnrolledCourse } from './features/learning/types'

export function App() {
  const { t } = useTranslation()
  const {
    courses,
    allCourses,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useCourses()

  const { addToCart, openCart } = useCartStore()
  const {
    isLoggedIn,
    enrolledCourseIds,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
  } = useAuthStore()

  // App Navigation View: 'home' (Slide 1) | 'course-detail' (Slide 2 - chi tiết giới thiệu) | 'my-courses' | 'classroom'
  const [currentView, setCurrentView] = useState<'home' | 'course-detail' | 'my-courses' | 'classroom'>('home')
  const [selectedEnrolledCourse, setSelectedEnrolledCourse] = useState<IEnrolledCourse>(mockEnrolledCourses[0])
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null)

  const [isActivationOpen, setIsActivationOpen] = useState(false)

  const handleSelectCourseToDetail = (course: ICourse) => {
    setSelectedCourse(course)
    setCurrentView('course-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEnterClassroom = (enrolled: IEnrolledCourse) => {
    setSelectedEnrolledCourse(enrolled)
    setCurrentView('classroom')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Header (with navigation to Home & My Courses) */}
      <Navbar
        currentView={currentView}
        onNavigateView={(view) => {
          setCurrentView(view)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenAuth={(mode) => openAuthModal(mode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1">
        {/* VIEW 1: TRANG CHỦ BÁN KHÓA HỌC (Slide 1 BISC) */}
        {currentView === 'home' && (
          <>
            {/* Photographic Workspace Hero with focused search */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectCategory={setSelectedCategory}
              onOpenActivation={() => setIsActivationOpen(true)}
              onOpenAuth={(mode) => openAuthModal(mode)}
              onRegisterNow={() => {
                const el = document.getElementById('courses-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            />

            {/* Course Catalog (With distinct textured accent background to make cards pop) */}
            <section
              id="courses-section"
              className="w-full bg-[#EEF2F6] pt-14 pb-10 border-t-2 border-slate-300/80 relative"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                backgroundSize: '20px 20px',
              }}
            >
              {/* Top ambient warm accent glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 bg-amber-400/15 blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Daily Flash Sale Countdown Banner (-15%) */}
                <div className="mb-6">
                  <CountdownWidget variant="banner" />
                </div>

                {/* Course Header - Tinh gọn chuẩn BISC Online */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-300">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      {t('courses.programTitle')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] uppercase tracking-tight">
                      {t('courses.catalogTitle')}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        openAuthModal('login', 'auth.loginToViewMyCourses', () => {
                          setCurrentView('my-courses')
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        })
                        return
                      }
                      setCurrentView('my-courses')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 transition-colors flex items-center gap-1.5 shrink-0 rounded-none shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>{t('nav.myCourses')} →</span>
                  </button>
                </div>

                {/* Category Filter Tabs */}
                <div className="mb-6">
                  <CategoryTabs
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    totalCount={allCourses.length}
                  />
                </div>

                {/* Course Cards Grid */}
                <CourseGrid
                  courses={courses}
                  loading={loading}
                  onSelectCourse={handleSelectCourseToDetail}
                  onResetFilter={() => {
                    setSelectedCategory('all')
                    setSearchQuery('')
                  }}
                />
              </div>
            </section>

            {/* 4 GIÁ TRỊ CỐT LÕI KHI HỌC TẠI YT ACADEMY */}
            <CoreValuesSection
              onConsultRoute={() => {
                const el = document.getElementById('courses-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          </>
        )}

        {/* VIEW 2: TRANG CHI TIẾT & GIỚI THIỆU KHÓA HỌC (Exact match to Slide 2 BISC Detail) */}
        {currentView === 'course-detail' && selectedCourse && (
          <CourseDetailPage
            course={selectedCourse}
            isEnrolled={isLoggedIn && enrolledCourseIds.includes(selectedCourse.id)}
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSelectRelatedCourse={(c) => {
              setSelectedCourse(c)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onEnrollNow={(c) => {
              addToCart(c)
              openCart()
            }}
            onGoToClassroom={() => {
              const enrolled = mockEnrolledCourses.find((e) => e.course.id === selectedCourse.id) || mockEnrolledCourses[0]
              handleEnterClassroom(enrolled)
            }}
          />
        )}

        {/* VIEW 3: KHÓA HỌC CỦA TÔI (Slide 2 - Learning portal) */}
        {currentView === 'my-courses' && (
          <MyCoursesView
            onEnterClassroom={handleEnterClassroom}
            onViewDetail={(item) => handleSelectCourseToDetail(item.course)}
            onGoToStore={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 4: PHÒNG HỌC & ĐỀ CƯƠNG TRỰC TUYẾN (Slides 3, 4, 5) */}
        {currentView === 'classroom' && (
          <ClassroomView
            enrolledCourse={selectedEnrolledCourse}
            onBack={() => setCurrentView('my-courses')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer />

      <ActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
      />

      {/* Floating Contact Widget (Zalo + Hotline với hiệu ứng rung lắc & bóng thoại tư vấn) */}
      <FloatingContactWidget />
    </div>
  )
}

export default App
