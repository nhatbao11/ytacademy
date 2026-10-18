import { mockCourses } from '../courses/courseService'
import type { IEnrolledCourse, IChapter } from './types'

export const mockEnrolledCourses: IEnrolledCourse[] = [
  {
    id: 'enrolled-fa',
    course: mockCourses.find((c) => c.id === 'c-fa') || mockCourses[0],
    status: 'active',
    expireDate: '15/10/2026',
    completedLessons: 6,
    totalLessons: 26,
    progressPercent: 23,
  },
]

export const mockSyllabusChapters: IChapter[] = [
  {
    id: 'chap-0',
    title: 'Chapter 0: Course Overview & Exam Structure',
    lessonsCount: 3,
    lessons: [
      { id: 'l-0-1', title: '0.1. Study Roadmap and Time Allocation Strategy', duration: '15:20', isCompleted: true },
      { id: 'l-0-2', title: '0.2. Computer-Based Exam (CBE) Format Overview', duration: '20:45', isCompleted: true },
      { id: 'l-0-3', title: '0.3. ACCA Official Exam Practice Platform Guide', duration: '18:10', isCompleted: true },
    ],
  },
  {
    id: 'chap-1',
    title: 'Chapter 1: Managing Information and Big Data',
    lessonsCount: 4,
    lessons: [
      { id: 'l-1-1', title: '1.1. Sources of Information & Big Data in Governance', duration: '28:15', isCompleted: true },
      { id: 'l-1-2', title: '1.2. Information Systems and Internal Controls', duration: '32:40', isCompleted: true },
      { id: 'l-1-3', title: '1.3. Open & Closed Systems in Business Organizations', duration: '25:10', isCompleted: false },
      { id: 'l-1-4', title: '1.4. Practice Exercises & Section A Mock Drills', duration: '35:00', isCompleted: false },
    ],
  },
  {
    id: 'chap-2',
    title: 'Chapter 2: Information Systems & Cost Classification',
    lessonsCount: 4,
    lessons: [
      { id: 'l-2-1', title: '2.1. Cost Classification by Behaviour and Activity', duration: '30:15', isCompleted: false },
      { id: 'l-2-2', title: '2.2. Cost Drivers & Cost Pools in Practice', duration: '27:50', isCompleted: false },
      { id: 'l-2-3', title: '2.3. Case Study: Production Cost Variance Analysis', duration: '40:10', isCompleted: false },
    ],
  },
  {
    id: 'chap-3',
    title: 'Chapter 3: Activity-Based Costing (ABC)',
    lessonsCount: 3,
    lessons: [
      { id: 'l-3-1', title: '3.1. Traditional Absorption Costing vs Activity-Based Costing', duration: '35:20', isCompleted: false },
      { id: 'l-3-2', title: '3.2. 5-Step Process to Calculate Cost per Unit under ABC', duration: '42:15', isCompleted: false },
      { id: 'l-3-3', title: '3.3. Section B CBE Exam Scenario Question Techniques', duration: '48:00', isCompleted: false },
    ],
  },
  {
    id: 'chap-4',
    title: 'Chapter 4: Target Costing & Life-Cycle Costing',
    lessonsCount: 3,
    lessons: [
      { id: 'l-4-1', title: '4.1. Concept and 5-Stage Target Costing Process', duration: '29:40', isCompleted: false },
      { id: 'l-4-2', title: '4.2. Closing the Target Cost Gap: Value Analysis & Value Engineering', duration: '31:10', isCompleted: false },
      { id: 'l-4-3', title: '4.3. Product Life-Cycle Stages and Life-Cycle Costing', duration: '33:20', isCompleted: false },
    ],
  },
  {
    id: 'chap-5',
    title: 'Chapter 5: Environmental Accounting & Throughput Accounting',
    lessonsCount: 2,
    lessons: [
      { id: 'l-5-1', title: '5.1. Theory of Constraints and Bottleneck Operations', duration: '26:30', isCompleted: false },
      { id: 'l-5-2', title: '5.2. Calculating the Throughput Accounting Ratio (TPAR)', duration: '34:10', isCompleted: false },
    ],
  },
]
