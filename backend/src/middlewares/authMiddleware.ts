import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'
import { Role } from '../constants/roles'
import { IAuthPayload } from '../models/user'

// Mở rộng kiểu dữ liệu Request của Express để chứa user
export interface AuthenticatedRequest extends Request {
  user?: IAuthPayload
}

/**
 * Middleware xác thực Bearer Token JWT
 */
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập. Không tìm thấy token xác thực hợp lệ.',
        errorCode: 'UNAUTHORIZED',
      })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as IAuthPayload

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
      errorCode: 'INVALID_TOKEN',
    })
  }
}

/**
 * Middleware Phân quyền RBAC mở rộng (Kiểm tra vai trò người dùng)
 * @param allowedRoles Danh sách các role được phép truy cập (vd: [Role.ADMIN], [Role.ADMIN, Role.INSTRUCTOR])
 */
export const requireRole = (allowedRoles: (Role | string)[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập.',
        errorCode: 'UNAUTHORIZED',
      })
      return
    }

    const userPrimaryRole = req.user.role
    const userAllRoles = req.user.roles || [userPrimaryRole]

    // Kiểm tra xem role chính hoặc bất kỳ role mở rộng nào có nằm trong danh sách cho phép không
    const hasPermission =
      allowedRoles.includes(userPrimaryRole) ||
      userAllRoles.some((r) => allowedRoles.includes(r))

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập chức năng này. Quyền yêu cầu: [${allowedRoles.join(', ')}].`,
        errorCode: 'FORBIDDEN',
      })
      return
    }

    next()
  }
}

/**
 * Shortcut kiểm tra quyền Quản trị viên
 */
export const requireAdmin = requireRole([Role.ADMIN])
