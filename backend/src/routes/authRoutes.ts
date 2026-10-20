import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router()

// Đăng ký tài khoản mới (mặc định role = student, có thể mở rộng)
router.post('/register', AuthController.register)

// Đăng nhập hệ thống (trả về JWT + thông tin vai trò)
router.post('/login', AuthController.login)

// Lấy thông tin cá nhân & quyền hạn của token hiện tại
router.get('/me', verifyToken, AuthController.getMe)

export default router
