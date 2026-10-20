import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Star,
  KeyRound,
  Settings,
  ExternalLink,
  Plus,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import type { AdminTab, IAdminCourse, IAdminStudent, IAdminReview, IAdminActivationCode } from './types'
import {
  initialAdminCourses,
  initialAdminStudents,
  initialAdminReviews,
  initialAdminActivations,
} from './adminData'
import { AdminOverviewTab } from './components/AdminOverviewTab'
import { AdminCoursesTab } from './components/AdminCoursesTab'
import { AdminStudentsTab } from './components/AdminStudentsTab'
import { AdminReviewsTab } from './components/AdminReviewsTab'
import { AdminActivationTab } from './components/AdminActivationTab'
import { AdminSettingsTab } from './components/AdminSettingsTab'
import { AddCourseModal } from './components/AddCourseModal'
import { useAuthStore } from '../auth/authStore'

export const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // State Tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  // State Dữ liệu
  const [courses, setCourses] = useState<IAdminCourse[]>(initialAdminCourses)
  const [students, setStudents] = useState<IAdminStudent[]>(initialAdminStudents)
  const [reviews, setReviews] = useState<IAdminReview[]>(initialAdminReviews)
  const [activations, setActivations] = useState<IAdminActivationCode[]>(initialAdminActivations)

  // Handlers Khóa học
  const handleAddCourse = (newCourse: IAdminCourse) => {
    setCourses([newCourse, ...courses])
  }

  const handleTogglePublish = (id: string) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    )
  }

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  // Handlers Học viên & RBAC
  const handleChangeRole = (studentId: string, newRole: any) => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, role: newRole } : s))
    )
  }

  const handleToggleStudentStatus = (studentId: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId
          ? { ...s, status: s.status === 'active' ? 'locked' : 'active' }
          : s
      )
    )
  }

  const handleAddStudent = (newStudent: IAdminStudent) => {
    setStudents([newStudent, ...students])
  }

  // Handlers Đánh giá
  const handleApproveReview = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    )
  }

  const handleRejectReview = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: 'pending' } : r))
    )
  }

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id))
  }

  // Handlers Mã kích hoạt
  const handleGenerateCode = (courseId: string, courseName: string) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newCode: IAdminActivationCode = {
      id: `act-${Date.now()}`,
      code: `ACCA-VIP-${randomSuffix}`,
      courseId,
      courseName,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: '2027-01-31',
      status: 'unused',
    }
    setActivations([newCode, ...activations])
  }

  const handleRevokeCode = (codeId: string) => {
    setActivations(
      activations.map((a) => (a.id === codeId ? { ...a, status: 'revoked' } : a))
    )
  }

  const navItems = [
    {
      id: 'overview',
      label: 'Tổng Quan Hệ Thống',
      icon: LayoutDashboard,
      count: null,
    },
    {
      id: 'courses',
      label: 'Quản Lý Khóa Học',
      icon: BookOpen,
      count: courses.length,
    },
    {
      id: 'students',
      label: 'Học Viên & Phân Quyền',
      icon: Users,
      count: students.length,
    },
    {
      id: 'reviews',
      label: 'Đánh Giá & Cảm Nhận',
      icon: Star,
      count: reviews.filter((r) => r.status === 'pending').length || null,
      countBadgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'activations',
      label: 'Mã Kích Hoạt Môn Học',
      icon: KeyRound,
      count: activations.filter((a) => a.status === 'unused').length || null,
      countBadgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'settings',
      label: 'Cài Đặt Hệ Thống',
      icon: Settings,
      count: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* SIDEBAR BÊN TRÁI (NAVY THEME) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#0B2545] text-white flex flex-col justify-between z-40 transition-transform duration-300 border-r border-slate-800 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <span className="text-2xl font-black text-white tracking-tighter">yt</span>
                <span className="text-2xl font-black text-amber-400 tracking-tight">academy</span>
                <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-4 animate-pulse" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tagline Admin */}
          <div className="px-5 py-2.5 bg-[#07172C] text-[10px] font-mono uppercase tracking-wider text-amber-400/90 border-b border-slate-800 flex items-center justify-between">
            <span>Admin Control Panel</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm border-l-4 border-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== null && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-none ${
                        item.countBadgeColor || (isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#07172C]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || 'Quản trị viên YT Academy'}
              </div>
              <div className="text-[10px] text-amber-400 font-mono truncate">
                admin@ytacademy.vn
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem Website Học Viên</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-900 uppercase">Hệ Thống Quản Trị</span>
              <span>/</span>
              <span className="text-amber-700 font-bold capitalize">
                {activeTab === 'overview'
                  ? 'Tổng quan'
                  : activeTab === 'courses'
                  ? 'Khóa học ACCA'
                  : activeTab === 'students'
                  ? 'Học viên & RBAC'
                  : activeTab === 'reviews'
                  ? 'Đánh giá học viên'
                  : activeTab === 'activations'
                  ? 'Mã kích hoạt'
                  : 'Cài đặt'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddCourseOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Môn Học</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase flex items-center gap-1.5 rounded-none cursor-pointer transition-colors"
            >
              <span>Vào Trang Chủ</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              courses={courses}
              students={students}
              reviews={reviews}
              onOpenAddCourse={() => setIsAddCourseOpen(true)}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === 'courses' && (
            <AdminCoursesTab
              courses={courses}
              onOpenAddModal={() => setIsAddCourseOpen(true)}
              onTogglePublish={handleTogglePublish}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'students' && (
            <AdminStudentsTab
              students={students}
              onChangeRole={handleChangeRole}
              onToggleStatus={handleToggleStudentStatus}
              onAddStudent={handleAddStudent}
            />
          )}

          {activeTab === 'reviews' && (
            <AdminReviewsTab
              reviews={reviews}
              onApproveReview={handleApproveReview}
              onRejectReview={handleRejectReview}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {activeTab === 'activations' && (
            <AdminActivationTab
              codes={activations}
              courses={courses}
              onGenerateCode={handleGenerateCode}
              onRevokeCode={handleRevokeCode}
            />
          )}

          {activeTab === 'settings' && <AdminSettingsTab />}
        </main>
      </div>

      {/* Modal Thêm Khóa Học Mới */}
      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  )
}

export default AdminPage
