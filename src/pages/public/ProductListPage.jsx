import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../../components/buyer/ProductGrid'
import { productService } from '../../services/productService'

const sortOptions = [
  { value: '', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'best-selling', label: 'Bán chạy' },
  { value: 'top-rated', label: 'Đánh giá cao' },
]

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || ''
  const hasFilters = Boolean(keyword || (category && category !== 'all') || sort)

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })

    setSearchParams(nextParams, { replace: true })
  }

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      const response = await productService.getCategories()

      if (isMounted && response.success) {
        setCategories(response.data)
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)

      const response = await productService.getProducts({ keyword, category, sort })

      if (!isMounted) {
        return
      }

      if (response.success) {
        setProducts(response.data)
      }

      setIsLoading(false)
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [keyword, category, sort])

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-6 md:px-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-[#5b403b]">
        <Link to="/" className="hover:text-[#ee4d2d]">
          Trang chủ
        </Link>
        <span>›</span>
        <span>{category === 'all' ? 'Tất cả sản phẩm' : category}</span>
      </div>

      <section className="mb-6 rounded-xl border border-[#e3beb6]/70 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#ee4d2d]">Danh sách sản phẩm</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1b1c1c]">
              {keyword ? `Kết quả cho "${keyword}"` : category === 'all' ? 'Khám phá sản phẩm nổi bật' : category}
            </h1>
            <p className="mt-2 text-sm text-[#5b403b]">
              {products.length} sản phẩm đang hiển thị theo bộ lọc hiện tại.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="block min-w-[220px]">
              <span className="sr-only">Tìm kiếm sản phẩm</span>
              <input
                type="search"
                value={keyword}
                onChange={(event) => updateFilters({ keyword: event.target.value })}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-11 w-full rounded-full border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
            </label>

            <select
              value={category}
              onChange={(event) => updateFilters({ category: event.target.value })}
              className="h-11 rounded-full border border-[#e3beb6] bg-white px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15 md:hidden"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-fit rounded-xl border border-[#e3beb6]/70 bg-white p-4 shadow-sm lg:block lg:sticky lg:top-28">
          <h2 className="font-semibold">Danh mục</h2>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={category === 'all'}
                onChange={() => updateFilters({ category: 'all' })}
                className="h-4 w-4 accent-[#ee4d2d]"
              />
              Tất cả
            </label>
            {categories.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={category === item}
                  onChange={() => updateFilters({ category: item })}
                  className="h-4 w-4 accent-[#ee4d2d]"
                />
                {item}
              </label>
            ))}
          </div>

          <div className="my-5 border-t border-[#e3beb6]/70" />

          <label className="block">
            <span className="text-sm font-medium">Tìm trong danh sách</span>
            <input
              type="search"
              value={keyword}
              onChange={(event) => updateFilters({ keyword: event.target.value })}
              placeholder="Tên sản phẩm..."
              className="mt-2 w-full rounded-lg border border-[#e3beb6] px-3 py-2 text-sm outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </label>

          <div className="my-5 border-t border-[#e3beb6]/70" />

          <h3 className="text-sm font-semibold">Đánh giá</h3>
          <div className="mt-3 space-y-2 text-sm text-[#5b403b]">
            <p>★ ★ ★ ★ ★ từ 5 sao</p>
            <p>★ ★ ★ ★ ☆ từ 4 sao</p>
          </div>

          {hasFilters ? (
            <>
              <div className="my-5 border-t border-[#e3beb6]/70" />
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-lg bg-[#f5f3f3] px-4 py-2 text-sm font-medium text-[#1b1c1c] transition hover:bg-[#e9e8e7]"
              >
                Xóa bộ lọc
              </button>
            </>
          ) : null}
        </aside>

        <section>
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#e3beb6]/70 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#5b403b]">Sắp xếp theo</span>
              {sortOptions.map((option) => (
                <button
                  key={option.value || 'default'}
                  type="button"
                  onClick={() => updateFilters({ sort: option.value })}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                    sort === option.value
                      ? 'border-[#ee4d2d] bg-[#ee4d2d] text-white'
                    : 'border-[#e3beb6] bg-white text-[#1b1c1c] hover:border-[#ee4d2d]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-[#5b403b]">Hiển thị {products.length} sản phẩm</span>
          </div>

          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => updateFilters({ category: 'all' })}
              className={`rounded-full px-3 py-2 text-sm transition ${
                category === 'all' ? 'bg-[#ee4d2d] text-white' : 'bg-white text-[#5b403b] border border-[#e3beb6]'
              }`}
            >
              Tất cả
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateFilters({ category: item })}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  category === item ? 'bg-[#ee4d2d] text-white' : 'bg-white text-[#5b403b] border border-[#e3beb6]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-[#e3beb6]/70 bg-white py-16 text-center text-[#5b403b]">
              Đang tải danh sách sản phẩm...
            </div>
          ) : products.length ? (
            <>
              <ProductGrid products={products} />
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-[#8f7069]"
                  disabled
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded bg-[#ee4d2d] text-xs font-semibold text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-xs font-semibold text-[#1b1c1c] hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-xs font-semibold text-[#1b1c1c] hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
                >
                  3
                </button>
                <span className="px-1 text-sm text-[#8f7069]">...</span>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] bg-white text-[#1b1c1c] hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
                >
                  ›
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#e3beb6]/70 bg-white py-16 text-center">
              <h2 className="text-xl font-semibold">Không tìm thấy sản phẩm phù hợp</h2>
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
        </section>
      </div>
    </div>
  )
}
