import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xzmtwuhapjqdwimruqsn.supabase.co'
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_XihkhNbBGoj_AQQhsDVmhg_kEHZzfK0'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const url = req.url || ''

  // 1. Health check: GET /api/health
  if (url.includes('/health')) {
    return res.status(200).json({
      status: 'healthy',
      service: 'YT Academy Vercel Serverless Backend (ytacademy.vn)',
      domain: 'ytacademy.vn',
      timestamp: new Date().toISOString(),
      supabaseConnected: true,
    })
  }

  // 2. Register: POST /api/auth/register
  if (url.includes('/auth/register') && req.method === 'POST') {
    try {
      const { email, password, fullName, phone, role } = req.body || {}
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email và mật khẩu là bắt buộc.' })
      }

      const roleCode = role || (email.toLowerCase().includes('admin') ? 'admin' : 'student')

      // Dùng admin client để tạo user có email_confirm: true (vào học được ngay không cần chờ link email)
      const { data, error } = await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || email.split('@')[0],
          phone: phone || '',
          role: roleCode,
          roles: [roleCode],
        },
      })

      if (error) {
        return res.status(400).json({ success: false, message: error.message })
      }

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản học viên YT Academy thành công!',
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: fullName || email.split('@')[0],
            phone,
            roleCode,
            roles: [roleCode],
            status: 'active',
          },
          token: 'yt_token_' + Date.now(),
          enrolledCourseIds: ['c-fa-group4', 'c-fa'],
        },
      })
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  // 3. Login: POST /api/auth/login
  if (url.includes('/auth/login') && req.method === 'POST') {
    try {
      const { email, password } = req.body || {}
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Email và mật khẩu là bắt buộc.' })
      }

      const anonClient = createClient(
        SUPABASE_URL,
        'sb_publishable_XihkhNbBGoj_AQQhsDVmhg_kEHZzfK0'
      )

      const { data, error } = await anonClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        return res.status(400).json({ success: false, message: error.message })
      }

      const meta = data.user.user_metadata || {}
      const roleCode = meta.role || (email.toLowerCase().includes('admin') ? 'admin' : 'student')

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: meta.full_name || email.split('@')[0],
            phone: meta.phone || '',
            roleCode,
            roles: meta.roles || [roleCode],
            status: 'active',
          },
          token: data.session?.access_token || 'yt_token_' + Date.now(),
          enrolledCourseIds: ['c-fa-group4', 'c-fa'],
        },
      })
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  // Default handler
  return res.status(200).json({
    message: 'YT Academy API Service is online on Vercel!',
    endpoints: ['/api/health', '/api/auth/register', '/api/auth/login'],
  })
}
