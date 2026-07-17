import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'

const categories = ['Điện thoại & Phụ kiện', 'Thiết bị âm thanh', 'Máy tính & Laptop', 'Thiết bị đeo thông minh']
const initialForm = {
  name: 'Tai nghe Bluetooth TechZone Pro',
  category: 'Thiết bị âm thanh',
  description: '',
  price: '1500000',
  originalPrice: '1890000',
  stockQuantity: '15',
}
const initialAttributes = [
  { id: 'color', name: 'Màu sắc', values: ['Đen', 'Trắng', 'Bạc'] },
  { id: 'version', name: 'Phiên bản', values: ['Tiêu chuẩn', 'Cao cấp', 'Giới hạn'] },
]

function combinations(attributes) {
  if (!attributes.length || attributes.some((attribute) => !attribute.values.length)) return []
  return attributes.reduce(
    (result, attribute) => result.flatMap((values) => attribute.values.map((value) => [...values, value])),
    [[]],
  )
}

const money = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)}đ`

function Field({ label, required = false, compact = false, children }) {
  return (
    <label className={`block font-semibold ${compact ? 'text-xs text-[#5b403b]' : 'text-sm text-[#1b1c1c]'}`}>
      {label} {required ? <span className="text-[#b42318]">*</span> : null}
       <span className={`${compact ? 'mt-1.5' : 'mt-2'} block`}>{children}</span>
    </label>
  )
}

export default function SellerProductVariantCreatePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [hasVariants, setHasVariants] = useState(true)
  const [attributes, setAttributes] = useState(initialAttributes)
  const [variantData, setVariantData] = useState({})
  const [variantImages, setVariantImages] = useState({})
  const [removedVariants, setRemovedVariants] = useState([])
  const [images, setImages] = useState(['/images/products/headphones.png'])
  const [bulk, setBulk] = useState({ price: '', originalPrice: '', stockQuantity: '' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [valueModalAttributeId, setValueModalAttributeId] = useState(null)
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState('')
  const [summaryIsFloating, setSummaryIsFloating] = useState(false)

  useEffect(() => {
    const updateSummaryEffect = () => setSummaryIsFloating(window.scrollY > 80)
    updateSummaryEffect()
    window.addEventListener('scroll', updateSummaryEffect, { passive: true })
    return () => window.removeEventListener('scroll', updateSummaryEffect)
  }, [])

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const variantCombinations = useMemo(
    () => combinations(attributes).filter((values) => !removedVariants.includes(values.join(' / '))),
    [attributes, removedVariants],
  )
  const variantNames = variantCombinations.map((values) => values.join(' / '))
  const defaultSku = sellerService.previewSellerProductSku(currentUser, form).data?.skuCode || 'SKU sẽ hiển thị khi có tên và danh mục'
  const previewPayload = variantCombinations.map((values, index) => ({
    variantName: values.join(' / '),
    option1Name: attributes[0]?.name || '',
    option1Value: values[0] || '',
    option2Name: attributes[1]?.name || '',
    option2Value: values[1] || '',
    price: Number(variantData[values.join(' / ')]?.price ?? form.price),
    originalPrice: Number(variantData[values.join(' / ')]?.originalPrice ?? form.originalPrice),
    stockQuantity: Number(variantData[values.join(' / ')]?.stockQuantity ?? form.stockQuantity),
    status: variantData[values.join(' / ')]?.hidden ? 'HIDDEN' : 'ACTIVE',
    imageUrl: values.map((value, index) => variantImages[`${attributes[index]?.id}:${value}`]).find(Boolean) || images[0] || '',
    isDefault: index === 0,
  }))
  const previewSkus = sellerService.previewSellerProductVariantSkus(currentUser, { ...form, skus: previewPayload }).data || []
  const rows = previewPayload.map((row, index) => ({ ...row, skuId: previewSkus[index]?.skuId, skuCode: previewSkus[index]?.skuCode || defaultSku }))
  const filteredRows = rows.filter((row) => {
    const keyword = search.trim().toLocaleLowerCase('vi')
    const status = row.status === 'HIDDEN' ? 'HIDDEN' : row.stockQuantity === 0 ? 'OUT_OF_STOCK' : 'ACTIVE'
    return (!keyword || `${row.variantName} ${row.skuCode}`.toLocaleLowerCase('vi').includes(keyword))
      && (statusFilter === 'ALL' || statusFilter === status)
  })
  const summaryRows = hasVariants ? rows : [{ skuCode: defaultSku, price: Number(form.price), stockQuantity: Number(form.stockQuantity) }]
  const prices = summaryRows.map((row) => Number(row.price) || 0)

  const updateVariant = (variantName, field, value) => {
    setVariantData((current) => ({ ...current, [variantName]: { ...current[variantName], [field]: value } }))
  }

  const addAttribute = () => {
    if (attributes.length >= 4) return setError('Chỉ được tạo tối đa 4 thuộc tính biến thể.')
    setAttributes((current) => [...current, { id: `attribute-${Date.now()}`, name: `Thuộc tính ${current.length + 1}`, values: ['Mặc định'] }])
  }

  const confirmValue = () => {
    const value = newValue.trim()
    const attribute = attributes.find((item) => item.id === valueModalAttributeId)
    if (!value) return setError('Vui lòng nhập giá trị biến thể.')
    if (attribute?.values.some((item) => item.toLocaleLowerCase('vi') === value.toLocaleLowerCase('vi'))) return setError('Giá trị biến thể đã tồn tại.')
    setAttributes((current) => current.map((item) => item.id === valueModalAttributeId ? { ...item, values: [...item.values, value] } : item))
    setValueModalAttributeId(null)
    setNewValue('')
    setError('')
  }

  const addImages = (event) => {
    const files = [...(event.target.files || [])].slice(0, 9 - images.length)
    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.readAsDataURL(file)
    }))).then((loaded) => setImages((current) => [...current, ...loaded]))
    event.target.value = ''
  }

  const addVariantImage = (attributeId, value, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setVariantImages((current) => ({ ...current, [`${attributeId}:${value}`]: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  const applyBulk = () => {
    if (bulk.price === '' && bulk.originalPrice === '' && bulk.stockQuantity === '') return setError('Hãy nhập ít nhất một giá trị áp dụng chung.')
    setVariantData((current) => {
      const next = { ...current }
      variantNames.forEach((variantName) => {
        next[variantName] = {
          ...next[variantName],
          ...(bulk.price !== '' ? { price: bulk.price } : {}),
          ...(bulk.originalPrice !== '' ? { originalPrice: bulk.originalPrice } : {}),
          ...(bulk.stockQuantity !== '' ? { stockQuantity: bulk.stockQuantity } : {}),
        }
      })
      return next
    })
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.category) return setError('Vui lòng nhập tên và danh mục sản phẩm.')
    if (hasVariants && !rows.length) return setError('Sản phẩm cần có ít nhất một SKU.')
    const payload = hasVariants
      ? {
          ...form,
          imageUrl: images[0] || '/images/products/headphones.png',
          attributes,
          variantImages,
          price: Math.min(...rows.map((row) => row.price)),
          originalPrice: Math.min(...rows.map((row) => row.originalPrice)),
          stockQuantity: rows.reduce((total, row) => total + row.stockQuantity, 0),
          variants: rows,
          skus: rows,
        }
      : { ...form, imageUrl: images[0] || '/images/products/headphones.png' }
    const response = await Promise.resolve(sellerService.createSellerProduct(currentUser, payload))
    if (!response.success) return setError(response.message || 'Không thể lưu sản phẩm.')
    navigate('/seller/products', { replace: true })
  }

  return (
    <section className="min-h-screen bg-[#f7f5f4] px-4 py-5 text-sm text-[#1b1c1c] sm:px-6 sm:py-6 lg:px-7">
      <form onSubmit={submit} className="mx-auto max-w-[1680px]">
        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm text-[#5b403b]">Sản phẩm &nbsp;/&nbsp; <span className="font-semibold text-[#1b1c1c]">Thêm mới</span></p><h1 className="mt-1 text-[32px] font-bold leading-tight">Thêm sản phẩm mới</h1></div>
          <div className="flex flex-wrap items-center justify-end gap-4"><Link to="/seller/products" className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e3beb6] px-4 text-sm font-semibold text-[#b42318]">Sản phẩm đã lưu</Link><Link to="/seller/products" className="inline-flex h-10 items-center justify-center px-3 text-sm font-semibold text-[#b42318]">Hủy</Link><button className="inline-flex h-10 items-center justify-center rounded-lg bg-[#b42318] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(180,35,24,0.18)]" type="submit">Lưu sản phẩm</button></div>
        </header>

        {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[#b42318]">{error}</div> : null}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-9">
            <section className="rounded-xl border border-[#e3beb6] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-bold">Thông tin cơ bản</h2>
              <div className="space-y-5">
                <Field label="Tên sản phẩm" required><input value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm outline-none focus:border-[#ee4d2d]" /></Field>
                <Field label="Danh mục sản phẩm" required><select value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm">{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
                <Field label="Mô tả chi tiết"><textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="h-28 w-full resize-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] p-4 text-sm leading-6 outline-none focus:border-[#ee4d2d]" placeholder="Nhập mô tả chi tiết sản phẩm..." /></Field>
                <div><p className="mb-2 text-sm font-semibold">Hình ảnh sản phẩm <span className="text-[#b42318]">*</span></p><input id="variant-product-images" type="file" accept="image/*" multiple onChange={addImages} className="hidden" /><div className="grid max-w-[700px] grid-cols-2 gap-2 sm:grid-cols-4">{images.map((image, index) => <div key={`${image.slice(0, 24)}-${index}`} className={`relative aspect-square overflow-hidden rounded-lg border-2 ${index === 0 ? 'border-[#ee4d2d]' : 'border-[#e3beb6]'}`}><img src={image} alt={`Ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-black/65 py-1.5 text-[10px] text-white">{index === 0 ? <span>Ảnh chính</span> : <button type="button" onClick={() => { const next = [...images]; const [selected] = next.splice(index, 1); next.unshift(selected); setImages(next) }}>Đặt làm chính</button>}<button type="button" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}>Xóa</button></div></div>)}{images.length < 9 ? <label htmlFor="variant-product-images" className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed border-[#e3beb6] text-[#5b403b] hover:border-[#ee4d2d] hover:text-[#ee4d2d]"><span className="flex flex-col items-center gap-2"><SellerIcon name="add_photo_alternate" className="text-[24px]" /><span className="text-xs">Thêm ảnh</span></span></label> : null}</div><p className="mt-2 text-xs text-[#5b403b]">Tải lên tối đa 9 hình ảnh. Kích thước khuyến nghị: 800×800px.</p></div>
              </div>
            </section>

            <section className="rounded-xl border border-[#e3beb6] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">2. Bán hàng & Kho</h2><p className="mt-1 text-sm text-[#5b403b]">{hasVariants ? 'Mỗi tổ hợp biến thể sẽ có một SKU riêng.' : 'Sản phẩm sử dụng một SKU mặc định.'}</p></div><label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e3beb6] bg-[#fff7f5] px-4 py-3"><span className="text-sm font-semibold">Sản phẩm có biến thể</span><input type="checkbox" checked={hasVariants} onChange={(event) => setHasVariants(event.target.checked)} className="peer sr-only" /><span className="relative h-6 w-11 rounded-full bg-[#c7b7b2] transition peer-checked:bg-[#ee4d2d] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" /><span className="text-xs font-bold text-[#ee4d2d]">{hasVariants ? 'Bật' : 'Tắt'}</span></label></div>
              {!hasVariants ? <div className="mt-6 grid gap-4 rounded-lg border border-[#e3beb6] bg-[#fbf9f9] p-5 md:grid-cols-2"><div className="md:col-span-2"><Field label="Mã SKU tự động"><input readOnly value={defaultSku} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#efeded] px-4 text-sm font-semibold text-[#5b403b]" /></Field></div><Field label="Giá bán"><input type="number" min="0" value={form.price} onChange={(event) => updateForm('price', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right font-normal" /></Field><Field label="Giá gốc"><input type="number" min="0" value={form.originalPrice} onChange={(event) => updateForm('originalPrice', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right font-normal" /></Field><Field label="Số lượng tồn kho"><input type="number" min="0" value={form.stockQuantity} onChange={(event) => updateForm('stockQuantity', event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right font-normal" /></Field></div> : null}
            </section>

            {hasVariants ? <section className="rounded-xl border border-[#e3beb6] bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">3. Cấu hình biến thể</h2><p className="mt-1 text-xs text-[#5b403b]">Tối đa 4 thuộc tính. Mỗi giá trị đều có thể có ảnh đại diện riêng.</p></div><button type="button" onClick={addAttribute} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#b42318] px-4 text-sm font-semibold text-[#b42318]"><SellerIcon name="add" className="text-[18px]" />Thêm thuộc tính</button></div><div className="overflow-hidden rounded-lg border border-[#e3beb6] bg-[#fbf9f9]">{attributes.map((attribute, attributeIndex) => <div key={attribute.id} className={`grid gap-4 p-4 md:grid-cols-[160px_minmax(0,1fr)_40px] ${attributeIndex < attributes.length - 1 ? 'border-b border-[#e3beb6]' : ''}`}><Field compact label={`Tên thuộc tính ${attributeIndex + 1}`}><input value={attribute.name} onChange={(event) => setAttributes((current) => current.map((item) => item.id === attribute.id ? { ...item, name: event.target.value } : item))} className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-sm font-semibold text-[#1b1c1c]" /></Field><div><p className="mb-2 text-xs font-semibold text-[#5b403b]">Giá trị thuộc tính <span className="font-normal text-[#8f7069]">· có thể thêm ảnh</span></p><div className="flex min-h-10 flex-wrap items-center gap-2">{attribute.values.map((value) => { const imageKey = `${attribute.id}:${value}`; return <span key={value} className="inline-flex items-center gap-1 rounded-full border border-[#e3beb6] bg-white py-1.5 pl-2 pr-2 text-sm"><label className="grid h-7 w-7 cursor-pointer place-items-center overflow-hidden rounded-full border border-[#e3beb6] bg-[#fff7f5] text-[#b42318]" title={`Thêm ảnh cho ${value}`}>{variantImages[imageKey] ? <img src={variantImages[imageKey]} alt={`Biến thể ${value}`} className="h-full w-full object-cover" /> : <SellerIcon name="add_photo_alternate" className="text-[15px]" />}<input type="file" accept="image/*" className="hidden" onChange={(event) => { addVariantImage(attribute.id, value, event.target.files?.[0]); event.target.value = '' }} /></label><span className="px-1">{value}</span><button type="button" onClick={() => attribute.values.length > 1 && setAttributes((current) => current.map((item) => item.id === attribute.id ? { ...item, values: item.values.filter((entry) => entry !== value) } : item))} aria-label={`Xóa ${value}`}><SellerIcon name="close" className="text-[14px]" /></button></span> })}<button type="button" onClick={() => { setValueModalAttributeId(attribute.id); setNewValue(''); setError('') }} className="rounded-full border border-dashed border-[#ee4d2d] px-3 py-2 text-sm font-medium text-[#ee4d2d]">+ Thêm giá trị</button></div><p className="mt-2 text-xs text-[#8f7069]">Nếu một SKU có nhiều ảnh biến thể, hệ thống ưu tiên ảnh của thuộc tính nằm trên.</p></div><button type="button" disabled={attributes.length === 1} onClick={() => setAttributes((current) => current.filter((item) => item.id !== attribute.id))} className="mt-6 grid h-9 w-9 place-items-center rounded-lg text-[#5b403b] hover:bg-red-50 hover:text-[#b42318] disabled:opacity-30" aria-label={`Xóa thuộc tính ${attribute.name}`}><SellerIcon name="delete" className="text-[18px]" /></button></div>)}</div></section> : null}
          </div>

          <aside className="lg:sticky lg:top-6 lg:col-span-3 lg:self-start">
            <section
              aria-live="polite"
              className={`z-20 w-full overflow-hidden rounded-xl border bg-white transition-[box-shadow,border-color] duration-300 ease-out ${
                summaryIsFloating
                  ? 'border-[#d99a8d] shadow-xl'
                  : 'border-[#e3beb6] shadow-lg'
              }`}
            >
              <div className="h-1 bg-[#b42318]" />
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <SellerIcon name="trending_up" className="text-[20px] text-[#b42318]" />
                  <h2 className="text-lg font-bold">Tóm tắt thiết lập</h2>
                </div>

                <dl className="mt-4 divide-y divide-[#eee5e2] text-sm">
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-[#5b403b]">Số biến thể:</dt>
                    <dd className="font-bold">{summaryRows.length}</dd>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-[#5b403b]">Tổng tồn kho:</dt>
                    <dd className="font-bold text-[#ee4d2d]">
                      {summaryRows.reduce((total, row) => total + (Number(row.stockQuantity) || 0), 0)}
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-[#5b403b]">Khoảng giá:</dt>
                    <dd className="mt-2 text-right font-bold">
                      {prices.length
                        ? `${money(Math.min(...prices))}${prices.length > 1 ? ` - ${money(Math.max(...prices))}` : ''}`
                        : '—'}
                    </dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-[#5b403b]">SKU đầu tiên:</dt>
                    <dd className="mt-2 break-all text-right font-mono text-[11px] font-semibold leading-5">
                      {summaryRows[0]?.skuCode || '—'}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 flex items-start gap-2 border-t border-[#e3beb6] pt-4 text-xs leading-5 text-[#5b403b]">
                  <SellerIcon name="info" className="mt-0.5 shrink-0 text-[16px] text-[#b42318]" />
                  <span>
                    {hasVariants
                      ? `Mỗi tổ hợp ${attributes.map((item) => item.name).join(' / ')} được tạo một SKU riêng.`
                      : 'Sản phẩm không có biến thể chỉ sử dụng một SKU mặc định.'}
                  </span>
                </p>
              </div>
            </section>
          </aside>
        </div>

        {hasVariants ? <section className="mt-5 overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#e3beb6] px-6 py-5"><div><h2 className="text-lg font-bold">4. Bảng SKU theo biến thể</h2><p className="mt-1 text-xs text-[#5b403b]">{rows.length} tổ hợp được tạo tự động từ {attributes.length} thuộc tính.</p></div><span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Không phát hiện SKU trùng</span></div><div className="grid gap-3 border-b border-[#e3beb6] bg-[#fff7f5] px-6 py-4 md:grid-cols-[1fr_1fr_160px_auto]"><Field label="Giá bán áp dụng chung"><input type="number" min="0" value={bulk.price} onChange={(event) => setBulk((current) => ({ ...current, price: event.target.value }))} className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right text-sm" /></Field><Field label="Giá gốc áp dụng chung"><input type="number" min="0" value={bulk.originalPrice} onChange={(event) => setBulk((current) => ({ ...current, originalPrice: event.target.value }))} className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right text-sm" /></Field><Field label="Tồn kho"><input type="number" min="0" value={bulk.stockQuantity} onChange={(event) => setBulk((current) => ({ ...current, stockQuantity: event.target.value }))} className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white px-3 text-right text-sm" /></Field><button type="button" onClick={applyBulk} className="mt-7 h-10 rounded-lg bg-[#b42318] px-5 text-sm font-semibold text-white">Áp dụng cho tất cả</button></div><div className="flex flex-wrap gap-3 border-b border-[#e3beb6] px-6 py-4"><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 min-w-[260px] flex-1 rounded-lg border border-[#e3beb6] px-3 text-sm" placeholder="Tìm theo biến thể hoặc mã SKU" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-[#e3beb6] px-3 text-sm"><option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang bán</option><option value="OUT_OF_STOCK">Hết hàng</option><option value="HIDDEN">Đã ẩn</option></select><button type="button" onClick={() => { setSearch(''); setStatusFilter('ALL') }} className="h-10 rounded-lg border border-[#e3beb6] px-4 text-sm font-semibold text-[#5b403b]">Xóa bộ lọc</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1400px] table-fixed text-left text-sm"><colgroup><col className="w-[300px]" /><col /><col className="w-[150px]" /><col className="w-[150px]" /><col className="w-[110px]" /><col className="w-[120px]" /><col className="w-[120px]" /></colgroup><thead className="bg-[#fbf9f9] text-xs text-[#5b403b]"><tr><th className="px-5 py-3">Biến thể</th><th className="px-5 py-3">Mã SKU tự động</th><th className="px-5 py-3 text-right">Giá bán</th><th className="px-5 py-3 text-right">Giá gốc</th><th className="px-5 py-3 text-right">Tồn kho</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-center">Thao tác</th></tr></thead><tbody className="divide-y divide-[#eee5e2]">{filteredRows.map((row) => <tr key={row.variantName}><td className="px-5 py-4"><div className="flex min-w-0 items-center gap-3"><img src={row.imageUrl || images[0]} alt="" className="h-9 w-9 shrink-0 rounded-md border border-[#e3beb6] object-cover" /><span className="truncate font-semibold" title={row.variantName}>{row.variantName}</span></div></td><td className="px-5 py-4"><span className="block truncate font-mono text-xs" title={row.skuCode}>{row.skuCode}</span></td><td className="px-5 py-4"><input type="number" min="0" value={variantData[row.variantName]?.price ?? form.price} onChange={(event) => updateVariant(row.variantName, 'price', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td><td className="px-5 py-4"><input type="number" min="0" value={variantData[row.variantName]?.originalPrice ?? form.originalPrice} onChange={(event) => updateVariant(row.variantName, 'originalPrice', event.target.value)} className="h-9 w-28 rounded border border-[#e3beb6] px-2 text-right" /></td><td className="px-5 py-4"><input type="number" min="0" value={variantData[row.variantName]?.stockQuantity ?? form.stockQuantity} onChange={(event) => updateVariant(row.variantName, 'stockQuantity', event.target.value)} className="h-9 w-20 rounded border border-[#e3beb6] px-2 text-right" /></td><td className="whitespace-nowrap px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'HIDDEN' ? 'bg-slate-100 text-slate-600' : row.stockQuantity === 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>{row.status === 'HIDDEN' ? 'Đã ẩn' : row.stockQuantity === 0 ? 'Hết hàng' : 'Đang bán'}</span></td><td className="whitespace-nowrap px-5 py-4 text-center"><button type="button" onClick={() => updateVariant(row.variantName, 'hidden', !variantData[row.variantName]?.hidden)} className="font-semibold text-[#5b403b]">{row.status === 'HIDDEN' ? 'Hiện' : 'Ẩn'}</button><span className="px-2 text-[#e3beb6]">·</span><button type="button" onClick={() => setRemovedVariants((current) => [...current, row.variantName])} className="font-semibold text-[#b42318]">Xóa</button></td></tr>)}</tbody></table></div><div className="border-t border-[#e3beb6] px-6 py-4 text-xs text-[#5b403b]">Đang hiển thị {filteredRows.length}/{rows.length} tổ hợp.</div></section> : null}
      </form>

      {valueModalAttributeId ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-5" onMouseDown={(event) => event.target === event.currentTarget && setValueModalAttributeId(null)}><section className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-2xl"><div className="h-1 bg-[#b42318]" /><div className="p-6"><div className="flex justify-between"><div><h2 className="text-xl font-bold">Thêm giá trị biến thể</h2><p className="mt-1 text-sm text-[#5b403b]">Nhập giá trị mới cho thuộc tính.</p></div><button type="button" onClick={() => setValueModalAttributeId(null)} aria-label="Đóng"><SellerIcon name="close" className="text-[20px]" /></button></div><Field label="Giá trị mới" required><input autoFocus value={newValue} onChange={(event) => setNewValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); confirmValue() } }} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-3 outline-none focus:border-[#ee4d2d]" placeholder="Ví dụ: Xanh navy" /></Field><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setValueModalAttributeId(null)} className="h-10 rounded-lg border border-[#e3beb6] px-5 text-sm font-semibold text-[#b42318]">Hủy</button><button type="button" onClick={confirmValue} className="h-10 rounded-lg bg-[#b42318] px-5 text-sm font-semibold text-white">Thêm giá trị</button></div></div></section></div> : null}
    </section>
  )
}
