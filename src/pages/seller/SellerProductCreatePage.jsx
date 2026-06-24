import { useMemo, useState } from 'react'
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
  originalPrice: '1890000',
  stockQuantity: '50',
  category: 'Thiết bị âm thanh',
  imageUrl: '/images/products/headphones.png',
}

const initialAttributes = [
  { id: 'color', name: 'Màu sắc', values: ['Đen', 'Trắng', 'Bạc'] },
  { id: 'version', name: 'Phiên bản', values: ['Tiêu chuẩn', 'Cao cấp'] },
]

function createCombinations(attributes) {
  if (!attributes.length || attributes.some((attribute) => !attribute.values.length)) {
    return []
  }

  return attributes.reduce(
    (combinations, attribute) => combinations.flatMap((combination) => attribute.values.map((value) => [...combination, value])),
    [[]],
  )
}

function normalizeSkuPart(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'D')
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean)
    .map((part) => (part.length > 4 ? part.slice(0, 4) : part))
    .join('-') || 'STD'
}

function createVariantSku(defaultSku, variantName, index) {
  const prefix = String(defaultSku || 'TTS-PRODUCT').replace(/-STD-\d{3}$/, '')
  return `${prefix}-${normalizeSkuPart(variantName)}-${String(index + 1).padStart(3, '0')}`
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
  const [hasVariants, setHasVariants] = useState(true)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [attributeDrafts, setAttributeDrafts] = useState({})
  const [variantData, setVariantData] = useState({})
  const [images, setImages] = useState([initialForm.imageUrl])
  const skuPreviewResponse = sellerService.previewSellerProductSku(currentUser, form)
  const skuPreview = skuPreviewResponse.data?.skuCode || 'SKU sẽ hiển thị khi có tên và danh mục'
  const variantNames = useMemo(
    () => createCombinations(attributes).map((values) => values.join(' / ')),
    [attributes],
  )
  const variantSkuPreviewResponse = sellerService.previewSellerProductVariantSkus(currentUser, {
    ...form,
    skus: variantNames.map((variantName) => ({ variantName, price: form.price, stockQuantity: form.stockQuantity })),
  })
  const variantSkuPreviews = variantSkuPreviewResponse.data || []
  const variantRows = variantNames.map((variantName, index) => ({
    skuId: `SKU-VARIANT-${String(index + 1).padStart(3, '0')}`,
    skuCode: variantSkuPreviews[index]?.skuCode || createVariantSku(skuPreview, variantName, index),
    variantName,
    price: Number(variantData[variantName]?.price ?? form.price),
    originalPrice: Number(variantData[variantName]?.originalPrice ?? form.originalPrice),
    stockQuantity: Number(variantData[variantName]?.stockQuantity ?? form.stockQuantity),
    status: variantData[variantName]?.hidden ? 'HIDDEN' : 'ACTIVE',
  }))

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setError('')
    setMessage('')
  }

  const handleImageChange = (event) => {
    const files = [...(event.target.files || [])].slice(0, 9 - images.length)

    if (!files.length) {
      return
    }

    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.readAsDataURL(file)
    }))).then((loadedImages) => {
      setImages((current) => [...current, ...loadedImages])
      if (!images.length && loadedImages[0]) updateField('imageUrl', loadedImages[0])
    })
    event.target.value = ''
  }


  const addAttribute = () => {
    if (attributes.length >= 4) {
      setError('Chỉ được tạo tối đa 4 thuộc tính biến thể.')
      return
    }

    setAttributes((current) => [
      ...current,
      { id: `attribute-${Date.now()}`, name: `Thuộc tính ${current.length + 1}`, values: ['Mặc định'] },
    ])
  }

  const updateAttributeName = (attributeId, name) => {
    setAttributes((current) => current.map((attribute) => (attribute.id === attributeId ? { ...attribute, name } : attribute)))
  }

  const addAttributeValue = (attributeId) => {
    const value = String(attributeDrafts[attributeId] || '').trim()
    const attribute = attributes.find((item) => item.id === attributeId)

    if (!value || attribute?.values.some((item) => item.toLocaleLowerCase('vi') === value.toLocaleLowerCase('vi'))) {
      setError(value ? 'Giá trị biến thể đã tồn tại.' : 'Vui lòng nhập giá trị biến thể.')
      return
    }

    setAttributes((current) => current.map((item) => (item.id === attributeId ? { ...item, values: [...item.values, value] } : item)))
    setAttributeDrafts((current) => ({ ...current, [attributeId]: '' }))
    setError('')
  }

  const removeAttributeValue = (attributeId, value) => {
    setAttributes((current) => current.map((attribute) => (
      attribute.id === attributeId && attribute.values.length > 1
        ? { ...attribute, values: attribute.values.filter((item) => item !== value) }
        : attribute
    )))
  }

  const updateVariant = (variantName, field, value) => {
    setVariantData((current) => ({
      ...current,
      [variantName]: { ...current[variantName], [field]: value },
    }))
  }


  const handleSubmit = (event) => {
    event.preventDefault()

    if (hasVariants && !variantRows.length) {
      setError('Vui lòng cấu hình ít nhất một tổ hợp biến thể.')
      return
    }

    const response = sellerService.createSellerProduct(currentUser, hasVariants
      ? {
          ...form,
          price: Math.min(...variantRows.map((row) => row.price)),
          originalPrice: Math.min(...variantRows.map((row) => row.originalPrice)),
          stockQuantity: variantRows.reduce((total, row) => total + row.stockQuantity, 0),
          skus: variantRows,
        }
      : form)

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
              <div className="mb-6 flex flex-col gap-4 border-b border-[#e3beb6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1b1c1c]">Bán hàng & Kho</h2>
                  <p className="mt-1 text-xs text-[#8f7069]">{hasVariants ? 'Mỗi tổ hợp biến thể có một SKU riêng.' : 'Sản phẩm sử dụng một SKU mặc định.'}</p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e3beb6] bg-[#fff7f5] px-4 py-3">
                  <span className="text-sm font-semibold text-[#1b1c1c]">Sản phẩm có biến thể</span>
                  <input type="checkbox" checked={hasVariants} onChange={(event) => setHasVariants(event.target.checked)} className="peer sr-only" />
                  <span className="relative h-6 w-11 rounded-full bg-[#c7b7b2] transition peer-checked:bg-[#ee4d2d] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                  <span className="text-xs font-bold text-[#ee4d2d]">{hasVariants ? 'Bật' : 'Tắt'}</span>
                </label>
              </div>

              {!hasVariants ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FieldLabel htmlFor="product-sku">Mã SKU tự động</FieldLabel>
                    <input id="product-sku" value={skuPreview} readOnly className="h-12 w-full rounded border border-[#e3beb6] bg-[#efeded] px-3 text-sm font-semibold text-[#5b403b]" />
                  </div>
                  <div><FieldLabel htmlFor="product-price" required>Giá bán (VNĐ)</FieldLabel><input id="product-price" type="number" min="0" value={form.price} onChange={(event) => updateField('price', event.target.value)} className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 text-right text-sm outline-none focus:border-[#ee4d2d]" /></div>
                  <div><FieldLabel htmlFor="product-original-price">Giá gốc (VNĐ)</FieldLabel><input id="product-original-price" type="number" min="0" value={form.originalPrice} onChange={(event) => updateField('originalPrice', event.target.value)} className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 text-right text-sm outline-none focus:border-[#ee4d2d]" /></div>
                  <div><FieldLabel htmlFor="product-stock" required>Số lượng tồn kho</FieldLabel><input id="product-stock" type="number" min="0" value={form.stockQuantity} onChange={(event) => updateField('stockQuantity', event.target.value)} className="h-12 w-full rounded border border-[#e3beb6] bg-[#fbf9f9] px-3 text-right text-sm outline-none focus:border-[#ee4d2d]" /></div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div><h3 className="font-bold text-[#1b1c1c]">Cấu hình biến thể</h3><p className="mt-1 text-xs text-[#8f7069]">Tối đa 4 thuộc tính cho mỗi sản phẩm.</p></div>
                    <button type="button" onClick={addAttribute} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#b22204] px-4 text-sm font-semibold text-[#b22204] hover:bg-[#fff7f5]"><SellerIcon name="add" className="text-[18px]" />Thêm thuộc tính</button>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e3beb6] bg-[#fbf9f9]">
                    {attributes.map((attribute, attributeIndex) => (
                      <div key={attribute.id} className={`grid gap-4 p-4 md:grid-cols-[160px_minmax(0,1fr)_40px] ${attributeIndex < attributes.length - 1 ? 'border-b border-[#e3beb6]' : ''}`}>
                        <div><FieldLabel htmlFor={`attribute-${attribute.id}`}>Tên thuộc tính {attributeIndex + 1}</FieldLabel><input id={`attribute-${attribute.id}`} value={attribute.name} onChange={(event) => updateAttributeName(attribute.id, event.target.value)} className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-sm font-semibold outline-none focus:border-[#ee4d2d]" /></div>
                        <div>
                          <span className="mb-2 block text-sm font-semibold">Giá trị thuộc tính</span>
                          <div className="flex min-h-10 flex-wrap items-center gap-2">
                            {attribute.values.map((value) => <span key={value} className="inline-flex items-center gap-1 rounded-full border border-[#e3beb6] bg-white py-2 pl-3 pr-2 text-sm">{value}<button type="button" onClick={() => removeAttributeValue(attribute.id, value)} aria-label={`Xóa ${value}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-red-50 hover:text-[#b22204]"><SellerIcon name="close" className="text-[14px]" /></button></span>)}
                            <input value={attributeDrafts[attribute.id] || ''} onChange={(event) => setAttributeDrafts((current) => ({ ...current, [attribute.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addAttributeValue(attribute.id) } }} placeholder="Giá trị mới" className="h-9 w-32 rounded-full border border-dashed border-[#e3beb6] bg-white px-3 text-sm outline-none focus:border-[#ee4d2d]" />
                            <button type="button" onClick={() => addAttributeValue(attribute.id)} className="h-9 rounded-full border border-dashed border-[#ee4d2d] px-3 text-sm font-semibold text-[#ee4d2d]">Thêm</button>
                          </div>
                        </div>
                        <button type="button" disabled={attributes.length === 1} onClick={() => setAttributes((current) => current.filter((item) => item.id !== attribute.id))} aria-label={`Xóa thuộc tính ${attribute.name}`} className="mt-7 grid h-9 w-9 place-items-center rounded-lg text-[#5b403b] hover:bg-red-50 hover:text-[#b22204] disabled:cursor-not-allowed disabled:opacity-30"><SellerIcon name="delete" className="text-[18px]" /></button>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-[#e3beb6]">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead className="bg-[#fbf9f9] text-xs text-[#5b403b]"><tr><th className="px-4 py-3">Biến thể</th><th className="px-4 py-3">Mã SKU tự động</th><th className="px-4 py-3 text-right">Giá bán</th><th className="px-4 py-3 text-right">Giá gốc</th><th className="px-4 py-3 text-right">Tồn kho</th><th className="px-4 py-3">Trạng thái</th></tr></thead>
                      <tbody className="divide-y divide-[#eee5e2]">
                        {variantRows.map((row) => (
                          <tr key={row.variantName}>
                            <td className="px-4 py-3 font-semibold">{row.variantName}</td><td className="px-4 py-3 font-mono text-xs">{row.skuCode}</td>
                            <td className="px-4 py-3"><input type="number" min="0" value={variantData[row.variantName]?.price ?? form.price} onChange={(event) => updateVariant(row.variantName, 'price', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td>
                            <td className="px-4 py-3"><input type="number" min="0" value={variantData[row.variantName]?.originalPrice ?? form.originalPrice} onChange={(event) => updateVariant(row.variantName, 'originalPrice', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td>
                            <td className="px-4 py-3"><input type="number" min="0" value={variantData[row.variantName]?.stockQuantity ?? form.stockQuantity} onChange={(event) => updateVariant(row.variantName, 'stockQuantity', event.target.value)} className="h-9 w-20 rounded border border-[#e3beb6] px-2 text-right" /></td>
                            <td className="px-4 py-3"><button type="button" onClick={() => updateVariant(row.variantName, 'hidden', !variantData[row.variantName]?.hidden)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${variantData[row.variantName]?.hidden ? 'bg-slate-100 text-slate-600' : Number(row.stockQuantity) === 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>{variantData[row.variantName]?.hidden ? 'Đã ẩn' : Number(row.stockQuantity) === 0 ? 'Hết hàng' : 'Đang bán'}</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
