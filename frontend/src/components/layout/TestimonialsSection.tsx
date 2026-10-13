import React from 'react'
import { Star, Quote, Award } from 'lucide-react'

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Nguyễn Minh Trang',
      role: 'ACCA Prize Winner PM (F5) - 86 điểm',
      company: 'Associate tại PwC Vietnam',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      comment:
        'Nhờ phương pháp tư duy logic và ngân hàng câu hỏi bám sát format thi thật của thầy Giang Hà tại YT Academy, mình không chỉ thi đỗ ngay lần đầu mà còn đạt danh hiệu Prize Winner toàn quốc môn F5!',
    },
    {
      name: 'Trần Đức Anh',
      role: 'Đỗ CFA Level 1 (Top 10% thế giới)',
      company: 'Analyst tại Dragon Capital',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment:
        'Giáo trình tinh gọn và video bài giảng phân tích chi tiết từng Reading giúp mình tiết kiệm đến 40% thời gian ôn luyện. Hệ thống Mock Exam có giải thích cặn kẽ cực kỳ giá trị.',
    },
    {
      name: 'Vũ Hoàng Mai',
      role: 'Chinh phục thành công Kỳ tuyển dụng Big4',
      company: 'Audit Assistant tại KPMG Vietnam',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment:
        'Khóa Unlock Big4 thực sự là bước ngoặt đối với mình. Các buổi mock interview 1-1 và rèn luyện kỹ năng giải case study nhóm đã giúp mình tự tin vượt qua cả 4 vòng thi đầy thử thách.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-200">
            Học viên tiêu biểu
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Thành Tựu Của Học Viên YT Academy
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Hơn 15.000 học viên đã tin tưởng và mở ra cơ hội thăng tiến sự nghiệp tại các tổ chức hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:border-amber-400 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-amber-300 absolute top-6 right-6 opacity-40 group-hover:opacity-80 transition-opacity" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-200">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/50"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{t.role}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
