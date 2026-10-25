import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { IAdminVoucher } from '../types'

interface VouchersTabProps {
  vouchers: IAdminVoucher[]
  onAddVoucher: (v: IAdminVoucher) => void
  onDeleteVoucher: (id: string) => void
}

export const AdminVouchersTab: React.FC<VouchersTabProps> = ({
  vouchers,
  onAddVoucher,
  onDeleteVoucher,
}) => {
  const [newCode, setNewCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent')
  const [discountValue, setDiscountValue] = useState(15)
  const [maxUses, setMaxUses] = useState(50)
  const [validUntil, setValidUntil] = useState('2026-12-31')

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim()) return

    onAddVoucher({
      id: `vouch-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      applicableCourseId: 'all',
      maxUses: Number(maxUses),
      usedCount: 0,
      validUntil,
      status: 'active',
    })

    setNewCode('')
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header & Create Form */}
      <div className="bg-white p-5 border border-slate-200">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
          Mã Ưu Đãi & Khuyến Mãi Flash Sale ({vouchers.length} Mã)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Tạo mã voucher giảm học phí cho các chiến dịch tuyển sinh hoặc hỗ trợ sinh viên
        </p>

        <form onSubmit={handleCreateVoucher} className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-4 bg-slate-50 border border-slate-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mã Voucher
            </label>
            <input
              type="text"
              required
              placeholder="VD: ACCA2026"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 font-mono font-bold text-xs uppercase outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Loại Giảm
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-semibold outline-none focus:border-amber-500"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt cố định (đ)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Giá Trị Giảm
            </label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-bold outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Số Lượng Dùng
            </label>
            <input
              type="number"
              required
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs font-bold outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Hạn Sử Dụng
            </label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-slate-300 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-9 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Mã</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách Vouchers */}
      {vouchers.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate-200 text-slate-400 text-xs">
          Chưa có mã voucher nào được tạo. Bạn có thể tạo mã ưu đãi mới ở biểu mẫu phía trên.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="bg-white border-2 border-slate-200 p-5 rounded-none shadow-xs relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-lg text-[#0B2545] tracking-wider bg-amber-100/60 px-3 py-1 border border-amber-300">
                  {v.code}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteVoucher(v.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Xóa voucher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 my-2">
                <div className="flex items-center justify-between">
                  <span>Mức giảm:</span>
                  <strong className="text-rose-600 text-sm">
                    {v.discountType === 'percent'
                      ? `-${v.discountValue}%`
                      : `-${new Intl.NumberFormat('vi-VN').format(v.discountValue)} đ`}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Đã sử dụng:</span>
                  <span className="font-semibold text-slate-800">
                    {v.usedCount} / {v.maxUses} lượt
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hết hạn:</span>
                  <span className="font-mono text-slate-500">{v.validUntil}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5">
                  ● Đang Hoạt Động
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(v.code)
                    alert(`Đã sao chép mã: ${v.code}`)
                  }}
                  className="text-amber-700 font-bold hover:underline cursor-pointer"
                >
                  Sao chép mã
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
