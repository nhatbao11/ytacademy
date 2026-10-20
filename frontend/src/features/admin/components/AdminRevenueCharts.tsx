import React, { useState } from 'react'
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  Target,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react'

type PeriodType = '6months' | 'quarters' | 'weeks'
type MetricType = 'revenue' | 'students' | 'aov'
type ChartViewType = 'bar' | 'area'
type BreakdownType = 'category' | 'format'

interface MonthlyData {
  label: string
  subLabel: string
  actualRevenue: number
  targetRevenue: number
  students: number
  aov: number
  growthPercent: number
}

const SIX_MONTHS_DATA: MonthlyData[] = [
  {
    label: 'Tháng 05',
    subLabel: 'Kỳ tuyển sinh Hè',
    actualRevenue: 16800000,
    targetRevenue: 15000000,
    students: 8,
    aov: 2100000,
    growthPercent: 12.0,
  },
  {
    label: 'Tháng 06',
    subLabel: 'Ôn thi Kỳ T6',
    actualRevenue: 21500000,
    targetRevenue: 19000000,
    students: 11,
    aov: 1954000,
    growthPercent: 28.0,
  },
  {
    label: 'Tháng 07',
    subLabel: 'Khai giảng F3/F7',
    actualRevenue: 26400000,
    targetRevenue: 24000000,
    students: 14,
    aov: 1885000,
    growthPercent: 22.8,
  },
  {
    label: 'Tháng 08',
    subLabel: 'Cao điểm Back2School',
    actualRevenue: 33200000,
    targetRevenue: 29000000,
    students: 18,
    aov: 1844000,
    growthPercent: 25.7,
  },
  {
    label: 'Tháng 09',
    subLabel: 'Chạy đà Kỳ T12',
    actualRevenue: 38900000,
    targetRevenue: 35000000,
    students: 21,
    aov: 1852000,
    growthPercent: 17.2,
  },
  {
    label: 'Tháng 10',
    subLabel: 'Hiện tại (Ưu đãi)',
    actualRevenue: 45600000,
    targetRevenue: 40000000,
    students: 25,
    aov: 1824000,
    growthPercent: 17.2,
  },
]

const QUARTERS_DATA: MonthlyData[] = [
  {
    label: 'Quý 1',
    subLabel: 'Q1 / 2026',
    actualRevenue: 52000000,
    targetRevenue: 48000000,
    students: 28,
    aov: 1857000,
    growthPercent: 15.6,
  },
  {
    label: 'Quý 2',
    subLabel: 'Q2 / 2026',
    actualRevenue: 64700000,
    targetRevenue: 58000000,
    students: 35,
    aov: 1848000,
    growthPercent: 24.4,
  },
  {
    label: 'Quý 3',
    subLabel: 'Q3 / 2026',
    actualRevenue: 98500000,
    targetRevenue: 88000000,
    students: 53,
    aov: 1858000,
    growthPercent: 52.2,
  },
  {
    label: 'Quý 4 (Dự báo)',
    subLabel: 'Q4 / 2026 Target',
    actualRevenue: 125000000,
    targetRevenue: 110000000,
    students: 68,
    aov: 1838000,
    growthPercent: 26.9,
  },
]

const WEEKS_DATA: MonthlyData[] = [
  {
    label: 'Tuần 1',
    subLabel: '01/10 - 07/10',
    actualRevenue: 9800000,
    targetRevenue: 8500000,
    students: 5,
    aov: 1960000,
    growthPercent: 15.3,
  },
  {
    label: 'Tuần 2',
    subLabel: '08/10 - 14/10',
    actualRevenue: 11400000,
    targetRevenue: 10000000,
    students: 6,
    aov: 1900000,
    growthPercent: 16.3,
  },
  {
    label: 'Tuần 3',
    subLabel: '15/10 - 21/10',
    actualRevenue: 12900000,
    targetRevenue: 11000000,
    students: 7,
    aov: 1842000,
    growthPercent: 13.1,
  },
  {
    label: 'Tuần 4',
    subLabel: '22/10 - 28/10',
    actualRevenue: 11500000,
    targetRevenue: 10500000,
    students: 7,
    aov: 1642000,
    growthPercent: -10.8,
  },
]

