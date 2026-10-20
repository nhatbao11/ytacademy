import dotenv from 'dotenv'
import path from 'path'

// Load .env từ thư mục backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'yt_academy_jwt_secret_super_secure_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URLS: (process.env.CLIENT_URL || 'http://localhost:5173,https://ytacademy.vn')
    .split(',')
    .map((s) => s.trim()),
}
