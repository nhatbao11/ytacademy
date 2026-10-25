/**
 * Registration & Order Service for YT Academy (ytacademy.vn)
 * Lưu trữ thông tin học viên đăng ký khóa học vào Supabase Database & Admin System
 */
import { supabase } from '../config/supabase'
import type { ICourse } from '../types'
import type { IAdminOrder } from '../features/admin/types'
import { initialAdminOrders } from '../features/admin/adminData'

export interface RegistrationPayload {
  userId?: string
  studentName: string
  studentEmail: string
  studentPhone?: string
  items: Array<{
    course: ICourse
    addedAt?: number
    quantity?: number
  }>
  voucherCode?: string | null
  discountRate: number
  totalAmount: number
}

const ORDERS_STORAGE_KEY = 'yt_academy_admin_orders'

export const registrationService = {
  /**
   * Lấy danh sách toàn bộ đơn đăng ký (đồng bộ giữa Supabase và Local Storage)
   */
  async getAllOrders(): Promise<IAdminOrder[]> {
    let localOrders: IAdminOrder[] = []
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (stored) {
        localOrders = JSON.parse(stored)
      } else {
        localOrders = initialAdminOrders
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders))
      }
    } catch {
      localOrders = initialAdminOrders
    }

    try {
      // Thử lấy thêm từ bảng course_registrations của Supabase nếu đã tạo bảng
      const { data, error } = await supabase
        .from('course_registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const supabaseOrders: IAdminOrder[] = data.map((row: any) => ({
          id: row.id,
          orderCode: `REG-${row.id.toString().slice(0, 8).toUpperCase()}`,
          studentName: row.student_name,
          studentEmail: row.student_email,
          studentPhone: row.student_phone || '',
          courseId: row.course_id,
          courseName: row.course_title,
          amount: Number(row.final_price) || 0,
          paymentMethod: 'VietQR / Chuyển khoản',
          status: row.status === 'confirmed' ? 'completed' : 'pending',
          createdAt: row.created_at,
          note: row.note,
        }))

        // Gộp không trùng lặp
        const existingIds = new Set(localOrders.map((o) => o.id))
        const merged = [...localOrders]
        supabaseOrders.forEach((so) => {
          if (!existingIds.has(so.id)) {
            merged.unshift(so)
          }
        })
        return merged
      }
    } catch {
      // Fallback localOrders
    }

    return localOrders
  },

  /**
   * Tạo đơn đăng ký mới và lưu vào bảng Database
   */
  async submitRegistration(payload: RegistrationPayload): Promise<{
    success: boolean
    orderCodes: string[]
    message: string
  }> {
    const {
      userId,
      studentName,
      studentEmail,
      studentPhone,
      items,
      voucherCode,
      discountRate,
    } = payload

    const orderCodes: string[] = []
    const newAdminOrders: IAdminOrder[] = []

    for (const item of items) {
      const orderCode = `REG-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`
      orderCodes.push(orderCode)

      const finalItemPrice = Math.round(item.course.salePrice * (1 - discountRate))

      // 1. Tạo đối tượng đơn hàng cho Admin Panel
      const newOrder: IAdminOrder = {
        id: `ord_${Date.now()}_${item.course.id}`,
        orderCode,
        studentName: studentName || 'Học viên YT Academy',
        studentEmail: studentEmail || 'hocvien@ytacademy.vn',
        studentPhone: studentPhone || '0822082407',
        courseId: item.course.id,
        courseName: item.course.title,
        amount: finalItemPrice,
        paymentMethod: 'VietQR / Chuyển khoản',
        status: 'pending',
        createdAt: new Date().toISOString(),
        note: voucherCode ? `Áp dụng Voucher: ${voucherCode} (-${discountRate * 100}%)` : 'Đăng ký qua website',
      }
      newAdminOrders.push(newOrder)

      // 2. Lưu trực tiếp vào Supabase: Bảng user_enrolled_courses (Bảng này chắc chắn tồn tại trên Supabase)
      if (userId) {
        try {
          await supabase.from('user_enrolled_courses').upsert(
            {
              user_id: userId,
              course_id: item.course.id,
              status: 'active',
              enrolled_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,course_id' }
          )
        } catch (enrErr) {
          console.warn('Lỗi lưu user_enrolled_courses:', enrErr)
        }
      }

      // 3. Thử lưu vào Supabase: Bảng course_registrations (nếu đã tạo bảng trong SQL Editor)
      try {
        await supabase.from('course_registrations').insert({
          user_id: userId || null,
          student_name: studentName,
          student_email: studentEmail,
          student_phone: studentPhone || '',
          course_id: item.course.id,
          course_title: item.course.title,
          course_price: item.course.originalPrice,
          sale_price: item.course.salePrice,
          voucher_code: voucherCode || null,
          final_price: finalItemPrice,
          status: 'pending',
          note: voucherCode ? `Voucher: ${voucherCode}` : 'Website lead',
        })
      } catch (regErr) {
        // Nếu bảng course_registrations chưa tạo trong DB, bỏ qua lỗi âm thầm
        console.warn('Lưu course_registrations:', regErr)
      }
    }

    // 4. Cập nhật vào danh sách Admin Orders trong LocalStorage & phát sự kiện cập nhật
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
      const currentList: IAdminOrder[] = stored ? JSON.parse(stored) : initialAdminOrders
      const updatedList = [...newAdminOrders, ...currentList]
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedList))
      window.dispatchEvent(new CustomEvent('yt:orders_updated', { detail: newAdminOrders }))
    } catch (lsErr) {
      console.warn('LocalStorage error:', lsErr)
    }

    return {
      success: true,
      orderCodes,
      message: 'Đăng ký khóa học thành công!',
    }
  },
}
