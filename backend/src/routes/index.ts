import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import { getSupabaseClient } from '../config/supabase'

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

// Endpoint cung cấp toàn bộ dữ liệu thực tế từ Supabase cho Admin Panel
router.get('/admin/data', async (req, res) => {
  try {
    const supabase = getSupabaseClient()
    const { data: users, error: uErr } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: enrollments, error: eErr } = await supabase
      .from('user_enrolled_courses')
      .select('*')
      .order('enrolled_at', { ascending: false })

    res.status(200).json({
      success: true,
      data: {
        users: users || [],
        enrollments: enrollments || [],
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Mount modules
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

export default router
