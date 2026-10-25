import React, { useState } from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import type { IAdminMaterial, IAdminCourse } from '../types'

interface MaterialsTabProps {
  materials: IAdminMaterial[]
  courses: IAdminCourse[]
  onAddMaterial: (m: IAdminMaterial) => void
  onDeleteMaterial: (id: string) => void
}

export const AdminMaterialsTab: React.FC<MaterialsTabProps> = ({
  materials,
  courses,
  onAddMaterial,
  onDeleteMaterial,
}) => {
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState(courses[0]?.id || 'c-fa-records')
  const [type, setType] = useState<'cbe_mock' | 'lecture_notes' | 'revision_kit'>('cbe_mock')

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const selectedCourse = courses.find((c) => c.id === courseId) || courses[0]

    onAddMaterial({
      id: `mat-${Date.now()}`,
      title: title.trim(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.title,
      type,
      fileFormat: type === 'cbe_mock' ? 'CBE Engine' : 'PDF',
      fileSize: '8.5 MB',
      downloadsCount: 0,
      updatedAt: new Date().toISOString().split('T')[0],
    })

    setTitle('')
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header & Upload Form */}
      <div className="bg-white p-5 border border-slate-200">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
          Kho Đề Thi Thử CBE & Tài Liệu Bài Giảng ({materials.length} Tài liệu)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Tải lên đề thi mô phỏng format CBE của ACCA Global, slide bài giảng của thầy Trần Minh Nhật và ngân hàng câu hỏi
        </p>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-50 border border-slate-200">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Tiêu Đề Đề Thi / Tài Liệu
            </label>
            <input
              type="text"
              required
              placeholder="VD: Đề Thi Thử CBE F3 - Bộ 02 (Kèm Bút Toán Hạch Toán)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-semibold outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Phân Loại
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-medium outline-none focus:border-amber-500"
            >
              <option value="cbe_mock">Đề Thi CBE Mô Phỏng</option>
              <option value="lecture_notes">Slide Bài Giảng PDF</option>
              <option value="revision_kit">Revision Kit / Bài Tập</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Môn Học Áp Dụng
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-medium outline-none focus:border-amber-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.title.split('–')[1] || c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-9 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Tải</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách tài liệu dạng bảng rộng */}
      <div className="bg-white border border-slate-200 overflow-x-auto shadow-xs w-full">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Tài Liệu / Đề Thi CBE</th>
              <th className="py-3 px-4">Môn Học</th>
              <th className="py-3 px-4">Phân Loại</th>
              <th className="py-3 px-4">Dung Lượng</th>
              <th className="py-3 px-4 text-center">Lượt Học Viên Tải</th>
              <th className="py-3 px-4">Ngày Cập Nhật</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  Chưa có tài liệu hoặc đề thi nào. Giảng viên có thể đăng tải tài liệu ở biểu mẫu phía trên.
                </td>
              </tr>
            ) : (
              materials.map((mat) => (
              <tr key={mat.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{mat.title}</div>
                      <div className="text-[10px] text-slate-400">Định dạng: {mat.fileFormat}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {mat.courseName}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                    {mat.type === 'cbe_mock'
                      ? 'Đề Thi CBE'
                      : mat.type === 'lecture_notes'
                      ? 'Slide Bài Giảng'
                      : 'Revision Kit'}
                  </span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono">
                  {mat.fileSize}
                </td>

                <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold text-[#0B2545]">
                  {mat.downloadsCount} lượt
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                  {mat.updatedAt}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onDeleteMaterial(mat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-none cursor-pointer"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-4 h-4" />
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