// Dữ liệu cơ cấu doanh thu theo Cấp độ ACCA
const CATEGORY_BREAKDOWN = [
  {
    name: 'Applied Knowledge (F1, F2, F3)',
    code: 'F1 - F3',
    revenue: 58500000,
    percentage: 42,
    students: 36,
    color: '#0B2545', // Navy
    growth: '+28%',
  },
  {
    name: 'Applied Skills (F7, F8, F9, F4-F6)',
    code: 'F4 - F9',
    revenue: 53000000,
    percentage: 38,
    students: 28,
    color: '#F59E0B', // Gold
    growth: '+21%',
  },
  {
    name: 'Strategic Professional (SBL, SBR, P)',
    code: 'SBL / SBR',
    revenue: 27900000,
    percentage: 20,
    students: 12,
    color: '#10B981', // Emerald
    growth: '+14%',
  },
]

// Dữ liệu cơ cấu theo Hình thức đào tạo
const FORMAT_BREAKDOWN = [
  {
    name: 'Video Record Trọn Khóa',
    code: 'Record Online',
    revenue: 72500000,
    percentage: 52,
    students: 48,
    color: '#0B2545',
    growth: '+35%',
  },
  {
    name: 'Lớp Hybrid (Video + Mentor)',
    code: 'Hybrid Mentor',
    revenue: 47400000,
    percentage: 34,
    students: 22,
    color: '#F59E0B',
    growth: '+18%',
  },
  {
    name: 'Lớp 1-to-1 Kèm Chuyên Sâu VIP',
    code: '1-to-1 Master',
    revenue: 19500000,
    percentage: 14,
    students: 6,
    color: '#6366F1', // Indigo
    growth: '+40%',
  },
]

// Phễu tuyển sinh học viên
const ENROLLMENT_FUNNEL = [
  {
    step: '1. Tiếp cận & Ghé thăm',
    description: 'Học viên xem chương trình đào tạo & đề thi ACCA',
    count: 14250,
    percentage: 100,
    color: 'bg-slate-700',
  },
  {
    step: '2. Đăng ký nhận tài liệu & Tư vấn',
    description: 'Để lại thông tin nhận Syllabus, Mindmap & Lộ trình',
    count: 3840,
    percentage: 26.9,
    color: 'bg-[#0B2545]',
  },
  {
    step: '3. Tham gia Thi thử CBE Mock Exam',
    description: 'Làm đề thi thử trắc nghiệm & tự luận được chấm điểm',
    count: 1960,
    percentage: 13.7,
    color: 'bg-blue-600',
  },
  {
    step: '4. Đóng học phí & Nhập học chính thức',
    description: 'Thanh toán VietQR / Thẻ và nhận mã kích hoạt học tập',
    count: 840,
    percentage: 5.9,
    color: 'bg-amber-500',
  },
]

