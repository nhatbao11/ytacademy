import React, { useState } from 'react'
import { Search, Download } from 'lucide-react'
import type { IAdminOrder } from '../types'

interface OrdersTabProps {
  orders: IAdminOrder[]
  onApproveOrder: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
}

export const AdminOrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onApproveOrder,
  onCancelOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all')

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentPhone.includes(searchTerm)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalCollected = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0)
  const totalPending = orders
    .filter((o) => o.status === 'pending')
    .reduce((sum, o) => sum + o.amount, 0)

  const handleExportCSV = () => {
    const headers = 'Mã Đơn,Học Viên,Email,SĐT,Khóa Học,Học Phí,Hình Thức,Trạng Thái,Thời Gian\n'
    const rows = filtered
      .map(
        (o) =>
          `"${o.orderCode}","${o.studentName}","${o.studentEmail}","${o.studentPhone}","${o.courseName}",${o.amount},"${o.paymentMethod}","${o.status}","${o.createdAt}"`
      )
      .join('\n')
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `YT_Academy_Don_Hang_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-5 w-full">
      {/* Top Banner KPI Đơn hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Lượt Đã Đăng Ký Thành Công
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {orders.filter((o) => o.status === 'completed').length} Lượt Đăng Ký
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Tổng học phí: {new Intl.NumberFormat('vi-VN').format(totalCollected)} đ
          </span>
        </div>

        <div className="bg-white p-5 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Đăng Ký Chờ Xác Nhận
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {orders.filter((o) => o.status === 'pending').length} Yêu Cầu
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Tạm tính: {new Intl.NumberFormat('vi-VN').format(totalPending)} đ
          </span>
        </div>

        <div className="bg-white p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Xuất Báo Cáo Kế Toán
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Tải file CSV danh sách thanh toán để đối soát số dư ngân hàng
            </span>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="mt-3 py-2 px-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Tải Báo Cáo CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'Tất cả đơn hàng' },
            { id: 'completed', label: 'Đã hoàn tất' },
            { id: 'pending', label: 'Chờ thanh toán' },
            { id: 'cancelled', label: 'Đã hủy' },
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-none text-xs focus:bg-white focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng đơn hàng tràn rộng */}
      <div className="bg-white border border-slate-200 overflow-x-auto shadow-xs w-full">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B2545] text-white uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Mã Đơn Hàng</th>
              <th className="py-3 px-4">Học Viên & Liên Hệ</th>
              <th className="py-3 px-4">Môn Học Đã Đăng Ký</th>
              <th className="py-3 px-4">Số Tiền</th>
              <th className="py-3 px-4">Phương Thức</th>
              <th className="py-3 px-4 text-center">Trạng Thái Đăng Ký</th>
              <th className="py-3 px-4">Thời Gian</th>
              <th className="py-3 px-4 text-right">Xử Lý Đơn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Chưa có lượt đăng ký khóa học nào.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Mã đơn */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-200">
                    {order.orderCode}
                  </span>
                </td>

                {/* Học viên */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{order.studentName}</div>
                  <div className="text-[11px] text-slate-500">
                    {order.studentPhone} • {order.studentEmail}
                  </div>
                </td>

                {/* Khóa học */}
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {order.courseName}
                </td>

                {/* Số tiền */}
                <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#0B2545] text-sm">
                  {new Intl.NumberFormat('vi-VN').format(order.amount)} đ
                </td>

                {/* Phương thức */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {order.paymentMethod}
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-none shadow-2xs ${
                      order.status === 'completed'
                        ? 'bg-emerald-600 text-white border border-emerald-500'
                        : order.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {order.status === 'completed'
                      ? '✓ ĐÃ ĐĂNG KÝ'
                      : order.status === 'pending'
                      ? '⏳ Chờ Xác Nhận'
                      : 'Đã Hủy'}
                  </span>
                </td>

                {/* Thời gian */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                  {order.createdAt}
                </td>

                {/* Hành động */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {order.status === 'pending' && (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApproveOrder(order.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-none cursor-pointer"
                        title="Xác nhận đăng ký học viên"
                      >
                        Xác Nhận Đăng Ký
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelOrder(order.id)}
                        className="px-2 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold text-[10px] uppercase rounded-none cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                  {order.status === 'completed' && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                      <span>✓ Đã đăng ký</span>
                    </span>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
