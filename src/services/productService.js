import { mockProducts, PRODUCT_STATUSES, PRODUCT_CATEGORIES } from '../mocks/products.mock'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

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

const getVisibleProducts = () =>
  mockProducts.filter((product) => product.status !== PRODUCT_STATUSES.HIDDEN)

export const productService = {
  async getProducts({ keyword = '', category = '', sort = '' } = {}) {
    await delay()

    const normalizedKeyword = keyword.trim().toLowerCase()
    let filteredProducts = getVisibleProducts()

    if (normalizedKeyword) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(normalizedKeyword),
      )
    }

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    return {
      success: true,
      data: sortProducts(filteredProducts, sort),
    }
  },

  async getProductById(id) {
    await delay()

    const matchedProduct = getVisibleProducts().find((product) => String(product.id) === String(id))

    if (!matchedProduct) {
      return {
        success: false,
        message: 'Không tìm thấy sản phẩm',
      }
    }

    return {
      success: true,
      data: matchedProduct,
    }
  },

  async getFeaturedProducts() {
    await delay()

    const featuredProducts = getVisibleProducts()
      .filter((product) => product.status === PRODUCT_STATUSES.ACTIVE)
      .sort((first, second) => second.soldQuantity - first.soldQuantity)
      .slice(0, 8)

    return {
      success: true,
      data: featuredProducts,
    }
  },

  async getProductsByCategory(category) {
    await delay()

    return {
      success: true,
      data: getVisibleProducts().filter((product) => product.category === category),
    }
  },

  async getCategories() {
    await delay(80)

    return {
      success: true,
      data: PRODUCT_CATEGORIES,
    }
  },
}
