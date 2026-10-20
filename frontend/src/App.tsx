import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
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
import { mockCourses } from './features/courses/courseService'
import { useCartStore } from './features/cart/cartStore'
import { useAuthStore } from './features/auth/authStore'
import { SEOHelmet } from './components/common/SEOHelmet'
import type { ICourse } from './types'
import type { IEnrolledCourse } from './features/learning/types'

// Helper tự động scroll lên đầu trang mỗi khi chuyển route
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

// Wrapper route cho trang Chi tiết khóa học (/khoa-hoc/:slug)
function CourseDetailRoute({
  allCourses,
  isLoggedIn,
  enrolledCourseIds,
  onEnrollNow,
  onEnterClassroom,
}: {
  allCourses: ICourse[]
  isLoggedIn: boolean
  enrolledCourseIds: string[]
  onEnrollNow: (c: ICourse) => void
  onEnterClassroom: (enrolled: IEnrolledCourse) => void
}) {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  // Tìm khóa học theo slug hoặc id
  const course =
    allCourses.find((c) => c.slug === slug || c.id === slug) ||
    mockCourses.find((c) => c.slug === slug || c.id === slug)

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy khóa học</h2>
        <p className="text-sm text-slate-500">
          Khóa học bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật đường dẫn mới.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs uppercase cursor-pointer rounded-none hover:bg-amber-500 transition-colors"
        >
          Quay lại Trang chủ
        </button>
      </div>
    )
  }

  return (
    <>
      <SEOHelmet
        title={course.title}
        description={course.description}
        canonicalUrl={`https://ytacademy.vn/khoa-hoc/${course.slug}`}
        course={course}
        ogImage={course.thumbnail ? `https://ytacademy.vn${course.thumbnail}` : undefined}
      />
      <CourseDetailPage
        course={course}
        isEnrolled={isLoggedIn && enrolledCourseIds.includes(course.id)}
        onBackToHome={() => {
          navigate('/')
        }}
        onSelectRelatedCourse={(c) => {
          navigate(`/khoa-hoc/${c.slug}`)
        }}
        onEnrollNow={onEnrollNow}
        onGoToClassroom={() => {
          const enrolled =
            mockEnrolledCourses.find((e) => e.course.id === course.id) || mockEnrolledCourses[0]
          onEnterClassroom(enrolled)
        }}
      />
    </>
  )
}

// Wrapper route cho phòng học (/phong-hoc/:courseId)
function ClassroomRoute({ onBack }: { onBack: () => void }) {
  const { courseId } = useParams<{ courseId: string }>()
  const enrolled =
    mockEnrolledCourses.find(
      (e) => e.course.id === courseId || e.course.slug === courseId
    ) || mockEnrolledCourses[0]

  return <ClassroomView enrolledCourse={enrolled} onBack={onBack} />
}

export function App() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

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

  const [isActivationOpen, setIsActivationOpen] = useState(false)

  // Xác định currentView phục vụ highlight trạng thái active trên Navbar
  const currentView = location.pathname.startsWith('/khoa-hoc-cua-toi')
    ? 'my-courses'
    : location.pathname.startsWith('/khoa-hoc') || location.pathname.startsWith('/courses')
    ? 'course-detail'
    : location.pathname.startsWith('/phong-hoc')
    ? 'classroom'
    : 'home'

  const handleSelectCourseToDetail = (course: ICourse) => {
    navigate(`/khoa-hoc/${course.slug}`)
  }

  const handleEnterClassroom = (enrolled: IEnrolledCourse) => {
    navigate(`/phong-hoc/${enrolled.course.slug || enrolled.course.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <ScrollToTop />

      {/* Header (đồng bộ theo routing) */}
      <Navbar
        currentView={currentView}
        onNavigateView={(view) => {
          if (view === 'my-courses') {
            navigate('/khoa-hoc-cua-toi')
          } else {
            navigate('/')
          }
        }}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenAuth={(mode) => openAuthModal(mode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1">
        <Routes>
          {/* VIEW 1: TRANG CHỦ BÁN KHÓA HỌC (/) */}
          <Route
            path="/"
            element={
              <>
                <SEOHelmet
                  title="YT Academy – Khóa Học ACCA Chuẩn Quốc Tế | Learn Today - Grow Tomorrow"
                  description="Trung tâm YT Academy (ytacademy.vn) chuyên sâu đào tạo Chứng chỉ Kế toán Công chứng Anh quốc ACCA Quốc tế. Lớp 1-to-1, Nhóm nhỏ & Video Record chuẩn đề thi CBE."
                  canonicalUrl="https://ytacademy.vn/"
                />
                {/* Photographic Workspace Hero với thanh tìm kiếm */}
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

                {/* Danh mục khóa học ACCA */}
                <section
                  id="courses-section"
                  className="w-full bg-[#EEF2F6] pt-14 pb-10 border-t-2 border-slate-300/80 relative"
                  style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 bg-amber-400/15 blur-3xl pointer-events-none" />

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Countdown Flash Sale (-15%) */}
                    <div className="mb-6">
                      <CountdownWidget variant="banner" />
                    </div>

                    {/* Course Header */}
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
                              navigate('/khoa-hoc-cua-toi')
                            })
                            return
                          }
                          navigate('/khoa-hoc-cua-toi')
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

                    {/* Lưới khóa học */}
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
                    window.open('https://zalo.me/0822082407', '_blank', 'noopener,noreferrer')
                  }}
                />
              </>
            }
          />

          {/* VIEW 2: TRANG CHI TIẾT KHÓA HỌC (/khoa-hoc/:slug & /courses/:slug) */}
          <Route
            path="/khoa-hoc/:slug"
            element={
              <CourseDetailRoute
                allCourses={allCourses}
                isLoggedIn={isLoggedIn}
                enrolledCourseIds={enrolledCourseIds}
                onEnrollNow={(c) => {
                  addToCart(c)
                  openCart()
                }}
                onEnterClassroom={handleEnterClassroom}
              />
            }
          />
          <Route
            path="/courses/:slug"
            element={
              <CourseDetailRoute
                allCourses={allCourses}
                isLoggedIn={isLoggedIn}
                enrolledCourseIds={enrolledCourseIds}
                onEnrollNow={(c) => {
                  addToCart(c)
                  openCart()
                }}
                onEnterClassroom={handleEnterClassroom}
              />
            }
          />

          {/* VIEW 3: KHÓA HỌC CỦA TÔI (/khoa-hoc-cua-toi) */}
          <Route
            path="/khoa-hoc-cua-toi"
            element={
              <>
                <SEOHelmet
                  title="Khóa Học Của Tôi – YT Academy"
                  description="Quản lý và tiếp tục lộ trình học Chứng chỉ Kế toán Công chứng Anh quốc ACCA của bạn tại YT Academy."
                  canonicalUrl="https://ytacademy.vn/khoa-hoc-cua-toi"
                />
                <MyCoursesView
                  onEnterClassroom={handleEnterClassroom}
                  onViewDetail={(item) => handleSelectCourseToDetail(item.course)}
                  onGoToStore={() => navigate('/')}
                />
              </>
            }
          />

          {/* VIEW 4: PHÒNG HỌC & ĐỀ CƯƠNG TRỰC TUYẾN (/phong-hoc/:courseId) */}
          <Route
            path="/phong-hoc/:courseId"
            element={<ClassroomRoute onBack={() => navigate('/khoa-hoc-cua-toi')} />}
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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

      {/* Floating Contact Widget */}
      <FloatingContactWidget />
    </div>
  )
}

export default App
