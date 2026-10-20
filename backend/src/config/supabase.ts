import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ENV } from './env'

let supabase: SupabaseClient | null = null

const isPlaceholderKey = (key: string) =>
  !key || key.includes('placeholder') || key.includes('your-supabase')

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(ENV.SUPABASE_URL) &&
    !isPlaceholderKey(ENV.SUPABASE_URL) &&
    Boolean(ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY) &&
    !isPlaceholderKey(ENV.SUPABASE_SERVICE_ROLE_KEY)
  )
}

export const getSupabaseClient = (): SupabaseClient => {
  if (supabase) return supabase

  const key = ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY

  if (!isSupabaseConfigured()) {
    console.warn(
      '⚠️ [YT Academy Backend] Supabase credentials chưa được cấu hình trong .env. Đang sử dụng chế độ In-Memory Mock Service để kiểm thử cục bộ mượt mà.'
    )
  }

  supabase = createClient(
    ENV.SUPABASE_URL || 'https://placeholder.supabase.co',
    key || 'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

  return supabase
}
