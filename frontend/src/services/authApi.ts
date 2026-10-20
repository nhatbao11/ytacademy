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
   * Đăng nhập qua Backend API
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
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Không thể kết nối đến máy chủ backend.',
      }
    }
  },

  /**
   * Đăng ký tài khoản mới qua Backend API
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
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Không thể kết nối đến máy chủ backend.',
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
