import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrationService } from '../../services/registrationService'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingBag,
  Star,
  KeyRound,
  Tag,
  FileText,
  Settings,
  ExternalLink,
  Plus,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react'
import type {
  AdminTab,
  IAdminCourse,
  IAdminStudent,
  IAdminReview,
  IAdminActivationCode,
  IAdminOrder,
  IAdminVoucher,
  IAdminMaterial,
} from './types'
import {
  initialAdminCourses,
  initialAdminStudents,
  initialAdminReviews,
  initialAdminActivations,
  initialAdminOrders,
  initialAdminVouchers,
  initialAdminMaterials,
} from './adminData'
import { AdminOverviewTab } from './components/AdminOverviewTab'
import { AdminCoursesTab } from './components/AdminCoursesTab'
import { AdminStudentsTab } from './components/AdminStudentsTab'
import { AdminOrdersTab } from './components/AdminOrdersTab'
import { AdminReviewsTab } from './components/AdminReviewsTab'
import { AdminActivationTab } from './components/AdminActivationTab'
import { AdminVouchersTab } from './components/AdminVouchersTab'
import { AdminMaterialsTab } from './components/AdminMaterialsTab'
import { AdminSettingsTab } from './components/AdminSettingsTab'
import { AddCourseModal } from './components/AddCourseModal'
import { useAuthStore } from '../auth/authStore'

export const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // State Tabs & Layout
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  // State Dữ liệu
  const [courses, setCourses] = useState<IAdminCourse[]>(initialAdminCourses)
  const [students, setStudents] = useState<IAdminStudent[]>(initialAdminStudents)
  const [orders, setOrders] = useState<IAdminOrder[]>(initialAdminOrders)
  const [reviews, setReviews] = useState<IAdminReview[]>(initialAdminReviews)
  const [activations, setActivations] = useState<IAdminActivationCode[]>(initialAdminActivations)
  const [vouchers, setVouchers] = useState<IAdminVoucher[]>(initialAdminVouchers)
  const [materials, setMaterials] = useState<IAdminMaterial[]>(initialAdminMaterials)

  // Đồng bộ đơn đăng ký thực tế từ Supabase & LocalStorage
  useEffect(() => {
    registrationService.getAllOrders().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setOrders(loaded)
      }
    })

    const handleUpdated = () => {
      registrationService.getAllOrders().then((loaded) => {
        if (loaded) {
          setOrders(loaded)
        }
      })
    }

    window.addEventListener('yt:orders_updated', handleUpdated)
    return () => {
      window.removeEventListener('yt:orders_updated', handleUpdated)
    }
  }, [])

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

  // Handlers Đơn hàng
  const handleApproveOrder = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    )
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    )
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

  // Handlers Vouchers
  const handleAddVoucher = (newVoucher: IAdminVoucher) => {
    setVouchers([newVoucher, ...vouchers])
  }

  const handleDeleteVoucher = (id: string) => {
    setVouchers(vouchers.filter((v) => v.id !== id))
  }

  // Handlers Tài liệu
  const handleAddMaterial = (newMaterial: IAdminMaterial) => {
    setMaterials([newMaterial, ...materials])
  }

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length

  const navItems = [
    {
      id: 'overview',
      label: 'Tổng Quan Hệ Thống',
      icon: LayoutDashboard,
      count: null,
    },
    {
      id: 'courses',
      label: 'Quản Lý Khóa Học ACCA',
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
      id: 'orders',
      label: 'Đơn Hàng & Học Phí',
      icon: ShoppingBag,
      count: pendingOrdersCount || null,
      countBadgeColor: 'bg-rose-500 text-white animate-pulse',
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
      id: 'vouchers',
      label: 'Mã Ưu Đãi Flash Sale',
      icon: Tag,
      count: vouchers.length || null,
      countBadgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'exams',
      label: 'Đề Thi CBE & Tài Liệu',
      icon: FileText,
      count: materials.length || null,
      countBadgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'settings',
      label: 'Cài Đặt Hệ Thống',
      icon: Settings,
      count: null,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] flex flex-col md:flex-row text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* SIDEBAR BÊN TRÁI (NAVY THEME - HỖ TRỢ THU GỌN) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#0B2545] text-white flex flex-col justify-between z-40 transition-all duration-300 border-r border-slate-800 shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-68'}`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <span className="text-xl font-black text-white tracking-tighter">yt</span>
                  <span className="text-xl font-black text-amber-400 tracking-tight">academy</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-3.5 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="mx-auto text-amber-400 font-black text-lg">YT</div>
            )}

            <div className="flex items-center gap-1">
              {/* Nút thu gọn Sidebar trên desktop */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-none cursor-pointer"
                title={isSidebarCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu để xem toàn màn hình'}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tagline Admin */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-2 bg-[#07172C] text-[10px] font-mono uppercase tracking-wider text-amber-400/90 border-b border-slate-800 flex items-center justify-between">
              <span>Admin Control Panel</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  title={isSidebarCollapsed ? item.label : undefined}
                  onClick={() => {
                    setActiveTab(item.id as AdminTab)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                  } rounded-none text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm border-l-4 border-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && item.count !== null && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-none shrink-0 ${
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
        <div className="p-3 border-t border-slate-800 bg-[#07172C]">
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
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

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Xem Website Học Viên</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Xem Website Học Viên"
              className="w-full p-2.5 text-amber-400 hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA - FULL FLUID WIDTH (KHÔNG GIỚI HẠN MAX-W-7XL) */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-none cursor-pointer"
              title="Mở rộng / Thu gọn toàn màn hình"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-900 uppercase">YT Academy Admin</span>
              <span>/</span>
              <span className="text-amber-700 font-bold capitalize">
                {activeTab === 'overview'
                  ? 'Tổng quan'
                  : activeTab === 'courses'
                  ? 'Khóa học ACCA'
                  : activeTab === 'students'
                  ? 'Học viên & RBAC'
                  : activeTab === 'orders'
                  ? 'Đơn hàng & Học phí'
                  : activeTab === 'reviews'
                  ? 'Đánh giá học viên'
                  : activeTab === 'activations'
                  ? 'Mã kích hoạt'
                  : activeTab === 'vouchers'
                  ? 'Mã ưu đãi Flash Sale'
                  : activeTab === 'exams'
                  ? 'Đề thi CBE & Tài liệu'
                  : 'Cài đặt'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsAddCourseOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thêm Môn Học Mới</span>
              <span className="sm:hidden">Thêm</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase flex items-center gap-1.5 rounded-none cursor-pointer transition-colors"
            >
              <span>Trang Chủ</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body - 100% Full Fluid Width */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-none">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              courses={courses}
              students={students}
              reviews={reviews}
              orders={orders}
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

          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              onApproveOrder={handleApproveOrder}
              onCancelOrder={handleCancelOrder}
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

          {activeTab === 'vouchers' && (
            <AdminVouchersTab
              vouchers={vouchers}
              onAddVoucher={handleAddVoucher}
              onDeleteVoucher={handleDeleteVoucher}
            />
          )}

          {activeTab === 'exams' && (
            <AdminMaterialsTab
              materials={materials}
              courses={courses}
              onAddMaterial={handleAddMaterial}
              onDeleteMaterial={handleDeleteMaterial}
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
