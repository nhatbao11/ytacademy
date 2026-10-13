import { mockCourses } from '../courses/courseService'
import type { IEnrolledCourse, IChapter } from './types'

export const mockEnrolledCourses: IEnrolledCourse[] = [
  {
    id: 'enrolled-fa',
    course: mockCourses.find((c) => c.id === 'c-fa') || mockCourses[0],
    status: 'active',
    expireDate: '15/10/2026',
    completedLessons: 6,
    totalLessons: 15,
    progressPercent: 40,
  },
  {
    id: 'enrolled-fm',
    course: mockCourses.find((c) => c.id === 'c-fm') || mockCourses[3],
    status: 'active',
    expireDate: '04/12/2026',
    completedLessons: 4,
    totalLessons: 11,
    progressPercent: 36,
  },
  {
    id: 'enrolled-fr',
    course: mockCourses.find((c) => c.id === 'c-fr') || mockCourses[2],
    status: 'active',
    expireDate: '29/11/2026',
    completedLessons: 5,
    totalLessons: 15,
    progressPercent: 33,
  },
  {
    id: 'enrolled-invest',
    course: mockCourses.find((c) => c.id === 'c-invest') || mockCourses[4],
    status: 'expired',
    expireDate: '18/01/2026',
    completedLessons: 4,
    totalLessons: 4,
    progressPercent: 100,
  },
]

export const mockSyllabusChapters: IChapter[] = [
  {
    id: 'chap-0',
    title: 'Chapter 0: Tổng quan về môn học & Cấu trúc đề thi',
    lessonsCount: 3,
    lessons: [
      { id: 'l-0-1', title: '0.1. Lộ trình học và chiến thuật phân bổ thời gian', duration: '15:20', isCompleted: true },
      { id: 'l-0-2', title: '0.2. Cấu trúc bài thi trên máy tính (CBE format)', duration: '20:45', isCompleted: true },
      { id: 'l-0-3', title: '0.3. Hướng dẫn sử dụng phần mềm luyện đề thi thật', duration: '18:10', isCompleted: true },
    ],
  },
  {
    id: 'chap-1',
    title: 'Chapter 1: Managing Information (Quản trị thông tin)',
    lessonsCount: 4,
    lessons: [
      { id: 'l-1-1', title: '1.1. Sources of information & Big data trong quản trị', duration: '28:15', isCompleted: true },
      { id: 'l-1-2', title: '1.2. Information systems & Controls', duration: '32:40', isCompleted: true },
      { id: 'l-1-3', title: '1.3. Open & Closed systems trong doanh nghiệp', duration: '25:10', isCompleted: false },
      { id: 'l-1-4', title: '1.4. Bài tập thực hành & Trắc nghiệm Section A', duration: '35:00', isCompleted: false },
    ],
  },
  {
    id: 'chap-2',
    title: 'Chapter 2: Information Systems & Data Analysis',
    lessonsCount: 4,
    lessons: [
      { id: 'l-2-1', title: '2.1. Phân loại chi phí theo hành vi & hoạt động', duration: '30:15', isCompleted: false },
      { id: 'l-2-2', title: '2.2. Cost drivers & Cost pools trong thực tế', duration: '27:50', isCompleted: false },
      { id: 'l-2-3', title: '2.3. Case study phân tích dữ liệu chi phí sản xuất', duration: '40:10', isCompleted: false },
    ],
  },
  {
    id: 'chap-3',
    title: 'Chapter 3: Activity-Based Costing (ABC) - Kế toán chi phí dựa trên hoạt động',
    lessonsCount: 3,
    lessons: [
      { id: 'l-3-1', title: '3.1. So sánh phương pháp truyền thống và ABC', duration: '35:20', isCompleted: false },
      { id: 'l-3-2', title: '3.2. Quy trình 5 bước tính giá thành theo ABC', duration: '42:15', isCompleted: false },
      { id: 'l-3-3', title: '3.3. Giải đề thi Section B về ABC môn PM', duration: '48:00', isCompleted: false },
    ],
  },
  {
    id: 'chap-4',
    title: 'Chapter 4: Target Costing & Life-Cycle Costing',
    lessonsCount: 3,
    lessons: [
      { id: 'l-4-1', title: '4.1. Khái niệm và quy trình Target Costing', duration: '29:40', isCompleted: false },
      { id: 'l-4-2', title: '4.2. Closing the target cost gap', duration: '31:10', isCompleted: false },
      { id: 'l-4-3', title: '4.3. Vòng đời sản phẩm và Life-cycle Costing', duration: '33:20', isCompleted: false },
    ],
  },
  {
    id: 'chap-5',
    title: 'Chapter 5: Environmental Accounting & Throughput Accounting',
    lessonsCount: 2,
    lessons: [
      { id: 'l-5-1', title: '5.1. Lý thuyết điểm nghẽn (Theory of Constraints)', duration: '26:30', isCompleted: false },
      { id: 'l-5-2', title: '5.2. Tính toán Throughput Accounting Ratio (TPAR)', duration: '34:10', isCompleted: false },
    ],
  },
]
