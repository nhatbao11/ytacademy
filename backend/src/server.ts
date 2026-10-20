import { createApp } from './app'
import { ENV } from './config/env'
import { isSupabaseConfigured } from './config/supabase'

const app = createApp()

const server = app.listen(ENV.PORT, () => {
  console.log(`=======================================================`)
  console.log(`🚀 YT Academy Backend Service (ytacademy.vn) is running!`)
  console.log(`📡 URL: http://localhost:${ENV.PORT}/api/v1`)
  console.log(`🛡️  Database: Supabase PostgreSQL (Configured: ${isSupabaseConfigured() ? '✅ YES' : '⚙️ Fallback In-Memory'})`)
  console.log(`👥 RBAC: Student, Admin, Instructor, Collaborator, Assistant`)
  console.log(`=======================================================`)
})

export default server
