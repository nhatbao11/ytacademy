import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import type { IAdminCourse } from '../types'

interface CoursesTabProps {
  courses: IAdminCourse[]
  onOpenAddModal: () => void
  onTogglePublish: (id: string) => void
  onDeleteCourse: (id: string) => void
}

export const AdminCoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  onOpenAddModal,
  onTogglePublish,
  onDeleteCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory =
      selectedCategory === 'all' || c.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Danh Mục Đào Tạo Chứng Chỉ ACCA ({courses.length} Môn học)
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý học phí, hình thức học, giáo trình và trạng thái hiển thị trên website
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 cursor-pointer shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khóa Học Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1">
          {['all', 'Applied Knowledge', 'Applied Skills', 'Strategic Professional'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors rounded-none cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B2545] text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'all' ? 'Tất cả cấp độ' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã môn, tên môn..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng danh sách khóa học */}
      <div className="bg-white border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Môn Học</th>
              <th className="py-3 px-4">Cấp Độ & Hình Thức</th>
              <th className="py-3 px-4">Học Phí</th>
              <th className="py-3 px-4 text-center">Học Viên Đã Đăng Ký</th>
              <th className="py-3 px-4 text-center">Đánh Giá</th>
              <th className="py-3 px-4 text-center">Trạng Thái</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {filtered.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Cột Tên môn */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-bold text-slate-900 line-clamp-1">
                    {course.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Mã: {course.code} • Giảng viên: {course.instructorName}
                  </div>
                </td>

                {/* Cột Cấp độ & format */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-800 block">
                    {course.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-semibold inline-block mt-0.5">
                    {course.format}
                  </span>
                </td>

                {/* Cột Học phí */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-[#0B2545] text-sm">
                    {new Intl.NumberFormat('vi-VN').format(course.salePrice)} đ
                  </div>
                  <div className="text-[11px] text-slate-400 line-through">
                    {new Intl.NumberFormat('vi-VN').format(course.originalPrice)} đ
                  </div>
                  {course.discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2">
                      -{course.discountPercent}%
                    </span>
                  )}
                </td>

                {/* Cột Học viên đã đăng ký */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="font-bold text-[#0B2545] text-sm">{course.studentsCount}</span>
                  <span className="text-emerald-700 text-[10px] font-bold block">đã đăng ký</span>
                </td>

                {/* Cột Rating */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="font-bold text-amber-600">★ {course.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-[10px] block">({course.reviewsCount})</span>
                </td>

                {/* Cột Trạng thái */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onTogglePublish(course.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase rounded-none cursor-pointer transition-colors ${
                      course.isPublished
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {course.isPublished ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Mở Bán</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>Ẩn / Nháp</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Cột Thao tác */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Xem trang khóa học"
                      onClick={() => window.open(`/khoa-hoc/${course.id}`, '_blank')}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer rounded-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Chỉnh sửa môn học"
                      onClick={() => alert(`Chỉnh sửa môn học: ${course.title}`)}
                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer rounded-none"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Xóa môn học"
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa môn học: ${course.title}?`)) {
                          onDeleteCourse(course.id)
                        }
                      }}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer rounded-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
