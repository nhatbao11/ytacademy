import { Request, Response } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/authService'
import { AuthenticatedRequest } from '../middlewares/authMiddleware'

// Schema Validation bằng Zod
const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng.'),
  password: z.string().min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự.'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự.'),
  phone: z.string().optional(),
  role: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
})

export class AuthController {
  /**
   * Đăng ký tài khoản mới: POST /api/v1/auth/register
   */
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body)
      const result = await AuthService.register(validatedData)

      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản học viên YT Academy thành công!',
        data: result,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Dữ liệu không hợp lệ.',
          errorCode: 'VALIDATION_ERROR',
        })
        return
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại.',
        errorCode: 'REGISTER_FAILED',
      })
    }
  }

  /**
   * Đăng nhập: POST /api/v1/auth/login
   */
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body)
      const result = await AuthService.login(validatedData)

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công! Chào mừng bạn quay trở lại YT Academy.',
        data: result,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Dữ liệu không hợp lệ.',
          errorCode: 'VALIDATION_ERROR',
        })
        return
      }

      res.status(401).json({
        success: false,
        message: error.message || 'Đăng nhập thất bại.',
        errorCode: 'LOGIN_FAILED',
      })
    }
  }

  /**
   * Lấy thông tin tài khoản hiện tại: GET /api/v1/auth/me
   */
  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Chưa đăng nhập.',
        })
        return
      }

      const profile = await AuthService.getProfile(req.user.userId)

      res.status(200).json({
        success: true,
        data: profile,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy thông tin tài khoản.',
      })
    }
  }
}
