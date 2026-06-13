export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}
