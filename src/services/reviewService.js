import { ORDER_STATUS, orderService } from './orderService'

const REVIEW_STORAGE_KEY = 'techtonic_reviews'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const normalizeNumber = (value, fallback = 0) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const normalizeId = (value) => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return String(value)
}

const normalizeRating = (value) => {
  const rating = Math.round(normalizeNumber(value, 0))

  if (rating < 1 || rating > 5) {
    return null
  }

  return rating
}

const sanitizeReviews = (reviews) => {
  if (!Array.isArray(reviews)) {
    return []
  }

  return reviews
    .map((review) => {
      const orderId = normalizeId(review?.orderId)
      const productId = normalizeId(review?.productId)
      const customerId = normalizeId(review?.customerId)
      const rating = normalizeRating(review?.rating)

      if (!review?.id || !orderId || !productId || !customerId || !rating) {
        return null
      }

      return {
        id: review.id,
        orderId,
        productId,
        customerId,
        customerName: review.customerName?.trim() || 'Khách hàng TechToShop',
        rating,
        content: review.content?.trim() || '',
        createdAt: review.createdAt || new Date().toISOString(),
      }
    })
    .filter(Boolean)
    .sort((firstReview, secondReview) => new Date(secondReview.createdAt) - new Date(firstReview.createdAt))
}

const saveReviews = (reviews) => {
  const sanitizedReviews = sanitizeReviews(reviews)

  if (canUseStorage()) {
    window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(sanitizedReviews))
  }

  return sanitizedReviews
}

const readReviews = () => {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawReviews = window.localStorage.getItem(REVIEW_STORAGE_KEY)
    const parsedReviews = rawReviews ? JSON.parse(rawReviews) : []
    const sanitizedReviews = sanitizeReviews(parsedReviews)

    if (rawReviews && JSON.stringify(parsedReviews) !== JSON.stringify(sanitizedReviews)) {
      saveReviews(sanitizedReviews)
    }

    return sanitizedReviews
  } catch {
    window.localStorage.removeItem(REVIEW_STORAGE_KEY)
    return []
  }
}

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}${month}${day}`
}

const buildReviewId = (reviews) => {
  const dateKey = getDateKey()
  const todayReviewCount = reviews.filter((review) => review.id.startsWith(`REV-${dateKey}-`)).length
  const sequence = `${todayReviewCount + 1}`.padStart(4, '0')
  return `REV-${dateKey}-${sequence}`
}

export const reviewService = {
  getStorageKey() {
    return REVIEW_STORAGE_KEY
  },

  getReviews() {
    return readReviews()
  },

  getReviewsByProductId(productId) {
    const normalizedProductId = normalizeId(productId)

    if (!normalizedProductId) {
      return []
    }

    return readReviews().filter((review) => review.productId === normalizedProductId)
  },

  getReviewsByOrderId(orderId, customerId) {
    const normalizedOrderId = normalizeId(orderId)
    const normalizedCustomerId = normalizeId(customerId)

    if (!normalizedOrderId || !normalizedCustomerId) {
      return []
    }

    return readReviews().filter(
      (review) => review.orderId === normalizedOrderId && review.customerId === normalizedCustomerId,
    )
  },

  hasReviewed(orderId, productId, customerId) {
    const normalizedOrderId = normalizeId(orderId)
    const normalizedProductId = normalizeId(productId)
    const normalizedCustomerId = normalizeId(customerId)

    if (!normalizedOrderId || !normalizedProductId || !normalizedCustomerId) {
      return false
    }

    return readReviews().some(
      (review) =>
        review.orderId === normalizedOrderId &&
        review.productId === normalizedProductId &&
        review.customerId === normalizedCustomerId,
    )
  },

  createReview(reviewPayload) {
    const orderId = normalizeId(reviewPayload?.orderId)
    const productId = normalizeId(reviewPayload?.productId)
    const customerId = normalizeId(reviewPayload?.customerId)
    const rating = normalizeRating(reviewPayload?.rating)

    if (!orderId || !productId || !customerId || !rating) {
      return {
        success: false,
        message: 'Không thể tạo đánh giá khi thiếu thông tin bắt buộc.',
      }
    }

    const orderResponse = orderService.getOrderById(orderId, customerId)

    if (!orderResponse.success || !orderResponse.data) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng hợp lệ để đánh giá.',
      }
    }

    if (orderResponse.data.status !== ORDER_STATUS.COMPLETED) {
      return {
        success: false,
        message: 'Chỉ có thể đánh giá sau khi đơn hàng hoàn thành.',
      }
    }

    const hasPurchasedProduct = orderResponse.data.items?.some(
      (item) => normalizeId(item.productId ?? item.product?.id) === productId,
    )

    if (!hasPurchasedProduct) {
      return {
        success: false,
        message: 'Sản phẩm không thuộc đơn hàng này.',
      }
    }

    const existingReviews = readReviews()
    const duplicatedReview = existingReviews.find(
      (review) =>
        review.orderId === orderId &&
        review.productId === productId &&
        review.customerId === customerId,
    )

    if (duplicatedReview) {
      return {
        success: false,
        message: 'Sản phẩm này đã được đánh giá.',
      }
    }

    const nextReview = {
      id: buildReviewId(existingReviews),
      orderId,
      productId,
      customerId,
      customerName: reviewPayload.customerName?.trim() || 'Khách hàng TechToShop',
      rating,
      content: reviewPayload.content?.trim() || '',
      createdAt: new Date().toISOString(),
    }

    saveReviews([nextReview, ...existingReviews])

    return {
      success: true,
      data: nextReview,
    }
  },
}
