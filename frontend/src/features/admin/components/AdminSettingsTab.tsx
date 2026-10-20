import React, { useState } from 'react'
import { Save, Database, Globe, Phone, Mail, MapPin } from 'lucide-react'

export const AdminSettingsTab: React.FC = () => {
  const [hotline, setHotline] = useState('0822.082.407')
  const [email, setEmail] = useState('ytacademy.edu@gmail.com')
  const [address, setAddress] = useState('75 Hậu Giang, Phường Bình Tây, TP. Hồ Chí Minh, Việt Nam')
  const [facebookUrl, setFacebookUrl] = useState('https://www.facebook.com/profile.php?id=61558436517466')
  const [tiktokUrl, setTiktokUrl] = useState('https://www.tiktok.com/@yt.academy.edu')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 border border-slate-200">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          Cài Đặt Hệ Thống & Thông Tin Thương Hiệu
        </h2>
        <p className="text-xs text-slate-500">
          Đồng bộ thông tin liên hệ, hotline, chân trang và cấu hình máy chủ cơ sở dữ liệu
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Khối 1: Thông tin liên hệ trung tâm */}
        <div className="bg-white p-5 border border-slate-200 rounded-none space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Thông Tin Trung Tâm YT Academy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hotline Tư Vấn Lộ Trình 1-1
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-300">
                <span className="p-2.5 text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="flex-1 py-2 pr-3 bg-transparent text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Hỗ Trợ Học Tập
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-300">
                <span className="p-2.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 py-2 pr-3 bg-transparent text-xs font-bold outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Địa Chỉ Trụ Sở Trung Tâm
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300">
              <span className="p-2.5 text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 py-2 pr-3 bg-transparent text-xs font-medium outline-none"
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Mạng xã hội */}
        <div className="bg-white p-5 border border-slate-200 rounded-none space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Kênh Truyền Thông Chính Thức</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Facebook Fanpage / Trang Cá Nhân
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kênh TikTok Đào Tạo
              </label>
              <input
                type="text"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Trạng thái Cơ sở dữ liệu Supabase */}
        <div className="bg-white p-5 border border-slate-200 rounded-none space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Trạng Thái Hạ Tầng Cơ Sở Dữ Liệu</span>
          </h3>

          <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Database Engine: Supabase PostgreSQL 15+
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Cơ chế phân quyền RBAC đa vai trò (Student, Admin, Instructor, Collaborator, Assistant)
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-none">
              ● Đang Kết Nối Sẵn Sàng
            </span>
          </div>
        </div>

        {/* Nút lưu */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 animate-pulse">
              ✓ Đã lưu cài đặt thành công!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </form>
    </div>
  )
}
