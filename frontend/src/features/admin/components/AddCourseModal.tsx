import React, { useState } from 'react'
import { X, Plus, CheckCircle2 } from 'lucide-react'
import type { IAdminCourse } from '../types'

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCourse: (newCourse: IAdminCourse) => void
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  const [code, setCode] = useState('ACCA F3 (FA)')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Applied Knowledge')
  const [format, setFormat] = useState('Video Record')
  const [originalPrice, setOriginalPrice] = useState(3600000)
  const [salePrice, setSalePrice] = useState(2160000)
  const [instructorName, setInstructorName] = useState('Mr. Trần Minh Nhật')
  const [chaptersCount, setChaptersCount] = useState(15)
  const [lessonsCount, setLessonsCount] = useState(68)
  const [description, setDescription] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  // Tự động tính phần trăm giảm giá
  const discountPercent =
    originalPrice > 0 && salePrice < originalPrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const newCourse: IAdminCourse = {
      id: slug ? `c-${slug}` : `c-${Date.now()}`,
      code: code.trim(),
      title: title.trim(),
      category,
      format,
      originalPrice: Number(originalPrice),
      salePrice: Number(salePrice),
      discountPercent,
      studentsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      isPublished: true,
      instructorName: instructorName.trim(),
      chaptersCount: Number(chaptersCount),
      lessonsCount: Number(lessonsCount),
      description: description.trim() || 'Khóa học chứng chỉ kế toán công chứng Anh quốc ACCA Quốc tế tại YT Academy.',
    }

    setIsSuccess(true)
    setTimeout(() => {
      onAddCourse(newCourse)
      setIsSuccess(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-none shadow-2xl border border-slate-200 p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600">
              Quản Trị Khóa Học ACCA
            </span>
            <h2 className="text-xl font-black text-[#0B2545] tracking-tight uppercase">
              Thêm Khóa Học ACCA Mới
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">
              Đã thêm khóa học mới thành công!
            </h3>
            <p className="text-xs text-slate-500">
              Môn học đã được xuất bản và cập nhật vào danh mục trực tuyến.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Tên môn học */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên Khóa Học / Môn Học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: ACCA F2 – Management Accounting (MA / F2)"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-semibold focus:border-amber-500 focus:bg-white outline-none"
              />
            </div>

            {/* Hàng 2: Mã môn + Cấp độ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mã Môn ACCA
                </label>
                <select
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-medium focus:border-amber-500 outline-none"
                >
                  <option value="ACCA F1 (BT)">ACCA F1 – Business and Technology</option>
                  <option value="ACCA F2 (MA)">ACCA F2 – Management Accounting</option>
                  <option value="ACCA F3 (FA)">ACCA F3 – Financial Accounting</option>
                  <option value="ACCA F4 (LW)">ACCA F4 – Corporate and Business Law</option>
                  <option value="ACCA F5 (PM)">ACCA F5 – Performance Management</option>
                  <option value="ACCA F6 (TX)">ACCA F6 – Taxation</option>
                  <option value="ACCA F7 (FR)">ACCA F7 – Financial Reporting</option>
                  <option value="ACCA F8 (AA)">ACCA F8 – Audit and Assurance</option>
                  <option value="ACCA F9 (FM)">ACCA F9 – Financial Management</option>
                  <option value="ACCA SBL">ACCA SBL – Strategic Business Leader</option>
                  <option value="ACCA SBR">ACCA SBR – Strategic Business Reporting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cấp Độ Chứng Chỉ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-medium focus:border-amber-500 outline-none"
                >
                  <option value="Applied Knowledge">Applied Knowledge (Kiến thức ứng dụng - F1-F3)</option>
                  <option value="Applied Skills">Applied Skills (Kỹ năng ứng dụng - F4-F9)</option>
                  <option value="Strategic Professional">Strategic Professional (Chuyên nghiệp chiến lược)</option>
                </select>
              </div>
            </div>

            {/* Hàng 3: Hình thức học & Giảng viên */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hình thức đào tạo
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-medium focus:border-amber-500 outline-none"
                >
                  <option value="Video Record">Video Record (Học qua video quay sẵn)</option>
                  <option value="Online Hybrid (1:1 + Record)">Online Hybrid (Kết hợp 1:1 và Record)</option>
                  <option value="Online Meeting 1:1">Online Meeting 1:1 (Kèm trực tiếp)</option>
                  <option value="Nhóm nhỏ (3-5 học viên)">Nhóm nhỏ chất lượng cao (3-5 học viên)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Giảng viên chuyên môn
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm font-medium focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Hàng 4: Giá gốc & Giá khuyến mãi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/50 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Học phí gốc (VNĐ)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-none text-sm font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Học phí ưu đãi (VNĐ)
                  </label>
                  {discountPercent > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-600 text-white font-bold text-[10px]">
                      Giảm -{discountPercent}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step={50000}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-none text-sm font-bold text-[#0B2545] focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Hàng 5: Số chương & Số bài học */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Số lượng Chương học
                </label>
                <input
                  type="number"
                  value={chaptersCount}
                  onChange={(e) => setChaptersCount(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tổng số Video / Bài giảng
                </label>
                <input
                  type="number"
                  value={lessonsCount}
                  onChange={(e) => setLessonsCount(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Mô tả ngắn */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mô tả tóm tắt khóa học
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mục tiêu môn học, cấu trúc đề thi CBE, phương pháp đào tạo..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-none text-xs focus:border-amber-500 focus:bg-white outline-none resize-none"
              />
            </div>

            {/* Nút Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase cursor-pointer rounded-none"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer rounded-none shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Xác nhận Thêm Môn Học</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
