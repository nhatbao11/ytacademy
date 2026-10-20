import { Request, Response } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/authService'
import { Role } from '../constants/roles'

const updateRoleSchema = z.object({
  role: z.string().min(1, 'Vai trò không được để trống.'),
})

export class UserController {
  /**
   * Lấy danh sách tài khoản (Chỉ Admin): GET /api/v1/users
   */
  public static async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllUsers()
      res.status(200).json({
        success: true,
        data: users,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách người dùng.',
      })
    }
  }

  /**
   * Cập nhật vai trò / phân quyền người dùng (Chỉ Admin): PATCH /api/v1/users/:userId/role
   */
  public static async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = String(req.params.userId)
      const { role } = updateRoleSchema.parse(req.body)

      await AuthService.updateUserRole(userId, role)

      res.status(200).json({
        success: true,
        message: `Đã cập nhật vai trò người dùng thành công: ${role}`,
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Dữ liệu không hợp lệ.',
        })
        return
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Cập nhật vai trò thất bại.',
      })
    }
  }
}
