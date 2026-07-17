import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
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

function createCombinations(attributes) {
  if (!attributes.length || attributes.some((attribute) => !attribute.values.length)) return []
  return attributes.reduce(
    (result, attribute) => result.flatMap((values) => attribute.values.map((value) => [...values, value])),
    [[]],
  )
}

function normalizeProductAttributes(product) {
  if (Array.isArray(product.attributes) && product.attributes.length) {
    return product.attributes.map((attribute, index) => ({
      ...attribute,
      id: attribute.id || `attribute-${index + 1}`,
      values: Array.isArray(attribute.values) ? attribute.values : [],
    }))
  }

  const productVariants = Array.isArray(product.variants) && product.variants.length ? product.variants : product.skus

  if (Array.isArray(productVariants) && productVariants.some((variant) => variant.option1Name || variant.option2Name)) {
    return [1, 2]
      .map((optionIndex) => {
        const nameKey = `option${optionIndex}Name`
        const valueKey = `option${optionIndex}Value`
        const name = productVariants.find((variant) => variant[nameKey])?.[nameKey]
        const values = Array.from(new Set(productVariants.map((variant) => variant[valueKey]).filter(Boolean)))

        return name && values.length
          ? { id: `option-${optionIndex}`, name, values }
          : null
      })
      .filter(Boolean)
  }

  if (Array.isArray(productVariants) && productVariants.length) {
    return [{
      id: 'legacy-variant',
      name: 'Biến thể',
      values: productVariants.map((sku) => sku.variantName).filter(Boolean),
    }]
  }

  return []
}

