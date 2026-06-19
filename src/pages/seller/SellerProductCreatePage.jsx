import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'

const productCategories = [
  'Điện thoại & Phụ kiện',
  'Thiết bị âm thanh',
  'Máy tính & Laptop',
  'Thiết bị đeo thông minh',
]

const initialForm = {
  name: 'Tai nghe Bluetooth TechZone Pro',
  description:
    'Tai nghe không dây cao cấp với công nghệ chống ồn chủ động (ANC), mang lại trải nghiệm âm thanh rõ ràng. Thiết kế công thái học thoải mái khi đeo cả ngày dài.',
  price: '1500000',
  stockQuantity: '50',
  category: 'Thiết bị âm thanh',
  imageUrl: 'https://placehold.co/600x600/dbe4e2/1b1c1c?text=Audio',
}

function FieldLabel({ htmlFor, children, required = false }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
      {children} {required ? <span className="text-[#d0011b]">*</span> : null}
    </label>
  )
}

export default function SellerProductCreatePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setError('')
    setMessage('')
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateField('imageUrl', String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const response = sellerService.createSellerProduct(currentUser, form)

    if (!response.success) {
      setError(response.message || 'Không thể lưu sản phẩm mới.')
      return
    }

    setMessage(response.message || 'Đã lưu sản phẩm mới.')
    navigate('/seller/products', { replace: true })
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9]">
      <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-[#e3beb6] bg-white px-4 py-4 shadow-sm md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
            <Link to="/seller/products" className="transition hover:text-[#b22204]">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1b1c1c]">Thêm mới</span>
          </nav>
          <h1 className="text-xl font-bold tracking-tight text-[#1b1c1c]">Thêm sản phẩm mới</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/products"
            className="inline-flex h-11 min-w-[100px] items-center justify-center rounded border border-[#b22204] px-4 text-sm font-semibold text-[#b22204] transition hover:bg-[#ffdad3]"
          >
            Hủy
          </Link>
          <button
            type="submit"
            form="seller-product-create-form"
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d73211]"
          >
            Lưu sản phẩm
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] p-4 md:p-6">
        {error ? (
          <div className="mb-4 rounded-lg border border-[#ba1a1a]/25 bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mb-4 rounded-lg border border-[#16A34A]/25 bg-[#16A34A]/10 px-4 py-3 text-sm font-medium text-[#15803D]">
            {message}
          </div>
        ) : null}

        <form id="seller-product-create-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <section className="rounded-lg border border-[#e3beb6] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-base font-bold text-[#1b1c1c]">Thông tin cơ bản</h2>
              <div className="space-y-6">
                <div>
                  <FieldLabel htmlFor="product-name" required>
                    Tên sản phẩm
                  </FieldLabel>
                  <input
                    id="product-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Ví dụ: Tai nghe Bluetooth TechZone Pro v2"
                    className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="product-description">Mô tả chi tiết</FieldLabel>
                  <textarea
                    id="product-description"
                    rows="6"
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Nhập mô tả sản phẩm của bạn..."
                    className="w-full resize-y rounded border border-[#e3beb6] bg-[#fbf9f9] p-3 text-sm leading-6 text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#e3beb6] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-base font-bold text-[#1b1c1c]">Bán hàng & Kho</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="product-price" required>
                    Giá bán (VNĐ)
                  </FieldLabel>
                  <div className="relative">
                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => updateField('price', event.target.value)}
                      placeholder="0"
                      className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 pr-10 text-right text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#5b403b]">đ</span>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="product-stock" required>
                    Số lượng tồn kho
                  </FieldLabel>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={form.stockQuantity}
                    onChange={(event) => updateField('stockQuantity', event.target.value)}
                    placeholder="0"
                    className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 text-right text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <section className="rounded-lg border border-[#e3beb6] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1b1c1c]">Hình ảnh</h2>
                <span className="text-xs font-medium text-[#5b403b]">1/5</span>
              </div>

              <label className="group relative mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e3beb6] bg-[#fbf9f9] p-6 text-center transition hover:bg-[#efeded]">
                <input aria-label="Tải lên hình ảnh" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                <SellerIcon name="cloud_upload" className="mb-2 text-[40px] text-[#5b403b] transition group-hover:text-[#b22204]" />
                <span className="text-sm font-semibold text-[#1b1c1c]">Kéo thả ảnh vào đây</span>
                <span className="mt-1 text-xs font-medium text-[#5b403b]">hoặc click để chọn (Max 5MB)</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div className="group relative aspect-square overflow-hidden rounded border border-[#e3beb6] bg-[#fbf9f9]">
                  <img src={form.imageUrl} alt="Sản phẩm demo" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => updateField('imageUrl', initialForm.imageUrl)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-[#5b403b] opacity-0 shadow-sm transition hover:bg-[#ffdad6] hover:text-[#ba1a1a] group-hover:opacity-100"
                    aria-label="Xóa ảnh"
                  >
                    <SellerIcon name="close" className="text-[16px]" />
                  </button>
                  <div className="absolute bottom-0 left-0 w-full bg-[#e3e2e2]/80 py-0.5 text-center text-[10px] font-semibold text-[#1b1c1c]">Ảnh chính</div>
                </div>
                {[1, 2].map((slot) => (
                  <div key={slot} className="grid aspect-square place-items-center rounded border border-dashed border-[#e3beb6] bg-[#fbf9f9]">
                    <SellerIcon name="image" className="text-[24px] text-[#8f7069]" />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#e3beb6] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-base font-bold text-[#1b1c1c]">Phân loại</h2>
              <div>
                <FieldLabel htmlFor="product-category" required>
                  Danh mục sản phẩm
                </FieldLabel>
                <div className="relative">
                  <select
                    id="product-category"
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 pr-10 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  >
                    <option value="" disabled>
                      Chọn danh mục...
                    </option>
                    {productCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <SellerIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </section>
  )
}
