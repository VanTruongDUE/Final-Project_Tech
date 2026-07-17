import { apiRequest } from './apiClient'

const mapReview = (review = {}) => ({
  id: String(review.review_id),
  reviewId: review.review_id,
  orderItemId: review.order_item_id,
  rating: Number(review.rating) || 0,
  content: review.comment || '',
  comment: review.comment || '',
  createdAt: review.created_at,
  reviewerId: review.reviewer?.user_id,
  customerName: review.reviewer?.full_name || 'Khách hàng TechTonic',
  avatarUrl: review.reviewer?.avatar_url || '',
  status: 'VISIBLE',
})

export const reviewService = {
  async getProductReviews(productId, options = {}) {
    const params = new URLSearchParams({
      page: String(options.page || 1),
      limit: String(options.limit || 50),
      sort_by: options.sortBy || 'created_at',
      sort_order: options.sortOrder || 'DESC',
    })
    if (options.rating) params.set('rating', String(options.rating))

    const result = await apiRequest(`/products/${productId}/reviews?${params}` , { auth: false })
    return {
      success: true,
      data: (result.data?.reviews || []).map(mapReview),
      pagination: result.data?.pagination,
    }
  },

  async createReview({ orderItemId, rating, content }) {
    const normalizedRating = Number(rating)
    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      throw new Error('Điểm đánh giá phải là số nguyên từ 1 đến 5.')
    }

    const result = await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        order_item_id: Number(orderItemId),
        rating: normalizedRating,
        comment: content?.trim() || null,
      }),
    })
    return { success: true, data: mapReview(result.data), message: result.message || 'Đánh giá thành công.' }
  },

  async hideReview(reviewId, reason = '') {
    const result = await apiRequest(`/reviews/${reviewId}/hide`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason.trim() || null }),
    })
    return { success: true, data: result.data, message: result.message || 'Đã ẩn đánh giá.' }
  },
}
