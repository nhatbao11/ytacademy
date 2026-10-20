import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware'

const router = Router()

// Tất cả route quản lý user yêu cầu đăng nhập & quyền ADMIN
router.use(verifyToken)
router.use(requireAdmin)

// Lấy danh sách tất cả người dùng
router.get('/', UserController.listUsers)

// Phân quyền / Cập nhật vai trò người dùng (vd: đổi sang instructor, collaborator, admin, student)
router.patch('/:userId/role', UserController.updateUserRole)

export default router
