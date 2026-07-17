import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../../components/buyer/ProductGrid'
import { productService } from '../../services/productService'

const PRODUCTS_PER_PAGE = 16

const sortOptions = [
  { value: '', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'best-selling', label: 'Bán chạy' },
  { value: 'top-rated', label: 'Đánh giá cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
]

const ratingOptions = [
  { value: '5', label: 'từ 5 sao', stars: 5 },
  { value: '4', label: 'từ 4 sao', stars: 4 },
  { value: '3', label: 'từ 3 sao', stars: 3 },
  { value: '2', label: 'từ 2 sao', stars: 2 },
]

function RatingRow({ stars, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-[#ffb4a4]">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="text-[16px] leading-none">
            {index < stars ? '★' : '☆'}
          </span>
        ))}
      </div>
      <span>{label}</span>
    </div>
  )
}

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categoryGroups, setCategoryGroups] = useState([])
  const [openCategoryGroups, setOpenCategoryGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [priceInput, setPriceInput] = useState({ min: '', max: '' })
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [ratingFilter, setRatingFilter] = useState('')
  const searchParamsKey = searchParams.toString()

  const keyword = searchParams.get('keyword') || ''
  const selectedCategories = useMemo(
    () => {
      const selectedCategory = new URLSearchParams(searchParamsKey).get('category')
      return selectedCategory ? [selectedCategory] : []
    },
    [searchParamsKey],
  )
  const selectedCategoryValue = selectedCategories[0] || ''
  const sort = searchParams.get('sort') || ''
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    })

    if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
      nextParams.delete('page')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const selectCategory = (nextCategory) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('category', String(nextCategory))
    nextParams.delete('page')

    setSearchParams(nextParams, { replace: true })
  }

  const getGroupChildIds = useCallback((group) => (
    Array.isArray(group.children) && group.children.length
      ? group.children.map((child) => child.id).filter(Boolean)
      : [group.id].filter(Boolean)
  ), [])

  const selectCategoryGroup = (group) => {
    const childIds = getGroupChildIds(group)

    if (childIds.length) {
      selectCategory(childIds.join(','))
    }
  }

  const toggleCategoryGroup = (groupId) => {
    setOpenCategoryGroups((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    )
  }

  const clearCategoryFilter = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('category')
    nextParams.delete('page')
    setSearchParams(nextParams, { replace: true })
  }

  const applyPriceRange = () => {
    setPriceRange({
      min: priceInput.min.trim(),
      max: priceInput.max.trim(),
    })
  }

  const resetFilters = () => {
    setPriceInput({ min: '', max: '' })
    setPriceRange({ min: '', max: '' })
    setRatingFilter('')
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      const response = await productService.getCategoryGroups()

      if (isMounted && response.success) {
        setCategoryGroups(response.data)
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!categoryGroups.length) {
      return
    }

    const selectedIdSet = new Set(selectedCategories.flatMap((category) => String(category).split(',')).filter(Boolean))
    const selectedGroupIds = categoryGroups
      .filter((group) => getGroupChildIds(group).some((id) => selectedIdSet.has(String(id))))
      .map((group) => group.id)

    setOpenCategoryGroups((current) => Array.from(new Set([...current, ...selectedGroupIds])))
  }, [categoryGroups, getGroupChildIds, selectedCategories])

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)

      try {
        const response = await productService.getProducts({
          keyword,
          category: selectedCategories,
          sort,
        })

        if (!isMounted) {
          return
        }

        if (response.success) {
          setProducts(response.data)
        } else {
          setProducts([])
        }
      } catch {
        if (!isMounted) {
          return
        }

        setProducts([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [keyword, selectedCategories, sort, searchParamsKey])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const min = priceRange.min ? Number(priceRange.min) : null
      const max = priceRange.max ? Number(priceRange.max) : null
      const matchesMin = Number.isFinite(min) ? product.price >= min : true
      const matchesMax = Number.isFinite(max) ? product.price <= max : true
      const matchesRating = ratingFilter ? product.rating >= Number(ratingFilter) : true

      return matchesMin && matchesMax && matchesRating
    })
  }, [priceRange.max, priceRange.min, products, ratingFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
  }, [filteredProducts, safePage])

  useEffect(() => {
    if (currentPage !== safePage) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('page', String(safePage))
      setSearchParams(nextParams, { replace: true })
    }
  }, [currentPage, safePage, searchParams, setSearchParams])

  const paginationItems = useMemo(() => {
    if (totalPages <= 1) {
      return [1]
    }

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (safePage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages]
    }

    if (safePage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, 'ellipsis-left', safePage - 1, safePage, safePage + 1, 'ellipsis-right', totalPages]
  }, [safePage, totalPages])

  const hasFilters = Boolean(
    keyword || selectedCategories.length || sort || priceRange.min || priceRange.max || ratingFilter,
  )
  const categoryLabelMap = useMemo(() => {
    const entries = []

    categoryGroups.forEach((group) => {
      entries.push([String(group.id), group.name])
      getGroupChildIds(group).forEach((childId) => {
        const child = group.children?.find((item) => String(item.id) === String(childId))
        entries.push([String(childId), child?.name || group.name])
      })
    })

    return new Map(entries)
  }, [categoryGroups, getGroupChildIds])
  const selectedCategoryLabel = selectedCategories.length
    ? selectedCategories
        .flatMap((category) => String(category).split(','))
        .map((categoryId) => categoryLabelMap.get(String(categoryId)))
        .filter(Boolean)
        .join(', ') || selectedCategories.join(', ')
    : ''

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col px-3 py-6">
      <nav className="mb-6 flex items-center gap-2 text-[12px] text-[#8f7069]">
        <Link to="/" className="transition hover:text-[#ee4d2d]">
          Trang chủ
        </Link>
        <span>›</span>
        <span className="text-[#1b1c1c]">
          {selectedCategoryLabel || 'Tất cả sản phẩm'}
        </span>
      </nav>

      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <aside className="hidden w-[240px] shrink-0 rounded-xl border border-[#e3beb6] bg-white p-4 shadow-sm md:sticky md:top-24 md:block">
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-[#1b1c1c]">Danh mục</h3>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="desktop-category"
                  checked={!selectedCategories.length}
                  onChange={clearCategoryFilter}
                  className="h-4 w-4 rounded-full border-[#8f7069] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                />
                <span className={`text-sm transition ${!selectedCategories.length ? 'text-[#ee4d2d]' : 'text-[#5b403b]'}`}>
                  Tất cả
                </span>
              </label>
              {categoryGroups.map((group) => {
                const childIds = getGroupChildIds(group)
                const groupValue = childIds.join(',')
                const isGroupSelected = selectedCategoryValue === groupValue
                const isOpen = openCategoryGroups.includes(group.id)

                return (
                  <div key={group.id} className="rounded-lg border border-[#f0d8d2] bg-[#fbf9f9]">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="desktop-category"
                          checked={isGroupSelected}
                          onChange={() => selectCategoryGroup(group)}
                          className="h-4 w-4 rounded-full border-[#8f7069] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                        />
                        <span className={`truncate text-sm font-semibold transition ${isGroupSelected ? 'text-[#ee4d2d]' : 'text-[#1b1c1c]'}`}>
                          {group.name}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleCategoryGroup(group.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded text-[#8f7069] transition hover:bg-white hover:text-[#ee4d2d]"
                        aria-label={`${isOpen ? 'Thu gọn' : 'Mở'} ${group.name}`}
                      >
                        <span className={`material-symbols-outlined text-[18px] transition ${isOpen ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="space-y-1 border-t border-[#f0d8d2] bg-white px-3 py-2">
                        {(group.children?.length ? group.children : [group]).map((child) => {
                          const childValue = String(child.id)
                          const isSelected = selectedCategories.includes(childValue)

                          return (
                            <label key={child.id} className="flex cursor-pointer items-center gap-2 py-1">
                              <input
                                type="radio"
                                name="desktop-category"
                                checked={isSelected}
                                onChange={() => selectCategory(child.id)}
                                className="h-4 w-4 rounded-full border-[#8f7069] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                              />
                              <span className={`text-sm transition ${isSelected ? 'font-semibold text-[#ee4d2d]' : 'text-[#5b403b]'}`}>
                                {child.name}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="my-4 border-t border-[#e3beb6]" />

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-[#1b1c1c]">Khoảng giá (VNĐ)</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={priceInput.min}
                onChange={(event) => setPriceInput((prev) => ({ ...prev, min: event.target.value }))}
                placeholder="Từ"
                className="w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-2 py-1.5 text-sm outline-none transition focus:border-[#ee4d2d]"
              />
              <span className="text-[#8f7069]">-</span>
              <input
                type="number"
                inputMode="numeric"
                value={priceInput.max}
                onChange={(event) => setPriceInput((prev) => ({ ...prev, max: event.target.value }))}
                placeholder="Đến"
                className="w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-2 py-1.5 text-sm outline-none transition focus:border-[#ee4d2d]"
              />
            </div>
            <button
              type="button"
              onClick={applyPriceRange}
              className="mt-3 w-full rounded bg-[#f5f3f3] px-4 py-2 text-xs font-medium text-[#1b1c1c] transition hover:bg-[#e9e8e7]"
            >
              Áp dụng
            </button>
          </div>

          <div className="my-4 border-t border-[#e3beb6]" />

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#1b1c1c]">Đánh giá</h3>
            <div className="space-y-2 text-sm text-[#5b403b]">
              {ratingOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === option.value}
                    onChange={() => setRatingFilter(option.value)}
                    className="border-[#8f7069] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                  />
                  <RatingRow stars={option.stars} label={option.label} />
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === ''}
                  onChange={() => setRatingFilter('')}
                  className="border-[#8f7069] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                />
                <span>Tất cả</span>
              </label>
            </div>
          </div>

          {hasFilters ? (
            <>
              <div className="my-4 border-t border-[#e3beb6]" />
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-lg bg-[#fff1ec] px-4 py-2 text-sm font-medium text-[#ee4d2d] transition hover:bg-[#ffe4db]"
              >
                Xóa bộ lọc
              </button>
            </>
          ) : null}
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 rounded-lg border border-[#e3beb6] bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-sm text-[#8f7069] sm:inline">Sắp xếp theo:</span>
                {sortOptions.map((option) => (
                  <button
                    key={option.value || 'default'}
                    type="button"
                    onClick={() => updateFilters({ sort: option.value })}
                    className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                      sort === option.value
                        ? 'bg-[#ee4d2d] text-white'
                        : 'border border-[#e3beb6] bg-[#fbf9f9] text-[#1b1c1c] hover:border-[#ee4d2d]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#8f7069]">
                Hiển thị {(safePage - 1) * PRODUCTS_PER_PAGE + 1} - {Math.min(safePage * PRODUCTS_PER_PAGE, filteredProducts.length)} của {filteredProducts.length} sản phẩm
              </span>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-[#e3beb6] bg-white p-4 shadow-sm">
            <div className="space-y-3 md:hidden">
              <input
                type="search"
                value={keyword}
                onChange={(event) => updateFilters({ keyword: event.target.value })}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm outline-none transition focus:border-[#ee4d2d]"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className={`rounded-full px-3 py-2 text-sm ${
                    !selectedCategories.length
                      ? 'bg-[#ee4d2d] text-white'
                      : 'border border-[#e3beb6] bg-white text-[#5b403b]'
                  }`}
                >
                  Tất cả
                </button>
                {categoryGroups.map((group) => {
                  const groupValue = getGroupChildIds(group).join(',')
                  const isGroupSelected = selectedCategoryValue === groupValue

                  return (
                    <div key={group.id} className="w-full rounded-lg border border-[#f0d8d2] bg-[#fbf9f9] p-2">
                      <button
                        type="button"
                        onClick={() => selectCategoryGroup(group)}
                        className={`mb-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                          isGroupSelected
                            ? 'bg-[#ee4d2d] text-white'
                            : 'border border-[#e3beb6] bg-white text-[#1b1c1c]'
                        }`}
                      >
                        {group.name}
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {(group.children?.length ? group.children : [group]).map((child) => {
                          const childValue = String(child.id)
                          const isSelected = selectedCategories.includes(childValue)

                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => selectCategory(child.id)}
                              className={`rounded-full px-3 py-1.5 text-sm ${
                                isSelected
                                  ? 'bg-[#ee4d2d] text-white'
                                  : 'border border-[#e3beb6] bg-white text-[#5b403b]'
                              }`}
                            >
                              {child.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hidden md:block">
              <input
                type="search"
                value={keyword}
                onChange={(event) => updateFilters({ keyword: event.target.value })}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-11 w-full rounded-full border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm outline-none transition focus:border-[#ee4d2d]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-[#e3beb6] bg-white py-16 text-center text-[#5b403b]">
              Đang tải danh sách sản phẩm...
            </div>
          ) : filteredProducts.length ? (
            <>
              <ProductGrid products={paginatedProducts} />
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => updateFilters({ page: safePage - 1 })}
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-[#8f7069] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  ‹
                </button>

                {paginationItems.map((item, index) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateFilters({ page: item })}
                      className={`grid h-8 w-8 place-items-center rounded text-xs font-semibold ${
                        safePage === item
                          ? 'bg-[#ee4d2d] text-white'
                          : 'border border-[#e3beb6] bg-white text-[#1b1c1c]'
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={`${item}-${index}`} className="px-1 text-sm text-[#8f7069]">
                      ...
                    </span>
                  ),
                )}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => updateFilters({ page: safePage + 1 })}
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-[#1b1c1c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  ›
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#e3beb6] bg-white py-16 text-center">
              <h2 className="text-xl font-semibold text-[#1b1c1c]">Không tìm thấy sản phẩm phù hợp</h2>
              <p className="mt-2 text-sm text-[#5b403b]">Hãy thử đổi từ khóa hoặc chọn danh mục khác.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-lg bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
