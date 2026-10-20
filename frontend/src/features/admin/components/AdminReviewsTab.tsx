import React, { useState } from 'react'
import { Star, CheckCircle, XCircle, Trash2, Search } from 'lucide-react'
import type { IAdminReview } from '../types'

interface ReviewsTabProps {
  reviews: IAdminReview[]
  onApproveReview: (id: string) => void
  onRejectReview: (id: string) => void
  onDeleteReview: (id: string) => void
}

export const AdminReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  onApproveReview,
  onRejectReview,
  onDeleteReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all')

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Quản Lý Đánh Giá & Cảm Nhận Học Viên ({reviews.length} Lượt)
          </h2>
          <p className="text-xs text-slate-500">
            Duyệt hiển thị các đánh giá thật của học viên ACCA lên trang chủ và trang chi tiết môn học
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Tất cả đánh giá' },
            { id: 'approved', label: 'Đã duyệt hiển thị' },
            { id: 'pending', label: 'Chờ duyệt / Ẩn' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors rounded-none cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-[#0B2545] text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung, tên học viên..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Danh sách thẻ Review */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-4 sm:p-5 border border-slate-200 rounded-none shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {rev.studentName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({rev.studentEmail})
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {rev.createdAt}
                </span>

                <span
                  className={`ml-auto sm:ml-2 px-2 py-0.5 text-[10px] font-bold uppercase ${
                    rev.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rev.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                </span>
              </div>

              {/* Số sao & Khóa học */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-amber-600">({rev.rating}/5)</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5">
                  Khóa học: {rev.courseName}
                </span>
              </div>

              {/* Nội dung phản hồi */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 border-l-2 border-amber-400 italic">
                "{rev.comment}"
              </p>
            </div>

            {/* Thao tác */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {rev.status !== 'approved' ? (
                <button
                  type="button"
                  onClick={() => onApproveReview(rev.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center gap-1 rounded-none cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Duyệt Hiển Thị</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRejectReview(rev.id)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase flex items-center gap-1 rounded-none cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Ẩn Đánh Giá</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
                    onDeleteReview(rev.id)
                  }
                }}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-none cursor-pointer"
                title="Xóa đánh giá"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