export const AdminRevenueCharts: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('6months')
  const [metric, setMetric] = useState<MetricType>('revenue')
  const [chartView, setChartView] = useState<ChartViewType>('bar')
  const [breakdownType, setBreakdownType] = useState<BreakdownType>('category')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Chọn bộ dữ liệu theo khoảng thời gian
  const activeData: MonthlyData[] =
    period === '6months'
      ? SIX_MONTHS_DATA
      : period === 'quarters'
      ? QUARTERS_DATA
      : WEEKS_DATA

  // Tính toán đỉnh cực đại để chuẩn hóa chiều cao cột
  const maxMetricValue = Math.max(
    ...activeData.map((d) =>
      metric === 'revenue'
        ? Math.max(d.actualRevenue, d.targetRevenue)
        : metric === 'students'
        ? d.students * 1.3
        : d.aov * 1.2
    )
  )

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + ' tỷ đ'
    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' tr đ'
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
  }

  const activeBreakdown =
    breakdownType === 'category' ? CATEGORY_BREAKDOWN : FORMAT_BREAKDOWN

  return (
    <div className="space-y-6">
      {/* KHỐI 1: SƠ ĐỒ SO SÁNH DOANH THU & XU HƯỚNG TĂNG TRƯỞNG */}
      <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs">
        {/* Tiêu đề & Bộ điều khiển trực quan */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-400"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Phân Tích Dữ Liệu Kinh Doanh Trực Quan
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2545] tracking-tight mt-1 flex items-center gap-2">
              <span>SƠ ĐỒ SO SÁNH DOANH THU & HIỆU SUẤT ĐÀO TẠO</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-none uppercase">
                Tăng trưởng +24.8%
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              So sánh trực quan giữa Doanh thu thực tế thu về và Mục tiêu kinh doanh (KPI) theo từng chu kỳ.
            </p>
          </div>

          {/* Các nút bấm tương tác đa chiều */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Bộ lọc chu kỳ */}
            <div className="flex items-center bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPeriod('6months')}
                className={`px-3 py-1.5 font-bold cursor-pointer transition-colors ${
                  period === '6months'
                    ? 'bg-[#0B2545] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6 Tháng
              </button>
              <button
                type="button"
                onClick={() => setPeriod('quarters')}
                className={`px-3 py-1.5 font-bold cursor-pointer transition-colors ${
                  period === 'quarters'
                    ? 'bg-[#0B2545] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Theo Quý
              </button>
              <button
                type="button"
                onClick={() => setPeriod('weeks')}
                className={`px-3 py-1.5 font-bold cursor-pointer transition-colors ${
                  period === 'weeks'
                    ? 'bg-[#0B2545] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4 Tuần Qua
              </button>
            </div>

            {/* Bộ lọc chỉ số Metric */}
            <div className="flex items-center bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMetric('revenue')}
                className={`px-2.5 py-1.5 font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  metric === 'revenue'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Doanh Thu</span>
              </button>
              <button
                type="button"
                onClick={() => setMetric('students')}
                className={`px-2.5 py-1.5 font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  metric === 'students'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Số Học Viên</span>
              </button>
              <button
                type="button"
                onClick={() => setMetric('aov')}
                className={`px-2.5 py-1.5 font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  metric === 'aov'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>AOV (Đơn TB)</span>
              </button>
            </div>

            {/* Kiểu đồ thị: Cột vs Vùng diện tích */}
            <div className="flex items-center bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setChartView('bar')}
                title="Biểu đồ cột so sánh"
                className={`p-1.5 cursor-pointer ${
                  chartView === 'bar'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setChartView('area')}
                title="Biểu đồ xu hướng vùng"
                className={`p-1.5 cursor-pointer ${
                  chartView === 'area'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chú thích Legend trực quan */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 bg-slate-50 px-4 border-x border-b border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[#0B2545]"></span>
              <span className="font-bold text-slate-700">
                Thực Thu (Actual Revenue)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-amber-400"></span>
              <span className="font-bold text-slate-700">
                Chỉ Tiêu KPI Đặt Ra (Target)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-emerald-500 border-t-2 border-emerald-500"></span>
              <span className="font-semibold text-slate-600">
                Đường Tăng Trưởng Lũy Kế
              </span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px] font-mono">
            * Cập nhật thời gian thực theo đơn hàng hoàn tất
          </div>
        </div>

        {/* KHÔNG GIAN ĐỒ HỌA BIỂU ĐỒ SVG CHUYÊN NGHIỆP */}
        <div className="mt-6 relative">
          {/* Lưới đường kẻ ngang mờ chuẩn tài chính */}
          <div className="absolute inset-x-0 inset-y-6 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-300 w-full"></div>
            <div className="border-b border-dashed border-slate-300 w-full"></div>
            <div className="border-b border-dashed border-slate-300 w-full"></div>
            <div className="border-b border-dashed border-slate-300 w-full"></div>
          </div>

          {/* VÙNG CHỨA CÁC CỘT DỮ LIỆU */}
          {chartView === 'bar' ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-4 items-end h-72 pt-6 pb-2 px-2">
              {activeData.map((item, idx) => {
                const actualHeight = Math.round(
                  ((metric === 'revenue'
                    ? item.actualRevenue
                    : metric === 'students'
                    ? item.students
                    : item.aov) /
                    maxMetricValue) *
                    100
                )
                const targetHeight = Math.round(
                  ((metric === 'revenue'
                    ? item.targetRevenue
                    : metric === 'students'
                    ? item.students * 0.9
                    : item.aov * 0.95) /
                    maxMetricValue) *
                    100
                )

                const isHovered = hoveredIdx === idx
                const isOverTarget = item.actualRevenue >= item.targetRevenue

                return (
                  <div
                    key={item.label}
                    className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip khi Hover */}
                    {isHovered && (
                      <div className="absolute -top-24 z-30 bg-slate-900 text-white text-xs p-3 rounded-none shadow-xl border border-amber-400 min-w-[210px] pointer-events-none transition-all">
                        <div className="font-bold text-amber-400 border-b border-slate-700 pb-1 flex justify-between">
                          <span>{item.label}</span>
                          <span>{item.subLabel}</span>
                        </div>
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Thực thu:</span>
                            <span className="font-mono font-bold text-emerald-400">
                              {new Intl.NumberFormat('vi-VN').format(
                                item.actualRevenue
                              )}{' '}
                              đ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Mục tiêu KPI:</span>
                            <span className="font-mono text-slate-300">
                              {new Intl.NumberFormat('vi-VN').format(
                                item.targetRevenue
                              )}{' '}
                              đ
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Số học viên:</span>
                            <span className="font-bold text-white">
                              {item.students} học viên
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800">
                            <span className="text-slate-400">Tăng trưởng:</span>
                            <span
                              className={`font-bold ${
                                item.growthPercent >= 0
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {item.growthPercent >= 0 ? '+' : ''}
                              {item.growthPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Huy hiệu % vượt KPI phía trên cột */}
                    <div
                      className={`text-[10px] font-mono font-bold mb-1 transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-80'
                      } ${
                        isOverTarget ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {item.growthPercent >= 0 ? '+' : ''}
                      {item.growthPercent}%
                    </div>

                    {/* Cặp Cột So Sánh: Cột Thực thu & Cột Target */}
                    <div className="flex items-end gap-1 sm:gap-2 w-full max-w-[56px] justify-center">
                      {/* Cột 1: Thực tế (Navy / Gold highlight) */}
                      <div
                        style={{ height: `${Math.max(actualHeight, 6)}%` }}
                        className={`w-1/2 transition-all duration-300 relative ${
                          isHovered
                            ? 'bg-amber-400 shadow-md'
                            : 'bg-[#0B2545] hover:bg-[#123969]'
                        }`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>
                      </div>

                      {/* Cột 2: Mục tiêu KPI (Slate) */}
                      <div
                        style={{ height: `${Math.max(targetHeight, 6)}%` }}
                        className="w-1/2 bg-slate-300 transition-all duration-300 relative border-t-2 border-slate-400"
                      ></div>
                    </div>

                    {/* Nhãn tháng / chu kỳ bên dưới */}
                    <div className="mt-3 text-center">
                      <div
                        className={`text-xs font-bold transition-colors ${
                          isHovered
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 hidden sm:block truncate max-w-[80px]">
                        {formatCurrency(
                          metric === 'revenue'
                            ? item.actualRevenue
                            : metric === 'students'
                            ? item.students
                            : item.aov
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Chế độ xem Đường Xu Hướng Vùng (Area Trend Chart SVG) */
            <div className="h-72 w-full pt-4 pb-2">
              <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0B2545" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Đường cong mục tiêu (Dashed Line) */}
                <polyline
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points={activeData
                    .map((d, i) => {
                      const x = (i / (activeData.length - 1)) * 560 + 20
                      const y =
                        200 -
                        ((metric === 'revenue'
                          ? d.targetRevenue
                          : d.students * 0.9) /
                          maxMetricValue) *
                          170
                      return `${x},${y}`
                    })
                    .join(' ')}
                />

                {/* Vùng diện tích doanh thu thực tế (Area Gradient) */}
                <polygon
                  fill="url(#revenueGradient)"
                  points={`20,200 ${activeData
                    .map((d, i) => {
                      const x = (i / (activeData.length - 1)) * 560 + 20
                      const y =
                        200 -
                        ((metric === 'revenue'
                          ? d.actualRevenue
                          : d.students) /
                          maxMetricValue) *
                          170
                      return `${x},${y}`
                    })
                    .join(' ')} 580,200`}
                />

                {/* Đường nét chính Thực thu (Thick Line Navy/Gold) */}
                <polyline
                  fill="none"
                  stroke="#0B2545"
                  strokeWidth="3.5"
                  points={activeData
                    .map((d, i) => {
                      const x = (i / (activeData.length - 1)) * 560 + 20
                      const y =
                        200 -
                        ((metric === 'revenue'
                          ? d.actualRevenue
                          : d.students) /
                          maxMetricValue) *
                          170
                      return `${x},${y}`
                    })
                    .join(' ')}
                />

                {/* Các điểm neo Node có hover */}
                {activeData.map((d, i) => {
                  const x = (i / (activeData.length - 1)) * 560 + 20
                  const y =
                    200 -
                    ((metric === 'revenue'
                      ? d.actualRevenue
                      : d.students) /
                      maxMetricValue) *
                      170
                  return (
                    <g key={d.label}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#F59E0B"
                        stroke="#0B2545"
                        strokeWidth="2.5"
                        className="cursor-pointer hover:r-8 transition-all"
                      />
                      <text
                        x={x}
                        y={225}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-700"
                      >
                        {d.label}
                      </text>
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-[10px] font-mono font-bold fill-[#0B2545]"
                      >
                        {formatCurrency(d.actualRevenue)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          )}
        </div>

        {/* 3 THẺ TÓM TẮT TÀI CHÍNH BỔ TRỢ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500">
              Tổng Thực Thu Chu Kỳ Này
            </span>
            <div className="text-xl font-black text-[#0B2545] mt-1">
              {new Intl.NumberFormat('vi-VN').format(
                activeData.reduce((acc, d) => acc + d.actualRevenue, 0)
              )}{' '}
              đ
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">
              Vượt +14.2% so với chỉ tiêu KPI
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500">
              Giá Trị Đơn Trung Bình (AOV)
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              {new Intl.NumberFormat('vi-VN').format(
                Math.round(
                  activeData.reduce((acc, d) => acc + d.aov, 0) /
                    activeData.length
                )
              )}{' '}
              đ / môn
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-0.5">
              Học viên thường mua kèm combo 2 môn
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500">
              Tỷ Lệ Giữ Chân & Học Tiếp (Retention)
            </span>
            <div className="text-xl font-black text-amber-600 mt-1">
              68.4%
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">
              Học viên F3 tiếp tục học lên F7 & F8
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 2: HAI CỘT TRỰC QUAN (CƠ CẤU DOANH THU & PHỄU TUYỂN SINH HỌC VIÊN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CỘT A: CƠ CẤU NGUỒN THU THEO CẤP ĐỘ / HÌNH THỨC */}
        <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  <span>Cơ Cấu Doanh Thu ACCA</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Phân tích tỷ trọng đóng góp theo từng nhóm môn & hình thức học
                </p>
              </div>

              {/* Nút đổi góc nhìn: Cấp độ vs Hình thức */}
              <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setBreakdownType('category')}
                  className={`px-2 py-1 font-bold cursor-pointer transition-colors ${
                    breakdownType === 'category'
                      ? 'bg-[#0B2545] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cấp Độ Môn
                </button>
                <button
                  type="button"
                  onClick={() => setBreakdownType('format')}
                  className={`px-2 py-1 font-bold cursor-pointer transition-colors ${
                    breakdownType === 'format'
                      ? 'bg-[#0B2545] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hình Thức Học
                </button>
              </div>
            </div>

            {/* Thanh thanh phần trăm tích lũy đồ họa */}
            <div className="my-5">
              <div className="h-4 w-full flex overflow-hidden border border-slate-300">
                {activeBreakdown.map((item) => (
                  <div
                    key={item.code}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.name}: ${item.percentage}%`}
                    className="h-full relative group cursor-pointer transition-opacity hover:opacity-85"
                  ></div>
                ))}
              </div>
            </div>

            {/* Danh sách phân rã chi tiết */}
            <div className="space-y-3.5">
              {activeBreakdown.map((item) => (
                <div
                  key={item.code}
                  className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{ backgroundColor: item.color }}
                      className="w-3.5 h-3.5 shrink-0"
                    ></span>
                    <div>
                      <div className="font-bold text-slate-900">
                        {item.name}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {item.students} học viên đăng ký • Tăng trưởng{' '}
                        <span className="text-emerald-600 font-semibold">
                          {item.growth}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-slate-900 text-sm">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="text-amber-600 font-bold text-[11px]">
                      {item.percentage}% tổng doanh thu
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Đóng góp lớn nhất: <strong>F3 Financial Accounting</strong></span>
            <span className="text-emerald-700 font-bold">Biên lợi nhuận gộp: ~78%</span>
          </div>
        </div>

        {/* CỘT B: PHỄU CHUYỂN ĐỔI TUYỂN SINH (CONVERSION FUNNEL) */}
        <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-500" />
                  <span>Phễu Chuyển Đổi Học Viên ACCA</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tỷ lệ chuyển đổi từ lượt quan tâm đến nhập học chính thức
                </p>
              </div>

              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                Tỷ lệ đóng: 5.9%
              </span>
            </div>

            {/* Đồ họa Phễu từng bước trực quan */}
            <div className="space-y-3 mt-4">
              {ENROLLMENT_FUNNEL.map((step, idx) => {
                return (
                  <div key={step.step} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {step.step}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {new Intl.NumberFormat('vi-VN').format(step.count)}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                          {step.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-3 w-full bg-slate-100 border border-slate-200 overflow-hidden">
                      <div
                        style={{ width: `${step.percentage}%` }}
                        className={`h-full ${step.color} transition-all duration-500`}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{step.description}</span>
                      {idx > 0 && (
                        <span className="text-slate-400">
                          Tỷ lệ chuyển tiếp:{' '}
                          <strong className="text-slate-700">
                            {(
                              (step.count /
                                ENROLLMENT_FUNNEL[idx - 1].count) *
                              100
                            ).toFixed(1)}
                            %
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-200 bg-amber-50/50 p-3 text-xs text-slate-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Điểm sáng phễu:</strong> Tỷ lệ
              chuyển đổi từ học viên làm bài thi thử CBE sang mua khóa học đạt tới{' '}
              <strong className="text-amber-800">42.8%</strong>. Đề thi thử là kênh
              chốt học phí hiệu quả nhất của YT Academy.
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: MA TRẬN CHẤT LƯỢNG ĐÀO TẠO & TỶ LỆ THI ĐỖ ACCA (EXCELLENCE MATRIX) */}
      <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Chỉ Số Vận Hành & Chất Lượng Đào Tạo ACCA</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cam kết chuẩn mực đào tạo của Mr. Trần Minh Nhật và Trung tâm YT Academy
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Niên khóa 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tỷ lệ thi đỗ ACCA</span>
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">
              94.2%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              So với tỷ lệ trung bình toàn cầu ACCA là 50 - 52%
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Tỷ lệ hoàn thành bài học</span>
            </div>
            <div className="text-2xl font-black text-blue-600 mt-2">
              86.8%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Nhờ lộ trình 1-to-1 và hệ thống nhắc nhở tự động
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Bài thi CBE đã chấm</span>
            </div>
            <div className="text-2xl font-black text-purple-600 mt-2">
              428 Đề thi
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Phản hồi chi tiết và sửa bài trong vòng 24 giờ
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Mức độ hài lòng (CSAT)</span>
            </div>
            <div className="text-2xl font-black text-amber-500 mt-2">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Đánh giá từ 100% học viên thực tế tại học viện
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
