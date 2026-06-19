import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { PRODUCT_STATUSES } from '../../mocks/products.mock'
import { sellerService } from '../../services/sellerService'

const productCategories = [
  'Điện tử',
  'Gia dụng',
  'Điện thoại & Phụ kiện',
  'Thiết bị âm thanh',
  'Máy tính & Laptop',
  'Thiết bị đeo thông minh',
]

const statusOptions = [
  { value: PRODUCT_STATUSES.ACTIVE, label: 'ACTIVE (Hiển thị)' },
  { value: PRODUCT_STATUSES.HIDDEN, label: 'INACTIVE (Ẩn)' },
  { value: PRODUCT_STATUSES.OUT_OF_STOCK, label: 'OUT_OF_STOCK (Hết hàng)' },
]

function FieldLabel({ htmlFor, children, required = false }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-[#1b1c1c]">
      {children} {required ? <span className="text-[#b22204]">*</span> : null}
    </label>
  )
}

export default function SellerProductEditPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const productResponse = useMemo(() => sellerService.getSellerProductById(currentUser, productId), [currentUser, productId])
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => {
    const product = productResponse.data || {}

    return {
      name: product.name || '',
      sku: `TT-${String(product.id || '').padStart(3, '0')}`,
      description: product.description || '',
      category: product.category || '',
      price: String(product.price || ''),
      stockQuantity: String(product.stockQuantity ?? ''),
      status: product.status || PRODUCT_STATUSES.ACTIVE,
      imageUrl: product.imageUrl || 'https://placehold.co/600x600/fff1ec/1b1c1c?text=Product',
    }
  })

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const response = sellerService.updateSellerProduct(currentUser, productId, form)

    if (!response.success) {
      setError(response.message || 'Không thể cập nhật sản phẩm.')
      return
    }

    navigate('/seller/products', { replace: true })
  }

  if (!productResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#1b1c1c]">Không tìm thấy sản phẩm</h1>
          <p className="mt-2 text-sm text-[#5b403b]">{productResponse.message}</p>
          <Link to="/seller/products" className="mt-5 inline-flex h-10 items-center rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white">
            Quay lại danh sách
          </Link>
        </div>
      </section>
    )
  }

  const product = productResponse.data

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9] pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#e3e2e2] bg-[#fbf9f9]/90 px-4 py-4 shadow-sm backdrop-blur md:px-6">
        <div className="flex items-center gap-1 text-xs font-medium text-[#5b403b]">
          <Link to="/seller/products" className="transition hover:text-[#b22204]">
            Sản phẩm
          </Link>
          <SellerIcon name="chevron_right" className="text-[16px]" />
          <span className="font-bold text-[#1b1c1c]">Chỉnh sửa</span>
        </div>
        <Link
          to={`/products/${product.id}`}
          className="hidden h-10 items-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm font-bold text-[#1b1c1c] shadow-sm transition hover:bg-[#f5f3f3] md:inline-flex"
        >
          <SellerIcon name="open_in_new" className="text-[16px]" />
          Xem trên cửa hàng
        </Link>
      </header>

      <form onSubmit={handleSubmit} id="seller-product-edit-form" className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Chỉnh sửa sản phẩm</h1>
              <p className="mt-1 text-xs text-[#5b403b]">
                ID: {product.id} • Lần cập nhật cuối: {product.updatedAt ? 'Đã lưu trong demo' : 'Mock data gốc'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e3beb6] bg-[#ffdad3] px-3 py-1.5 text-xs font-bold text-[#8d1600]">
              <span className="h-2 w-2 rounded-full bg-[#b22204]" />
              {form.status === PRODUCT_STATUSES.ACTIVE ? 'ĐANG HOẠT ĐỘNG' : 'ĐANG ẨN'}
            </div>
          </div>
          {error ? <div className="mt-4 rounded-lg border border-[#ba1a1a]/25 bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">{error}</div> : null}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="edit-name" required>
                  Tên sản phẩm
                </FieldLabel>
                <input
                  id="edit-name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="edit-sku" required>
                    Mã SKU
                  </FieldLabel>
                  <input
                    id="edit-sku"
                    value={form.sku}
                    onChange={(event) => updateField('sku', event.target.value)}
                    className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="edit-category" required>
                    Danh mục
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id="edit-category"
                      value={form.category}
                      onChange={(event) => updateField('category', event.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 pr-10 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <SellerIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Mô tả chi tiết</h2>
            <textarea
              rows="7"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="w-full resize-y rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 py-3 text-sm leading-6 text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Trạng thái</h2>
            <div className="relative">
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 pr-10 text-sm font-bold text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SellerIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5b403b]" />
            </div>
          </section>

          <section className="rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Giá & Kho</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="edit-price" required>
                  Giá bán (VNĐ)
                </FieldLabel>
                <div className="relative">
                  <input
                    id="edit-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 pr-10 text-right text-lg font-bold text-[#b22204] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#5b403b]">₫</span>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="edit-stock" required>
                  Tồn kho
                </FieldLabel>
                <input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) => updateField('stockQuantity', event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Hình ảnh</h2>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-[#e3beb6] bg-[#fbf9f9]">
              <img src={form.imageUrl} alt={form.name} className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#5b403b]">Gợi ý: hình ảnh vuông (1:1), nền sáng, độ phân giải tối thiểu 800x800px.</p>
          </section>
        </div>
      </form>

      <div className="fixed bottom-0 right-0 z-30 w-full border-t border-[#e3e2e2] bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:w-[calc(100%-280px)]">
        <div className="mx-auto flex max-w-[1200px] justify-end gap-3">
          <Link to="/seller/products" className="inline-flex h-10 items-center rounded-lg border border-[#e3beb6] px-5 text-sm font-bold text-[#1b1c1c] transition hover:bg-[#f5f3f3]">
            Hủy
          </Link>
          <button type="submit" form="seller-product-edit-form" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b22204] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d63c1e]">
            <SellerIcon name="save" filled className="text-[18px]" />
            Cập nhật sản phẩm
          </button>
        </div>
      </div>
    </section>
  )
}
