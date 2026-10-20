import React, { useState } from 'react'
import { Plus, Copy, Check } from 'lucide-react'
import type { IAdminActivationCode, IAdminCourse } from '../types'

interface ActivationTabProps {
  codes: IAdminActivationCode[]
  courses: IAdminCourse[]
  onGenerateCode: (courseId: string, courseName: string) => void
  onRevokeCode: (codeId: string) => void
}

export const AdminActivationTab: React.FC<ActivationTabProps> = ({
  codes,
  courses,
  onGenerateCode,
  onRevokeCode,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c-fa-records')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 1500)
  }

  const handleCreate = () => {
    const course = courses.find((c) => c.id === selectedCourseId) || courses[0]
    onGenerateCode(course.id, course.title)
  }

  return (
    <div className="space-y-5">
      {/* Header & Quick Code Generator */}
      <div className="bg-white p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Quản Lý Mã Kích Hoạt Môn Học ({codes.length} Mã)
          </h2>
          <p className="text-xs text-slate-500">
            Cấp mã học viên sau khi hoàn tất thanh toán học phí qua hotline, Zalo hoặc ngân hàng
          </p>
        </div>

        {/* Bộ sinh mã nhanh */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-xs font-semibold focus:border-amber-500 outline-none max-w-xs"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.format}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCreate}
            className="h-10 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Sinh Mã Mới</span>
          </button>
        </div>
      </div>

      {/* Bảng mã kích hoạt */}
      <div className="bg-white border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Mã Kích Hoạt (Activation Code)</th>
              <th className="py-3 px-4">Môn Học ACCA Áp Dụng</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4">Học Viên Sử Dụng</th>
              <th className="py-3 px-4">Ngày Hết Hạn</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {codes.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Cột Mã */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 text-xs border border-slate-300 select-all">
                      {item.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code, item.id)}
                      className="p-1 hover:bg-slate-200 text-slate-500 rounded-none cursor-pointer"
                      title="Sao chép mã"
                    >
                      {copiedCodeId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Môn học */}
                <td className="py-3 px-4 font-bold text-slate-800">
                  {item.courseName}
                </td>

                {/* Trạng thái */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-none ${
                      item.status === 'unused'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'used'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status === 'unused'
                      ? 'Chưa sử dụng'
                      : item.status === 'used'
                      ? 'Đã kích hoạt'
                      : 'Đã thu hồi'}
                  </span>
                </td>

                {/* Học viên */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                  {item.usedByEmail ? (
                    <div>
                      <div className="font-semibold text-slate-800">{item.usedByEmail}</div>
                      <div className="text-[10px] text-slate-400">Lúc: {item.usedAt}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Chưa có</span>
                  )}
                </td>

                {/* Hạn dùng */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                  {item.expiresAt}
                </td>

                {/* Thao tác */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  {item.status === 'unused' && (
                    <button
                      type="button"
                      onClick={() => onRevokeCode(item.id)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] uppercase rounded-none cursor-pointer"
                    >
                      Thu Hồi Mã
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
