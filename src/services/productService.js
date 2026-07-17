import { mockProducts, PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../mocks/products.mock'
import { apiRequest } from './apiClient'
import { getStoredSellerProducts } from './sellerService'

const FALLBACK_IMAGE = '/images/products/headphones.png'
const USE_API = import.meta.env.VITE_DATA_SOURCE === 'api'
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))
let apiCategoryCache = null
let apiCategoryTreeCache = null

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

const normalizeText = (value) => String(value || '').trim().toLowerCase()

const mapApiCategoryNode = (category = {}) => ({
  id: category.category_id,
  name: category.category_name,
  slug: category.slug || '',
  parentId: category.parent_id ?? category.parent_category_id ?? null,
  children: Array.isArray(category.children)
    ? category.children.map(mapApiCategoryNode).filter((item) => item.id && item.name)
    : [],
})

const flattenApiCategories = (categories = []) =>
  categories.flatMap((category) => {
    const currentCategory = {
      id: category.category_id,
      name: category.category_name,
    }
    const children = Array.isArray(category.children)
      ? flattenApiCategories(category.children)
      : []

    return [currentCategory, ...children].filter((item) => item.id && item.name)
  })

const getApiCategories = async () => {
  if (apiCategoryCache) {
    return apiCategoryCache
  }

  const result = await apiRequest('/categories')
  const categories = result.data?.categories || []
  apiCategoryTreeCache = categories.map(mapApiCategoryNode).filter((item) => item.id && item.name)
  apiCategoryCache = flattenApiCategories(categories)
  return apiCategoryCache
}

const getApiCategoryGroups = async () => {
  if (apiCategoryTreeCache) {
    return apiCategoryTreeCache
  }

  await getApiCategories()
  return apiCategoryTreeCache || []
}

const manualCategoryGroups = [
  {
    id: 'mock-electronics',
    name: 'Điện tử',
    children: PRODUCT_CATEGORIES.filter((category) => ['Điện tử', 'Máy tính - Laptop', 'Thiết bị âm thanh'].includes(category))
      .map((category) => ({ id: category, name: category, children: [] })),
  },
  {
    id: 'mock-fashion',
    name: 'Thời trang & Làm đẹp',
    children: PRODUCT_CATEGORIES.filter((category) => ['Thời trang', 'Mỹ phẩm'].includes(category))
      .map((category) => ({ id: category, name: category, children: [] })),
  },
  {
    id: 'mock-home',
    name: 'Nhà cửa & Đời sống',
    children: PRODUCT_CATEGORIES.filter((category) => ['Gia dụng', 'Sách - Văn phòng phẩm', 'Thể thao'].includes(category))
      .map((category) => ({ id: category, name: category, children: [] })),
  },
].filter((group) => group.children.length)

const resolveCategoryIds = async (categories) => {
  if (!categories.length) {
    return []
  }

  const apiCategories = await getApiCategories()

  return categories
    .map((category) => {
      if (/^\d+$/.test(String(category))) {
        return Number(category)
      }

      return apiCategories.find(
        (apiCategory) => normalizeText(apiCategory.name) === normalizeText(category),
      )?.id
    })
    .filter(Boolean)
}

const mapProductVariant = (variant = {}) => ({
  variantId: variant.variant_id ?? variant.variantId ?? variant.id ?? null,
  skuId: variant.sku_id || variant.skuId || variant.sku_code || variant.skuCode || '',
  skuCode: variant.sku_code || variant.skuCode || '',
  variantName: variant.variant_name || variant.variantName || 'Máº·c Ä‘á»‹nh',
  option1Name: variant.option1_name || variant.option1Name || '',
  option1Value: variant.option1_value || variant.option1Value || '',
  option2Name: variant.option2_name || variant.option2Name || '',
  option2Value: variant.option2_value || variant.option2Value || '',
  price: Number(variant.price) || 0,
  stockQuantity: Number(variant.stock_quantity ?? variant.stockQuantity) || 0,
  status: variant.status || PRODUCT_STATUSES.ACTIVE,
  isDefault: Boolean(variant.is_default ?? variant.isDefault),
})

const mapProduct = (product) => {
  const images = Array.isArray(product.images) ? product.images : []
  const primaryImage = images.find((image) => image.is_primary) || images[0]
  const ratingSummary = product.rating_summary || {}
  const variants = Array.isArray(product.variants)
    ? product.variants.map(mapProductVariant).filter((variant) => variant.variantId || variant.skuCode)
    : []
  const defaultVariantId = product.default_variant_id ?? product.defaultVariantId ?? null
  const defaultVariant =
    variants.find((variant) => String(variant.variantId) === String(defaultVariantId))
    || variants.find((variant) => variant.isDefault)
    || variants[0]
  const stockQuantity = Number(defaultVariant?.stockQuantity ?? product.stock_quantity) || 0
  const price = Number(defaultVariant?.price ?? product.price) || 0
  const skuCode = defaultVariant?.skuCode || product.sku_code || product.sku || ''

  return {
    id: product.product_id ?? product.id,
    name: product.product_name || product.name || '',
    slug: product.slug || '',
    defaultVariantId,
    variantId: defaultVariant?.variantId || defaultVariantId || null,
    skuId: product.sku_id || skuCode,
    skuCode,
    sku: skuCode,
    variantName: defaultVariant?.variantName || product.variant_name || 'Máº·c Ä‘á»‹nh',
    variants,
    description: product.description || '',
    price,
    originalPrice: price,
    discountPercent: 0,
    imageUrl: primaryImage?.image_url || product.primary_image_url || FALLBACK_IMAGE,
    images: images.map((image) => image.image_url).filter(Boolean),
    category: product.category?.category_name || product.category || '',
    categoryId: product.category?.category_id || product.category_id,
    storeId: product.store?.store_id || product.store_id,
    storeName: product.store?.store_name || 'TechToShop',
    rating: Number(ratingSummary.avg_rating ?? product.avg_rating) || 0,
    reviewCount: Number(ratingSummary.review_count ?? product.review_count) || 0,
    ratingDistribution: ratingSummary.distribution || {},
    soldQuantity: Number(product.sold_quantity) || 0,
    stockQuantity,
    location: product.store?.province || 'Viá»‡t Nam',
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

    const categoryIds = await resolveCategoryIds(categories)

    if (categoryIds.length === 1) {
      params.set('category_id', String(categoryIds[0]))
    }

    const result = await apiRequest(`/products?${params.toString()}`)
    const products = (result.data?.products || []).map(mapProduct)
    const shouldFallbackFilterByName = categories.length && categoryIds.length !== 1
    const categoryIdSet = new Set(categoryIds.map(String))
    const filteredProducts = shouldFallbackFilterByName
      ? products.filter((product) => (
          categoryIdSet.size
            ? categoryIdSet.has(String(product.categoryId))
            : categories.includes(product.category)
        ))
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
        : { success: false, message: 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m' }
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
      const categories = await getApiCategories()

      return {
        success: true,
        data: [...new Set(categories.map((category) => category.name))],
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      }
    }
  },

  async getCategoryGroups() {
    if (!USE_API) {
      await delay(80)
      return { success: true, data: manualCategoryGroups }
    }

    try {
      const groups = await getApiCategoryGroups()

      return {
        success: true,
        data: groups,
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
