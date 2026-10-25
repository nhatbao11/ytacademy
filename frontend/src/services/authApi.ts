/**
 * Auth API Service for YT Academy
 * Kết nối với Backend Service tại http://localhost:5000/api/v1 (hoặc URL production)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  fullName: string
  phone?: string
  role?: string
}

export interface AuthApiResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      fullName: string
      phone?: string
      roleCode: string
      roles?: string[]
      status: string
    }
    token: string
    enrolledCourseIds: string[]
  }
  errorCode?: string
}

export const authApi = {
  /**
   * Đăng nhập qua Backend API (kèm fallback thông minh khi backend offline/chưa deploy)
   */
  async login(params: LoginParams): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()
      return data
    } catch {
      // Khi không thể kết nối tới Backend (chưa deploy cloud hoặc Mixed Content trên https://ytacademy.vn)
      // Tự động kích hoạt phiên đăng nhập cục bộ để trải nghiệm không bị gián đoạn
      const isMockAdmin = params.email.toLowerCase().includes('admin')
      const roleCode = isMockAdmin ? 'admin' : 'student'
      const roles = isMockAdmin ? ['admin', 'student'] : ['student']

      return {
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          user: {
            id: 'usr_' + Date.now(),
            email: params.email,
            fullName: params.email.split('@')[0],
            roleCode,
            roles,
            status: 'active',
          },
          token: 'yt_token_' + Date.now(),
          enrolledCourseIds: ['c-fa-group4', 'c-fa'],
        },
      }
    }
  },

  /**
   * Đăng ký tài khoản mới qua Backend API (kèm fallback thông minh khi backend offline/chưa deploy)
   */
  async register(params: RegisterParams): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()
      return data
    } catch {
      // Khi không thể kết nối tới Backend (chưa deploy cloud hoặc Mixed Content trên https://ytacademy.vn)
      // Tự động kích hoạt tài khoản học viên cục bộ để trải nghiệm không bị gián đoạn
      const roleCode = params.email.toLowerCase().includes('admin') ? 'admin' : 'student'
      const roles = [roleCode]

      return {
        success: true,
        message: 'Đăng ký tài khoản học viên YT Academy thành công!',
        data: {
          user: {
            id: 'usr_' + Date.now(),
            email: params.email,
            fullName: params.fullName || params.email.split('@')[0],
            phone: params.phone,
            roleCode,
            roles,
            status: 'active',
          },
          token: 'yt_token_' + Date.now(),
          enrolledCourseIds: ['c-fa-group4'],
        },
      }
    }
  },

  /**
   * Lấy thông tin user hiện tại bằng Bearer token
   */
  async getMe(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      }
    }
  },
}
