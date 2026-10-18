import { useState, useEffect } from 'react'

export interface IFlashSaleSlot {
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  label: string
}

/**
 * Các Khung Giờ Vàng ưu đãi cố định hàng ngày (mỗi ca kéo dài 2-3 tiếng).
 * Đều đặn mỗi ngày lặp lại đúng các khung giờ này.
 */
export const DAILY_FLASH_SALE_SLOTS: IFlashSaleSlot[] = [
  { startHour: 0, startMinute: 0, endHour: 2, endMinute: 30, label: '00:00 - 02:30' },
  { startHour: 9, startMinute: 0, endHour: 12, endMinute: 0, label: '09:00 - 12:00' },
  { startHour: 14, startMinute: 0, endHour: 17, endMinute: 0, label: '14:00 - 17:00' },
  { startHour: 20, startMinute: 0, endHour: 23, endMinute: 0, label: '20:00 - 23:00' },
]

export interface ICountdownTime {
  hours: number
  minutes: number
  seconds: number
  formattedHours: string
  formattedMinutes: string
  formattedSeconds: string
  isActive: boolean
  isUpcoming: boolean
  currentSlotLabel: string
}

export function useDailyCountdown(): ICountdownTime {
  const calculateTimeLeft = (): ICountdownTime => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60

    // 1. Kiểm tra xem hiện tại có đang nằm trong khung giờ vàng nào không
    for (const slot of DAILY_FLASH_SALE_SLOTS) {
      const slotStartMinutes = slot.startHour * 60 + slot.startMinute
      const slotEndMinutes = slot.endHour * 60 + slot.endMinute

      if (currentMinutes >= slotStartMinutes && currentMinutes < slotEndMinutes) {
        // Đang trong ca Flash Sale: đếm ngược đến lúc hết ca
        const target = new Date(now)
        target.setHours(slot.endHour, slot.endMinute, 0, 0)
        const diffSec = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))

        const hours = Math.floor(diffSec / 3600)
        const minutes = Math.floor((diffSec % 3600) / 60)
        const seconds = diffSec % 60

        return {
          hours,
          minutes,
          seconds,
          formattedHours: String(hours).padStart(2, '0'),
          formattedMinutes: String(minutes).padStart(2, '0'),
          formattedSeconds: String(seconds).padStart(2, '0'),
          isActive: true,
          isUpcoming: false,
          currentSlotLabel: slot.label,
        }
      }
    }

    // 2. Nếu đang ở giữa các ca: tìm ca sắp diễn ra tiếp theo
    let nextSlot: IFlashSaleSlot = DAILY_FLASH_SALE_SLOTS[0]
    let targetTime: Date = new Date(now)

    let foundUpcoming = false
    for (const slot of DAILY_FLASH_SALE_SLOTS) {
      const slotStartMinutes = slot.startHour * 60 + slot.startMinute
      if (slotStartMinutes > currentMinutes) {
        nextSlot = slot
        targetTime = new Date(now)
        targetTime.setHours(slot.startHour, slot.startMinute, 0, 0)
        foundUpcoming = true
        break
      }
    }

    // Nếu đã qua ca cuối cùng trong ngày (sau 23:00), ca kế tiếp là ca đầu tiên ngày hôm sau (00:00)
    if (!foundUpcoming) {
      nextSlot = DAILY_FLASH_SALE_SLOTS[0]
      targetTime = new Date(now)
      targetTime.setDate(targetTime.getDate() + 1)
      targetTime.setHours(nextSlot.startHour, nextSlot.startMinute, 0, 0)
    }

    const diffSec = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000))
    // Giới hạn hiển thị không quá 3 tiếng để luôn duy trì tính cấp bách
    const displaySec = Math.min(diffSec, 3 * 3600 - 1)
    const hours = Math.floor(displaySec / 3600)
    const minutes = Math.floor((displaySec % 3600) / 60)
    const seconds = displaySec % 60

    return {
      hours,
      minutes,
      seconds,
      formattedHours: String(hours).padStart(2, '0'),
      formattedMinutes: String(minutes).padStart(2, '0'),
      formattedSeconds: String(seconds).padStart(2, '0'),
      isActive: false,
      isUpcoming: true,
      currentSlotLabel: nextSlot.label,
    }
  }

  const [timeLeft, setTimeLeft] = useState<ICountdownTime>(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}
