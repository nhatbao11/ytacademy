import React, { useState } from 'react'
import { Search, UserPlus, Lock, Unlock, Mail, Phone, Check } from 'lucide-react'
import type { IAdminStudent } from '../types'

interface StudentsTabProps {
  students: IAdminStudent[]
  onChangeRole: (studentId: string, newRole: any) => void
  onToggleStatus: (studentId: string) => void
  onAddStudent: (student: IAdminStudent) => void
}

export const AdminStudentsTab: React.FC<StudentsTabProps> = ({
  students,
  onChangeRole,
  onToggleStatus,
  onAddStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
    const matchRole = roleFilter === 'all' || s.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Quản Lý Học Viên & Phân Quyền RBAC ({students.length} Tài khoản)
          </h2>
          <p className="text-xs text-slate-500">
            Xem danh sách người dùng, kiểm soát trạng thái học tập và thay đổi vai trò (Học viên, Quản trị viên, Giảng viên, CTV)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const name = prompt('Nhập họ và tên học viên:')
            if (!name) return
            const email = prompt('Nhập email học viên:')
            if (!email) return
            const phone = prompt('Nhập số điện thoại:') || '0901 000 000'

            onAddStudent({
              id: `std-${Date.now()}`,
              name,
              email,
              phone,
              role: 'student',
              enrolledCourseIds: ['c-fa-records'],
              status: 'active',
              registeredAt: new Date().toISOString().split('T')[0],
              totalSpent: 2160000,
            })
          }}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Học Viên Mới</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'Tất cả vai trò' },
            { id: 'student', label: 'Học viên' },
            { id: 'admin', label: 'Quản trị viên' },
            { id: 'instructor', label: 'Giảng viên' },
            { id: 'collaborator', label: 'Cộng tác viên' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleFilter(r.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors rounded-none cursor-pointer ${
                roleFilter === r.id
                  ? 'bg-[#0B2545] text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Họ Và Tên / Email</th>
              <th className="py-3 px-4">Số Điện Thoại</th>
              <th className="py-3 px-4">Vai Trò (Role RBAC)</th>
              <th className="py-3 px-4 text-center">Khóa Học Đã Đăng Ký</th>
              <th className="py-3 px-4 text-center">Tình Trạng Học Phí</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-right">Khóa / Mở</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Chưa có tài khoản học viên nào.
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Tên & email */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{student.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{student.email}</span>
                  </div>
                </td>

                {/* SĐT */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Gia nhập: {student.registeredAt}
                  </div>
                </td>

                {/* Dropdown Phân quyền RBAC trực tiếp */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <select
                    value={student.role}
                    onChange={(e) => onChangeRole(student.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-none border border-slate-300 outline-none cursor-pointer ${
                      student.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : student.role === 'instructor'
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : student.role === 'collaborator'
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <option value="student">Học viên (student)</option>
                    <option value="instructor">Giảng viên (instructor)</option>
                    <option value="collaborator">Cộng tác viên (collaborator)</option>
                    <option value="assistant">Trợ giảng (assistant)</option>
                    <option value="admin">Quản trị viên (admin)</option>
                  </select>
                </td>

                {/* Môn học đã đăng ký */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {student.enrolledCourseIds && student.enrolledCourseIds.length > 0 ? (
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-none flex items-center gap-1 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ĐÃ ĐĂNG KÝ ({student.enrolledCourseIds.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                        {student.enrolledCourseIds.map((cid) => (
                          <span
                            key={cid}
                            className="text-[10px] bg-slate-100 text-slate-800 font-semibold px-1.5 py-0.2 border border-slate-200 uppercase font-mono"
                          >
                            {cid.replace(/^c-/, '').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Chưa đăng ký môn nào
                    </span>
                  )}
                </td>

                {/* Tình trạng học phí */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {student.totalSpent > 0 ? (
                    <div>
                      <div className="font-bold text-emerald-700">
                        {new Intl.NumberFormat('vi-VN').format(student.totalSpent)} đ
                      </div>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 font-semibold inline-block">
                        ✓ Đã thanh toán
                      </span>
                    </div>
                  ) : student.enrolledCourseIds && student.enrolledCourseIds.length > 0 ? (
                    <div>
                      <div className="font-bold text-amber-700">
                        Chờ đóng phí
                      </div>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 border border-amber-200 font-bold inline-block">
                        Chưa thanh toán
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Chưa phát sinh
                    </span>
                  )}
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-none ${
                      student.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {student.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </td>

                {/* Nút Khóa / Mở */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(student.id)}
                    className={`p-1.5 rounded-none cursor-pointer ${
                      student.status === 'active'
                        ? 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    }`}
                    title={student.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                  >
                    {student.status === 'active' ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
