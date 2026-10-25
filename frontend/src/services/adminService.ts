/**
 * Admin Service for YT Academy (ytacademy.vn)
 * Truy vấn & tổng hợp 100% dữ liệu THỰC TẾ từ Supabase (users, user_enrolled_courses)
 * NGUYÊN TẮC: Học viên đăng ký khóa học KHÔNG CÓ NGHĨA LÀ ĐÃ THANH TOÁN.
 * Mọi đơn đăng ký mặc định là CHƯA THANH TOÁN (pending) cho đến khi Admin xác nhận đã thu học phí.
 */
import { supabase } from '../config/supabase'
import type { IAdminCourse, IAdminStudent, IAdminOrder } from '../features/admin/types'
import { initialAdminCourses } from '../features/admin/adminData'

export const adminService = {
  /**
   * Lấy dữ liệu thực tế từ API Backend (Sử dụng service role key để vượt qua RLS của Supabase)
   */
  async fetchRealDatabaseData(): Promise<{ users: any[]; enrollments: any[] }> {
    // 1. Thử gọi API Backend /api/admin/data
    try {
      const res = await fetch('/api/admin/data')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data && json.data.users && json.data.users.length > 0) {
          return json.data
        }
      }
    } catch {
      // ignore
    }

    // 2. Thử gọi /api/v1/admin/data
    try {
      const res = await fetch('/api/v1/admin/data')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data && json.data.users && json.data.users.length > 0) {
          return json.data
        }
      }
    } catch {
      // ignore
    }

    // 3. Fallback: Trực tiếp qua Supabase client
    try {
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: enrollments } = await supabase
        .from('user_enrolled_courses')
        .select('*')
        .order('enrolled_at', { ascending: false })

      return {
        users: users || [],
        enrollments: enrollments || [],
      }
    } catch {
      return { users: [], enrollments: [] }
    }
  },

  /**
   * Lấy danh sách học viên THỰC TẾ từ Supabase
   */
  async getRealStudents(): Promise<IAdminStudent[]> {
    try {
      const { users, enrollments } = await this.fetchRealDatabaseData()

      if (!users || users.length === 0) return []

      const enrList = enrollments || []

      // Đọc danh sách đơn đã được Admin bấm xác nhận thu tiền
      let approvedOrderIds = new Set<string>()
      try {
        const approved = localStorage.getItem('yt_academy_approved_orders')
        if (approved) {
          approvedOrderIds = new Set(JSON.parse(approved))
        }
      } catch {
        // ignore
      }

      return users.map((u: any) => {
        const userEnrolled = enrList.filter((e: any) => e.user_id === u.id)
        // ĐĂNG KÝ KHÔNG CÓ NGHĨA LÀ ĐÃ THANH TOÁN: Chỉ tính totalSpent nếu Admin đã xác nhận thu tiền
        const totalSpent = userEnrolled.reduce((sum: number, e: any) => {
          if (!approvedOrderIds.has(e.id)) return sum
          const course = initialAdminCourses.find((c) => c.id === e.course_id)
          return sum + (course?.salePrice || 0)
        }, 0)

        return {
          id: u.id,
          name: u.full_name || (u.email ? u.email.split('@')[0] : 'Học viên YT Academy'),
          email: u.email,
          phone: u.phone || 'Chưa cập nhật',
          role: u.role_code || 'student',
          enrolledCourseIds: userEnrolled.map((e: any) => e.course_id),
          status: (u.status as any) || 'active',
          registeredAt: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          totalSpent,
        }
      })
    } catch {
      return []
    }
  },

  /**
   * Lấy danh sách đơn đăng ký / ghi danh THỰC TẾ
   */
  async getRealOrders(): Promise<IAdminOrder[]> {
    const orders: IAdminOrder[] = []

    try {
      const { users, enrollments } = await this.fetchRealDatabaseData()
      const userMap = new Map((users || []).map((u: any) => [u.id, u]))

      // Đọc danh sách ID đơn đã được Admin chủ động bấm xác nhận đã thu học phí
      let approvedOrderIds = new Set<string>()
      try {
        const approved = localStorage.getItem('yt_academy_approved_orders')
        if (approved) {
          approvedOrderIds = new Set(JSON.parse(approved))
        }
      } catch {
        // ignore
      }

      if (enrollments && enrollments.length > 0) {
        enrollments.forEach((e: any) => {
          const u = userMap.get(e.user_id)
          const course = initialAdminCourses.find((c) => c.id === e.course_id)
          // Đăng ký môn học KHÔNG CÓ NGHĨA là đã thanh toán: Mặc định 100% là pending (Chưa thanh toán)
          const isPaid = approvedOrderIds.has(e.id)

          orders.push({
            id: e.id,
            orderCode: `REG-${e.id.toString().slice(0, 8).toUpperCase()}`,
            studentName: u?.full_name || (u?.email ? u.email.split('@')[0] : 'Học viên YT Academy'),
            studentEmail: u?.email || 'hocvien@ytacademy.vn',
            studentPhone: u?.phone || 'Chưa cập nhật',
            courseId: e.course_id,
            courseName: course?.title || e.course_id,
            amount: course?.salePrice || 0,
            paymentMethod: 'VietQR / Chuyển khoản',
            status: isPaid ? 'completed' : 'pending',
            createdAt: e.enrolled_at ? e.enrolled_at.replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('T', ' ').slice(0, 19),
            note: isPaid ? 'Đã thu học phí' : 'Học viên đã đăng ký học (Chưa thanh toán học phí)',
          })
        })
      }
    } catch {
      // ignore
    }

    // Gộp thêm các đơn đăng ký vừa được học viên gửi qua CartDrawer
    try {
      const stored = localStorage.getItem('yt_academy_admin_orders')
      if (stored) {
        const localList: IAdminOrder[] = JSON.parse(stored)
        // Lọc bỏ triệt để các mã đơn fake cũ (như YT-ORD-2026-...)
        const realOnly = localList.filter(
          (o) => !o.orderCode.startsWith('YT-ORD-2026-') && !o.studentName.includes('Nguyễn Thanh Tùng')
        )
        const existingIds = new Set(orders.map((o) => o.id))
        realOnly.forEach((ro) => {
          if (!existingIds.has(ro.id)) {
            // Đảm bảo đơn mới gửi luôn là pending (Chưa thanh toán)
            orders.unshift({
              ...ro,
              status: ro.status === 'completed' ? 'completed' : 'pending',
            })
          }
        })
      }
    } catch {
      // ignore
    }

    return orders
  },

  /**
   * Tính toán danh sách khóa học thực tế kèm số học viên thật
   */
  getRealCourses(studentsList: IAdminStudent[] = []): IAdminCourse[] {
    return initialAdminCourses.map((c) => {
      const enrolledCount = studentsList.filter((s) => s.enrolledCourseIds.includes(c.id)).length
      return {
        ...c,
        studentsCount: enrolledCount,
        rating: 0,
        reviewsCount: 0,
      }
    })
  },
}
