import { mockProducts, PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../mocks/products.mock'
import { apiRequest } from './apiClient'
import { getStoredSellerProducts } from './sellerService'

const FALLBACK_IMAGE = '/images/products/headphones.png'
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const getVisibleMockProducts = () => {
  const mockProductIds = new Set(mockProducts.map((product) => String(product.id)))
  const sellerCreatedProducts = getStoredSellerProducts().filter(
    (product) => !mockProductIds.has(String(product.id)),
  )

  return [...sellerCreatedProducts, ...mockProducts].filter(
    (product) => product.status !== PRODUCT_STATUSES.HIDDEN,
  )
}

const normalizeCategories = (category) => {
  if (Array.isArray(category)) {
    return category.filter(Boolean)
  }

  if (!category || category === 'all') {
    return []
  }

  return String(category)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const appendSortParams = (params, sort) => {
  const sortMap = {
    'price-asc': ['price', 'ASC'],
    'price-desc': ['price', 'DESC'],
    'best-selling': ['sold_quantity', 'DESC'],
  }
  const mappedSort = sortMap[sort]

  if (mappedSort) {
    params.set('sort_by', mappedSort[0])
    params.set('sort_order', mappedSort[1])
  }
}

const mapProduct = (product) => {
  const images = Array.isArray(product.images) ? product.images : []
  const primaryImage = images.find((image) => image.is_primary) || images[0]
  const ratingSummary = product.rating_summary || {}
  const stockQuantity = Number(product.stock_quantity) || 0
  const price = Number(product.price) || 0
  const skuCode = product.sku_code || product.sku || ''

  return {
    id: product.product_id,
    name: product.product_name,
    slug: product.slug || '',
    skuId: product.sku_id || skuCode,
    skuCode,
    sku: skuCode,
    variantName: product.variant_name || 'Mặc định',
    description: product.description || '',
    price,
    originalPrice: price,
    discountPercent: 0,
    imageUrl: primaryImage?.image_url || product.primary_image_url || FALLBACK_IMAGE,
    images: images.map((image) => image.image_url).filter(Boolean),
    category: product.category?.category_name || '',
    categoryId: product.category?.category_id,
    storeId: product.store?.store_id,
    storeName: product.store?.store_name || 'TechToShop',
    rating: Number(ratingSummary.avg_rating ?? product.avg_rating) || 0,
    reviewCount: Number(ratingSummary.review_count ?? product.review_count) || 0,
    soldQuantity: Number(product.sold_quantity) || 0,
    stockQuantity,
    location: product.store?.province || 'Việt Nam',
    status:
      stockQuantity > 0
        ? product.status || PRODUCT_STATUSES.ACTIVE
        : PRODUCT_STATUSES.OUT_OF_STOCK,
  }
}

const sortProducts = (products, sort) => {
  const clonedProducts = [...products]

  switch (sort) {
    case 'price-asc':
      return clonedProducts.sort((first, second) => first.price - second.price)
    case 'price-desc':
      return clonedProducts.sort((first, second) => second.price - first.price)
    case 'best-selling':
      return clonedProducts.sort((first, second) => second.soldQuantity - first.soldQuantity)
    case 'top-rated':
      return clonedProducts.sort((first, second) => second.rating - first.rating)
    default:
      return clonedProducts
  }
}

export const productService = {
  async getProducts({ keyword = '', category = '', sort = '' } = {}) {
    const normalizedKeyword = keyword.trim()
    const categories = normalizeCategories(category)

    if (!USE_API) {
      await delay()
      let products = getVisibleMockProducts()

      if (normalizedKeyword) {
        const lowerKeyword = normalizedKeyword.toLowerCase()
        products = products.filter((product) =>
          product.name.toLowerCase().includes(lowerKeyword),
        )
      }

      if (categories.length) {
        products = products.filter((product) => categories.includes(product.category))
      }

      return { success: true, data: sortProducts(products, sort) }
    }

    const params = new URLSearchParams({ limit: '100' })

    if (normalizedKeyword) {
      params.set('keyword', normalizedKeyword)
    }

    appendSortParams(params, sort)

    const result = await apiRequest(`/products?${params.toString()}`)
    const products = (result.data?.products || []).map(mapProduct)
    const filteredProducts = categories.length
      ? products.filter((product) => categories.includes(product.category))
      : products

    return {
      success: true,
      data: sortProducts(filteredProducts, sort),
      pagination: result.data?.pagination,
    }
  },

  async getProductById(id) {
    if (!USE_API) {
      await delay()
      const product = getVisibleMockProducts().find((item) => String(item.id) === String(id))
      return product
        ? { success: true, data: product }
        : { success: false, message: 'Không tìm thấy sản phẩm' }
    }

    try {
      const result = await apiRequest(`/products/${id}`)

      return {
        success: true,
        data: mapProduct(result.data),
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  async getFeaturedProducts() {
    if (!USE_API) {
      await delay()
      return {
        success: true,
        data: sortProducts(getVisibleMockProducts(), 'best-selling'),
      }
    }

    return this.getProducts({ sort: 'best-selling' })
  },

  async getProductsByCategory(category) {
    return this.getProducts({ category })
  },

  async getCategories() {
    if (!USE_API) {
      await delay(80)
      return { success: true, data: PRODUCT_CATEGORIES }
    }

    try {
      const result = await apiRequest('/categories')

      return {
        success: true,
        data: (result.data?.categories || []).map((category) => category.category_name),
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      }
    }
  },
}
