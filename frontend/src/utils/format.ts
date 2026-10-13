/**
 * Format currency with locale support (VND by default, USD for EN)
 */
export const formatCurrency = (amount: number, locale = 'vi'): string => {
  if (locale === 'en') {
    // Convert VND to approximate USD for English view or show standard VND with EN formatting
    const usd = Math.round(amount / 25000)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(usd)
  }

  return (
    new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
    }).format(amount) + ' đ'
  )
}

/**
 * Format integer numbers with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num)
}
