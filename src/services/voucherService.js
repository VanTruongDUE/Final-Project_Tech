import { apiRequest } from './apiClient'

export const voucherService = {
  async validateVoucher({ code, orderAmount, storeId }) {
    const normalizedCode = code?.trim().toUpperCase()
    if (!normalizedCode) throw new Error('Vui lòng nhập mã voucher.')

    const params = new URLSearchParams({
      code: normalizedCode,
      order_amount: String(orderAmount),
    })
    if (storeId) params.set('store_id', String(storeId))

    const result = await apiRequest(`/vouchers/check?${params}`)
    const voucher = result.data || {}
    return {
      success: true,
      data: {
        id: voucher.voucher_id,
        code: voucher.voucher_code,
        name: voucher.voucher_name,
        storeId: voucher.store_id,
        discountType: voucher.discount_type,
        discountValue: Number(voucher.discount_value) || 0,
        discountAmount: Number(voucher.discount_amount) || 0,
        minOrderAmount: Number(voucher.min_order_amount) || 0,
        maxDiscountAmount: voucher.max_discount_amount == null ? null : Number(voucher.max_discount_amount),
      },
    }
  },
}
