import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'

const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'YT Academy API Service',
    domain: 'ytacademy.vn',
    timestamp: new Date().toISOString(),
  })
})

// Mount modules
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

export default router
