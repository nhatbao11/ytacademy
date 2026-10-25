import React from 'react'
import {
  Users,
  DollarSign,
  BookOpen,
  Star,
  Plus,
  KeyRound,
  FileCheck2,
} from 'lucide-react'
import type { IAdminCourse, IAdminStudent, IAdminReview, IAdminOrder } from '../types'
import { AdminRevenueCharts } from './AdminRevenueCharts'

interface OverviewProps {
  courses: IAdminCourse[]
  students: IAdminStudent[]
  reviews: IAdminReview[]
  orders?: IAdminOrder[]
  onOpenAddCourse: () => void
  onNavigateTab: (tab: any) => void
}

export const AdminOverviewTab: React.FC<OverviewProps> = ({
  courses,
  students,
  reviews,
  orders = [],
  onOpenAddCourse,
  onNavigateTab,
}) => {
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0)
  const totalStudents = students.length
  const publishedCourses = courses.filter((c) => c.isPublished).length
  const avgRating = reviews.length > 0 ? (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      {/* Top Banner Chào mừng & Thao tác nhanh */}
      <div className="bg-[#0B2545] text-white p-6 border-l-4 border-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Hệ Thống Quản Trị Trung Tâm EdTech
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            YT ACADEMY – BẢNG ĐIỀU KHIỂN QUẢN TRỊ
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Quản trị toàn diện học viên, danh mục đào tạo ACCA, đề thi CBE, mã kích hoạt và phản hồi học viên trên toàn hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddCourse}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khóa học mới</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('activations')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer transition-colors"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Cấp mã học</span>
          </button>
        </div>
      </div>

      {/* 4 THẺ CHỈ SỐ KPI CHÍNH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Doanh thu thực thu */}
        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh thu thực thu
            </span>
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-none">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {new Intl.NumberFormat('vi-VN').format(totalRevenue)} đ
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {completedOrders.length > 0
                ? `Từ ${completedOrders.length} học viên đã đóng học phí`
                : 'Chưa có đơn hoàn tất thanh toán'}
            </div>
          </div>
        </div>

        {/* KPI 2: Học viên đã đăng ký */}
        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Học viên đã đăng ký
            </span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center rounded-none">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {totalStudents} Học viên
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Đã ghi danh tài khoản & khóa học
            </div>
          </div>
        </div>

        {/* KPI 3: Khóa học mở bán */}
        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Môn học ACCA mở bán
            </span>
            <div className="w-9 h-9 bg-amber-50 text-amber-600 flex items-center justify-center rounded-none">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {publishedCourses} / {courses.length} Môn học
            </div>
            <div className="text-xs text-slate-500 mt-1">
              F3 1 Kèm 4, F3 Records, F3 Hybrid, F3, F7, F8
            </div>
          </div>
        </div>

        {/* KPI 4: Đánh giá chất lượng */}
        <div className="bg-white p-5 border border-slate-200 rounded-none shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Đánh giá trung bình
            </span>
            <div className="w-9 h-9 bg-yellow-50 text-amber-500 flex items-center justify-center rounded-none">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Dựa trên {reviews.length} đánh giá học viên thật
            </div>
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ SO SÁNH DOANH THU & PHÂN TÍCH HIỆU SUẤT TRỰC QUAN */}
      <AdminRevenueCharts orders={orders} students={students} />

      {/* LƯỚI NỘI DUNG 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Danh sách khóa học có nhiều học viên nhất (2/3 chiều rộng) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hiệu Quả Đào Tạo Các Môn ACCA
              </h2>
              <p className="text-xs text-slate-500">
                Theo dõi số lượng học viên và mức độ giảm giá từng môn
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('courses')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0B2545] text-amber-400 font-mono font-black text-xs flex flex-col items-center justify-center shrink-0 border border-amber-400/30">
                    <span>ACCA</span>
                    <span className="text-[10px] text-white font-bold">{course.code.split(' ')[1] || 'F3'}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        {course.format}
                      </span>
                      <span>•</span>
                      <span>Giảng viên: <strong className="text-slate-700">{course.instructorName}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                  <div className="text-sm font-black text-[#0B2545]">
                    {new Intl.NumberFormat('vi-VN').format(course.salePrice)} đ
                  </div>
                  <div className="text-xs font-semibold text-emerald-600">
                    {course.studentsCount} học viên đăng ký
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột 2: Đánh giá & Học viên đăng ký gần đây (1/3 chiều rộng) */}
        <div className="space-y-6">
          {/* Học viên mới nhất */}
          <div className="bg-white border border-slate-200 rounded-none p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Học viên đăng ký mới
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('students')}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-3">
              {students.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Chưa có học viên nào đăng ký tài khoản.</p>
              ) : (
                students.slice(0, 4).map((student) => (
                  <div key={student.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                    <div>
                      <div className="font-bold text-slate-800">{student.name}</div>
                      <div className="text-slate-500">{student.email}</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      student.role === 'admin'
                        ? 'bg-rose-100 text-rose-700'
                        : student.role === 'instructor'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {student.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Đánh giá mới nhất */}
          <div className="bg-white border border-slate-200 rounded-none p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Đánh giá mới gửi
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('reviews')}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Quản lý
              </button>
            </div>

            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Chưa có đánh giá nào từ học viên.</p>
              ) : (
                reviews.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{rev.studentName}</span>
                      <div className="flex text-amber-400">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-slate-600 italic line-clamp-2">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {rev.courseName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ĐƠN HÀNG HỌC PHÍ MỚI NHẤT */}
      {orders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-500" />
                <span>Danh Sách Đăng Ký Khóa Học Mới Nhất</span>
              </h2>
              <p className="text-xs text-slate-500">
                Các học viên vừa đăng ký môn học ACCA trên hệ thống
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Xem tất cả danh sách đăng ký →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mã đăng ký</th>
                  <th className="py-2.5 px-3">Học viên</th>
                  <th className="py-2.5 px-3">Môn học đã đăng ký</th>
                  <th className="py-2.5 px-3">Học phí tạm tính</th>
                  <th className="py-2.5 px-3">Hình thức</th>
                  <th className="py-2.5 px-3 text-center">Ghi danh</th>
                  <th className="py-2.5 px-3 text-center">Tình trạng học phí</th>
                  <th className="py-2.5 px-3 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {order.orderCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{order.studentName}</div>
                      <div className="text-[11px] text-slate-400">{order.studentEmail}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {order.courseName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-[#0B2545]">
                      {new Intl.NumberFormat('vi-VN').format(order.amount)} đ
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {order.paymentMethod}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-600 text-white rounded-none">
                        ✓ ĐÃ ĐĂNG KÝ
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {order.status === 'completed'
                          ? '✓ Đã nộp học phí'
                          : order.status === 'pending'
                          ? 'Chưa thanh toán'
                          : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {order.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