export default function SellerProductEditPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedSku = searchParams.get('sku') || ''
  const { currentUser } = useAuth()
  const [productResponse, setProductResponse] = useState({ success: false, isLoading: true })
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    stockQuantity: '',
    status: PRODUCT_STATUSES.ACTIVE,
    imageUrl: '/images/products/headphones.png',
  })
  const [attributes, setAttributes] = useState([])
  const [variantData, setVariantData] = useState({})
  const [variantImages, setVariantImages] = useState({})
  const [attributeDrafts, setAttributeDrafts] = useState({})
  const hasVariants = attributes.length > 0
  const variantCombinations = useMemo(() => createCombinations(attributes), [attributes])
  const variantNames = variantCombinations.map((values) => values.join(' / '))
  const variantPreviewResponse = sellerService.previewSellerProductVariantSkus(currentUser, {
    name: form.name,
    category: form.category,
    skus: variantNames.map((variantName) => ({ variantName, price: form.price, stockQuantity: form.stockQuantity })),
  })
  const variantPreviews = variantPreviewResponse.data || []
  const variantRows = variantCombinations.map((values, index) => {
    const variantName = values.join(' / ')
    const storedVariant = variantData[variantName] || {}
    const variantImage = values
      .map((value, valueIndex) => variantImages[`${attributes[valueIndex]?.id}:${value}`])
      .find(Boolean)

    return {
      variantId: storedVariant.variantId || null,
      skuId: storedVariant.skuId || variantPreviews[index]?.skuId || `SKU-EDIT-${index + 1}`,
      skuCode: storedVariant.skuCode || variantPreviews[index]?.skuCode || '',
      variantName,
      option1Name: attributes[0]?.name || '',
      option1Value: values[0] || '',
      option2Name: attributes[1]?.name || '',
      option2Value: values[1] || '',
      price: Number(storedVariant.price ?? form.price),
      originalPrice: Number(storedVariant.originalPrice ?? storedVariant.price ?? form.price),
      stockQuantity: Number(storedVariant.stockQuantity ?? form.stockQuantity),
      status: storedVariant.status || PRODUCT_STATUSES.ACTIVE,
      isDefault: storedVariant.isDefault ?? index === 0,
      imageUrl: variantImage || storedVariant.imageUrl || form.imageUrl,
    }
  })

  useEffect(() => {
    let isMounted = true

    setProductResponse({ success: false, isLoading: true })
    Promise.resolve(sellerService.getSellerProductById(currentUser, productId))
      .then((response) => {
        if (isMounted) setProductResponse(response)
      })
      .catch((loadError) => {
        if (isMounted) {
          setProductResponse({ success: false, message: loadError.message || 'Không thể tải sản phẩm.' })
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUser, productId])

  useEffect(() => {
    if (!productResponse.success) return

    const product = productResponse.data || {}
    setForm({
      name: product.name || '',
      sku: product.skuCode || '',
      description: product.description || '',
      category: product.category || '',
      price: String(product.price || ''),
      stockQuantity: String(product.stockQuantity ?? ''),
      status: product.status || PRODUCT_STATUSES.ACTIVE,
      imageUrl: product.imageUrl || '/images/products/headphones.png',
    })
    setAttributes(normalizeProductAttributes(product))
    setVariantData(Object.fromEntries((product.variants || product.skus || []).map((sku) => [sku.variantName, { ...sku }])))
    setVariantImages(product.variantImages || {})
  }, [productResponse])

  useEffect(() => {
    if (!selectedSku || !variantRows.length) return

    const selectedRow = document.querySelector('[data-selected-sku-row="true"]')
    selectedRow?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selectedSku, variantRows.length])

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setError('')
  }

  const updateVariant = (variantName, field, value) => {
    setVariantData((current) => ({
      ...current,
      [variantName]: { ...current[variantName], [field]: value },
    }))
  }

  const addAttribute = () => {
    if (attributes.length >= 4) return setError('Chỉ được tạo tối đa 4 thuộc tính biến thể.')
    setAttributes((current) => [
      ...current,
      { id: `attribute-${Date.now()}`, name: `Thuộc tính ${current.length + 1}`, values: ['Mặc định'] },
    ])
  }

  const addAttributeValue = (attributeId) => {
    const value = String(attributeDrafts[attributeId] || '').trim()
    const attribute = attributes.find((item) => item.id === attributeId)
    if (!value) return setError('Vui lòng nhập giá trị biến thể.')
    if (attribute?.values.some((item) => item.toLocaleLowerCase('vi') === value.toLocaleLowerCase('vi'))) {
      return setError('Giá trị biến thể đã tồn tại.')
    }
    setAttributes((current) => current.map((item) => (
      item.id === attributeId ? { ...item, values: [...item.values, value] } : item
    )))
    setAttributeDrafts((current) => ({ ...current, [attributeId]: '' }))
    setError('')
  }

  const addVariantImage = (attributeId, value, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setVariantImages((current) => ({
      ...current,
      [`${attributeId}:${value}`]: String(reader.result || ''),
    }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = hasVariants
      ? {
          ...form,
          attributes,
          variantImages,
          variants: variantRows,
          skus: variantRows,
          price: Math.min(...variantRows.map((sku) => sku.price)),
          originalPrice: Math.min(...variantRows.map((sku) => sku.originalPrice)),
          stockQuantity: variantRows.reduce((total, sku) => total + sku.stockQuantity, 0),
        }
      : form
    const response = await Promise.resolve(sellerService.updateSellerProduct(currentUser, productId, payload))

    if (!response.success) {
      setError(response.message || 'Không thể cập nhật sản phẩm.')
      return
    }

    navigate('/seller/products', { replace: true })
  }

  if (productResponse.isLoading) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#5b403b] shadow-sm">
          Đang tải sản phẩm seller...
        </div>
      </section>
    )
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

      <form onSubmit={handleSubmit} id="seller-product-edit-form" className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-5 p-4 md:p-6 lg:grid-cols-4">
        <div className="lg:col-span-4">
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

        <div className="contents">
          <section className="order-1 rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm lg:col-span-3 lg:col-start-1 lg:row-start-2">
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
                    {hasVariants ? 'SKU đại diện' : 'Mã SKU'}
                  </FieldLabel>
                  <input
                    id="edit-sku"
                    value={form.sku}
                    readOnly
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

          <section className={`order-3 rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm lg:col-span-3 lg:col-start-1 ${hasVariants ? 'lg:row-start-4' : 'lg:row-start-3'}`}>
            <h2 className="mb-4 border-b border-[#e3e2e2] pb-3 text-xl font-semibold text-[#1b1c1c]">Mô tả chi tiết</h2>
            <textarea
              rows="7"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="w-full resize-y rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 py-3 text-sm leading-6 text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </section>
        </div>

        <div className={`order-4 flex flex-col gap-5 lg:col-start-4 lg:row-start-2 ${hasVariants ? 'lg:row-span-3' : 'lg:row-span-2'}`}>
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
                    value={hasVariants && variantRows.length ? Math.min(...variantRows.map((sku) => sku.price)) : form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    readOnly={hasVariants}
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
                  value={hasVariants ? variantRows.reduce((total, sku) => total + sku.stockQuantity, 0) : form.stockQuantity}
                  onChange={(event) => updateField('stockQuantity', event.target.value)}
                  readOnly={hasVariants}
                  className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                    required
                  />
                  {hasVariants ? <p className="mt-2 text-xs text-[#8f7069]">Tự động tính từ toàn bộ SKU biến thể bên dưới.</p> : null}
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

        {hasVariants ? (
          <section className="order-2 rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm lg:col-span-3 lg:col-start-1 lg:row-start-3">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e2e2] pb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1b1c1c]">Biến thể & SKU</h2>
                <p className="mt-1 text-xs text-[#5b403b]">Chỉnh thuộc tính, ảnh, giá và tồn kho riêng cho từng tổ hợp SKU.</p>
              </div>
              <button type="button" onClick={addAttribute} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#b22204] px-4 text-sm font-bold text-[#b22204] hover:bg-[#fff7f5]">
                <SellerIcon name="add" className="text-[18px]" />
                Thêm thuộc tính
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#e3beb6] bg-[#fbf9f9]">
              {attributes.map((attribute, attributeIndex) => (
                <div key={attribute.id} className={`grid gap-4 p-4 md:grid-cols-[170px_minmax(0,1fr)_40px] ${attributeIndex < attributes.length - 1 ? 'border-b border-[#e3beb6]' : ''}`}>
                  <div>
                    <FieldLabel htmlFor={`edit-attribute-${attribute.id}`}>Tên thuộc tính {attributeIndex + 1}</FieldLabel>
                    <input
                      id={`edit-attribute-${attribute.id}`}
                      value={attribute.name}
                      onChange={(event) => setAttributes((current) => current.map((item) => (
                        item.id === attribute.id ? { ...item, name: event.target.value } : item
                      )))}
                      className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-sm font-semibold outline-none focus:border-[#ee4d2d]"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold text-[#1b1c1c]">Giá trị thuộc tính · có thể đổi ảnh</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {attribute.values.map((value) => {
                        const imageKey = `${attribute.id}:${value}`
                        return (
                          <span key={value} className="inline-flex items-center gap-1 rounded-full border border-[#e3beb6] bg-white py-1.5 pl-2 pr-2 text-sm">
                            <label title={`Đổi ảnh cho ${value}`} className="grid h-7 w-7 cursor-pointer place-items-center overflow-hidden rounded-full border border-[#e3beb6] bg-[#fff7f5] text-[#b22204]">
                              {variantImages[imageKey]
                                ? <img src={variantImages[imageKey]} alt={`Biến thể ${value}`} className="h-full w-full object-cover" />
                                : <SellerIcon name="add_photo_alternate" className="text-[15px]" />}
                              <input type="file" accept="image/*" className="hidden" onChange={(event) => { addVariantImage(attribute.id, value, event.target.files?.[0]); event.target.value = '' }} />
                            </label>
                            <span className="px-1">{value}</span>
                            <button
                              type="button"
                              disabled={attribute.values.length === 1}
                              onClick={() => setAttributes((current) => current.map((item) => (
                                item.id === attribute.id
                                  ? { ...item, values: item.values.filter((entry) => entry !== value) }
                                  : item
                              )))}
                              aria-label={`Xóa ${value}`}
                              className="grid h-5 w-5 place-items-center rounded-full hover:bg-red-50 hover:text-[#b22204] disabled:opacity-30"
                            >
                              <SellerIcon name="close" className="text-[14px]" />
                            </button>
                          </span>
                        )
                      })}
                      <input
                        value={attributeDrafts[attribute.id] || ''}
                        onChange={(event) => setAttributeDrafts((current) => ({ ...current, [attribute.id]: event.target.value }))}
                        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addAttributeValue(attribute.id) } }}
                        placeholder="Giá trị mới"
                        className="h-9 w-32 rounded-full border border-dashed border-[#e3beb6] bg-white px-3 text-sm outline-none focus:border-[#ee4d2d]"
                      />
                      <button type="button" onClick={() => addAttributeValue(attribute.id)} className="h-9 rounded-full border border-dashed border-[#ee4d2d] px-3 text-sm font-bold text-[#ee4d2d]">Thêm</button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={attributes.length === 1}
                    onClick={() => setAttributes((current) => current.filter((item) => item.id !== attribute.id))}
                    aria-label={`Xóa thuộc tính ${attribute.name}`}
                    className="mt-6 grid h-9 w-9 place-items-center rounded-lg text-[#5b403b] hover:bg-red-50 hover:text-[#b22204] disabled:opacity-30"
                  >
                    <SellerIcon name="delete" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 overflow-x-auto rounded-lg border border-[#e3beb6]">
              <table className="w-full min-w-[1180px] table-fixed text-left text-sm">
                <colgroup><col className="w-[280px]" /><col /><col className="w-[145px]" /><col className="w-[145px]" /><col className="w-[110px]" /><col className="w-[150px]" /></colgroup>
                <thead className="bg-[#fbf9f9] text-xs text-[#5b403b]">
                  <tr><th className="px-4 py-3">Biến thể</th><th className="px-4 py-3">Mã SKU</th><th className="px-4 py-3 text-right">Giá bán</th><th className="px-4 py-3 text-right">Giá gốc</th><th className="px-4 py-3 text-right">Tồn kho</th><th className="px-4 py-3">Trạng thái</th></tr>
                </thead>
                <tbody className="divide-y divide-[#eee5e2]">
                  {variantRows.map((sku) => {
                    const isSelectedSku = selectedSku && (String(sku.skuId) === selectedSku || String(sku.skuCode) === selectedSku)

                    return (
                    <tr key={sku.variantName} data-selected-sku-row={isSelectedSku ? 'true' : undefined} className={isSelectedSku ? 'bg-[#fff1ec] ring-1 ring-inset ring-[#ee4d2d]/30' : ''}>
                      <td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><img src={sku.imageUrl || form.imageUrl} alt="" className="h-9 w-9 shrink-0 rounded-md border border-[#e3beb6] object-cover" /><span className="truncate font-semibold" title={sku.variantName}>{sku.variantName}</span></div></td>
                      <td className="px-4 py-3"><span className="block truncate font-mono text-xs" title={sku.skuCode}>{sku.skuCode}</span></td>
                      <td className="px-4 py-3"><input type="number" min="0" value={variantData[sku.variantName]?.price ?? sku.price} onChange={(event) => updateVariant(sku.variantName, 'price', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td>
                      <td className="px-4 py-3"><input type="number" min="0" value={variantData[sku.variantName]?.originalPrice ?? sku.originalPrice} onChange={(event) => updateVariant(sku.variantName, 'originalPrice', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td>
                      <td className="px-4 py-3"><input type="number" min="0" value={variantData[sku.variantName]?.stockQuantity ?? sku.stockQuantity} onChange={(event) => updateVariant(sku.variantName, 'stockQuantity', event.target.value)} className="h-9 w-20 rounded border border-[#e3beb6] px-2 text-right" /></td>
                      <td className="px-4 py-3"><select value={variantData[sku.variantName]?.status ?? sku.status} onChange={(event) => updateVariant(sku.variantName, 'status', event.target.value)} className="h-9 w-full rounded border border-[#e3beb6] bg-white px-2 text-xs font-semibold"><option value={PRODUCT_STATUSES.ACTIVE}>Đang bán</option><option value={PRODUCT_STATUSES.HIDDEN}>Đã ẩn</option><option value={PRODUCT_STATUSES.OUT_OF_STOCK}>Hết hàng</option></select></td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#5b403b]">{variantRows.length} SKU · Tổng tồn kho {variantRows.reduce((total, sku) => total + sku.stockQuantity, 0)}</p>
          </section>
        ) : null}
      </form>

      <div className="fixed bottom-0 right-0 z-30 w-full border-t border-[#e3e2e2] bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:w-[calc(100%-280px)]">
        <div className="mx-auto flex max-w-[1600px] justify-end gap-3">
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
