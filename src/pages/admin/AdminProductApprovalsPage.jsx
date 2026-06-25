import { useEffect, useMemo, useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'

const ITEMS_PER_PAGE = 5

const initialProducts = [
  {
    id: 'APR-PRD-001',
    name: 'Tai nghe Bluetooth TechZone Pro',
    sku: 'TTS-AUDIO-TECHZONE-PRO-STD-001',
    category: 'Thiết bị âm thanh',
    storeName: 'TechToShop',
    seller: 'seller@techtonic.vn',
    price: 1590000,
    originalPrice: 1890000,
    stock: 120,
    submittedAt: '2026-06-24T09:20:00',
    status: 'PENDING',
    imageUrl: '/images/products/headphones.png',
    description: 'Tai nghe không dây chống ồn chủ động, pin 36 giờ, hỗ trợ sạc nhanh và bảo hành chính hãng 12 tháng.',
    moderationNote: 'Cần kiểm tra tính nhất quán giữa ảnh, SKU và thông tin bảo hành trước khi public.',
    variants: [
      { id: 'VAR-001-A', name: 'Đen / Tiêu chuẩn', sku: 'TTS-AUDIO-TECHZONE-PRO-BLK-001', price: 1590000, originalPrice: 1890000, stock: 54, imageUrl: '/images/products/headphones.png', status: 'Chờ duyệt' },
      { id: 'VAR-001-B', name: 'Trắng / Tiêu chuẩn', sku: 'TTS-AUDIO-TECHZONE-PRO-WHT-002', price: 1590000, originalPrice: 1890000, stock: 38, imageUrl: '/images/products/headphones.png', status: 'Chờ duyệt' },
      { id: 'VAR-001-C', name: 'Đen / Kèm hộp sạc nhanh', sku: 'TTS-AUDIO-TECHZONE-PRO-BLK-FAST-003', price: 1790000, originalPrice: 2090000, stock: 28, imageUrl: '/images/products/headphones.png', status: 'Chờ duyệt' },
    ],
  },
  {
    id: 'APR-PRD-002',
    name: 'Nồi chiên không dầu SmartCook 6L',
    sku: 'HLS-HOME-SMARTCOOK-6L-STD-014',
    category: 'Gia dụng',
    storeName: 'Home Living Plus',
    seller: 'SHP-9005',
    price: 2190000,
    originalPrice: 2490000,
    stock: 48,
    submittedAt: '2026-06-24T08:05:00',
    status: 'PENDING',
    imageUrl: '/images/products/air-fryer.png',
    description: 'Nồi chiên dung tích lớn, 8 chế độ nấu, lòng nồi phủ chống dính và bảng điều khiển cảm ứng.',
    moderationNote: 'Ảnh sản phẩm rõ, cần đối chiếu chứng nhận an toàn điện.',
    variants: [
      { id: 'VAR-002-A', name: 'Đen / 6L', sku: 'HLS-HOME-SMARTCOOK-6L-BLK-014', price: 2190000, originalPrice: 2490000, stock: 20, imageUrl: '/images/products/air-fryer.png', status: 'Chờ duyệt' },
      { id: 'VAR-002-B', name: 'Trắng / 6L', sku: 'HLS-HOME-SMARTCOOK-6L-WHT-015', price: 2290000, originalPrice: 2590000, stock: 16, imageUrl: '/images/products/air-fryer.png', status: 'Chờ duyệt' },
      { id: 'VAR-002-C', name: 'Đen / 6L + khay nướng', sku: 'HLS-HOME-SMARTCOOK-6L-SET-016', price: 2490000, originalPrice: 2790000, stock: 12, imageUrl: '/images/products/air-fryer.png', status: 'Chờ duyệt' },
    ],
  },
  {
    id: 'APR-PRD-003',
    name: 'Giày sneaker Urban Runner',
    sku: 'VAF-FASH-URBAN-RUNNER-WHT-021',
    category: 'Thời trang',
    storeName: 'V&A Fashion',
    seller: 'fashion.va@techtonic.vn',
    price: 790000,
    originalPrice: 990000,
    stock: 86,
    submittedAt: '2026-06-23T16:40:00',
    status: 'APPROVED',
    imageUrl: '/images/products/sneaker.png',
    description: 'Giày sneaker đế êm, phối màu trắng tối giản, phù hợp đi học, đi làm và vận động nhẹ.',
    moderationNote: 'Đã duyệt sau khi Seller bổ sung bảng size.',
    variants: [
      { id: 'VAR-003-A', name: 'Trắng / Size 39', sku: 'VAF-FASH-URBAN-RUNNER-WHT-039', price: 790000, originalPrice: 990000, stock: 24, imageUrl: '/images/products/sneaker.png', status: 'Đã duyệt' },
      { id: 'VAR-003-B', name: 'Trắng / Size 40', sku: 'VAF-FASH-URBAN-RUNNER-WHT-040', price: 790000, originalPrice: 990000, stock: 32, imageUrl: '/images/products/sneaker.png', status: 'Đã duyệt' },
      { id: 'VAR-003-C', name: 'Đen / Size 41', sku: 'VAF-FASH-URBAN-RUNNER-BLK-041', price: 820000, originalPrice: 1020000, stock: 30, imageUrl: '/images/products/sneaker.png', status: 'Đã duyệt' },
    ],
  },
  {
    id: 'APR-PRD-004',
    name: 'Serum phục hồi da Glow Lab B5',
    sku: 'BCO-BEA-GLOW-LAB-B5-STD-009',
    category: 'Mỹ phẩm',
    storeName: 'Bella Cosmetics',
    seller: 'bella@techtonic.vn',
    price: 420000,
    originalPrice: 520000,
    stock: 72,
    submittedAt: '2026-06-22T13:15:00',
    status: 'REJECTED',
    imageUrl: '/images/products/serum.png',
    description: 'Serum dưỡng ẩm, hỗ trợ phục hồi hàng rào bảo vệ da, phù hợp da khô và da nhạy cảm.',
    moderationNote: 'Từ chối vì mô tả có claim điều trị chưa có giấy tờ chứng minh.',
    variants: [
      { id: 'VAR-004-A', name: '30ml', sku: 'BCO-BEA-GLOW-LAB-B5-030ML', price: 420000, originalPrice: 520000, stock: 40, imageUrl: '/images/products/serum.png', status: 'Từ chối' },
      { id: 'VAR-004-B', name: '50ml', sku: 'BCO-BEA-GLOW-LAB-B5-050ML', price: 590000, originalPrice: 690000, stock: 32, imageUrl: '/images/products/serum.png', status: 'Từ chối' },
    ],
  },
  {
    id: 'APR-PRD-005',
    name: 'Đồng hồ thông minh WaveFit S2',
    sku: 'TZV-WEAR-WAVEFIT-S2-BLK-018',
    category: 'Điện tử',
    storeName: 'TechZone VN',
    seller: 'SHP-8820',
    price: 1290000,
    originalPrice: 1590000,
    stock: 34,
    submittedAt: '2026-06-21T10:30:00',
    status: 'PENDING',
    imageUrl: '/images/products/smart-watch.png',
    description: 'Đồng hồ thông minh màn hình AMOLED, theo dõi sức khỏe, nhận thông báo và chống nước cơ bản.',
    moderationNote: 'Cần rà soát thông số chống nước IP trước khi duyệt.',
    variants: [
      { id: 'VAR-005-A', name: 'Đen / Dây silicone', sku: 'TZV-WEAR-WAVEFIT-S2-BLK-SIL', price: 1290000, originalPrice: 1590000, stock: 18, imageUrl: '/images/products/smart-watch.png', status: 'Chờ duyệt' },
      { id: 'VAR-005-B', name: 'Bạc / Dây silicone', sku: 'TZV-WEAR-WAVEFIT-S2-SLV-SIL', price: 1350000, originalPrice: 1650000, stock: 10, imageUrl: '/images/products/smart-watch.png', status: 'Chờ duyệt' },
      { id: 'VAR-005-C', name: 'Đen / Dây thép', sku: 'TZV-WEAR-WAVEFIT-S2-BLK-MET', price: 1490000, originalPrice: 1790000, stock: 6, imageUrl: '/images/products/smart-watch.png', status: 'Chờ duyệt' },
    ],
  },
  {
    id: 'APR-PRD-006',
    name: 'Bộ bút highlight học tập Pastel Note',
    sku: 'BKS-BOOK-PASTEL-NOTE-STD-006',
    category: 'Sách',
    storeName: 'Bookie Station',
    seller: 'bookie@techtonic.vn',
    price: 89000,
    originalPrice: 120000,
    stock: 240,
    submittedAt: '2026-06-18T14:25:00',
    status: 'PENDING',
    imageUrl: '/images/products/stationery.png',
    description: 'Bộ 6 bút highlight tông pastel, mực đều màu, ít lem giấy và phù hợp ghi chú học tập.',
    moderationNote: 'Thông tin đầy đủ, ưu tiên duyệt nhanh nếu ảnh đúng sản phẩm.',
    variants: [
      { id: 'VAR-006-A', name: 'Set 6 màu pastel', sku: 'BKS-BOOK-PASTEL-NOTE-SET06', price: 89000, originalPrice: 120000, stock: 140, imageUrl: '/images/products/stationery.png', status: 'Chờ duyệt' },
      { id: 'VAR-006-B', name: 'Set 12 màu pastel', sku: 'BKS-BOOK-PASTEL-NOTE-SET12', price: 159000, originalPrice: 199000, stock: 100, imageUrl: '/images/products/stationery.png', status: 'Chờ duyệt' },
    ],
  },
]

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Từ chối' },
]
const categoryOptions = ['Thời trang', 'Điện tử', 'Gia dụng', 'Mỹ phẩm', 'Sách']
const dateOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
]
const statusMeta = {
  PENDING: { label: 'Chờ duyệt', className: 'border-amber-300 bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  APPROVED: { label: 'Đã duyệt', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Từ chối', className: 'border-red-200 bg-red-50 text-red-700', dot: 'bg-red-500' },
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

function formatDate(value) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

function isWithinRange(value, range) {
  const submitted = new Date(value)
  const current = new Date('2026-06-24T23:59:59')
  if (range === 'today') return submitted.toDateString() === current.toDateString()
  const start = new Date(current)
  start.setDate(current.getDate() - (range === '30days' ? 29 : 6))
  start.setHours(0, 0, 0, 0)
  return submitted >= start && submitted <= current
}

function getVariantStats(product) {
  const variants = product.variants || []
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0)
  const prices = variants.map((variant) => variant.price)

  return {
    count: variants.length,
    totalStock: variants.length ? totalStock : product.stock,
    minPrice: variants.length ? Math.min(...prices) : product.price,
    maxPrice: variants.length ? Math.max(...prices) : product.price,
  }
}

function getPriceRangeLabel(product) {
  const stats = getVariantStats(product)
  if (stats.minPrice === stats.maxPrice) return formatCurrency(stats.minPrice)
  return `${formatCurrency(stats.minPrice)} - ${formatCurrency(stats.maxPrice)}`
}

function StatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}><span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />{meta.label}</span>
}

function VariantStatusBadge({ status }) {
  const className = status === 'Đã duyệt'
    ? 'bg-emerald-50 text-emerald-700'
    : status === 'Từ chối'
      ? 'bg-red-50 text-red-700'
      : 'bg-amber-100 text-amber-800'

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{status}</span>
}

function KpiCard({ icon, label, value, tone }) {
  const toneClass = { primary: 'bg-[#ffdad3] text-[#8d1600]', success: 'bg-emerald-50 text-emerald-700', danger: 'bg-red-50 text-red-700', neutral: 'bg-[#f5f3f3] text-[#5b403b]' }
  return (
    <div className="rounded-xl border border-[#e3e2e2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-xs font-semibold text-[#5b403b]">{label}</p><p className={`mt-2 text-3xl font-bold ${tone === 'primary' ? 'text-[#b22204]' : 'text-[#1b1c1c]'}`}>{value}</p></div>
        <span className={`grid h-11 w-11 place-items-center rounded-full ${toneClass[tone]}`}><AdminIcon name={icon} className="text-[22px]" /></span>
      </div>
    </div>
  )
}

function ProductDetailPanel({ product, rejectReason, rejectMode, onApprove, onClose, onRejectMode, onRejectReasonChange, onRejectConfirm }) {
  if (!product) return null
  const variantStats = getVariantStats(product)

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#1b1c1c]/45 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside role="dialog" aria-modal="true" className="flex h-full w-full max-w-[760px] flex-col bg-white shadow-2xl">
        <header className="border-b border-[#e3e2e2] p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-[#b22204]">Chi tiết kiểm duyệt</p><h2 className="mt-1 text-xl font-bold text-[#1b1c1c]">Chi tiết sản phẩm chờ duyệt</h2></div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-[#5b403b] hover:bg-[#f5f3f3]" aria-label="Đóng"><AdminIcon name="close" className="text-[20px]" /></button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="aspect-square overflow-hidden rounded-xl border border-[#e3e2e2] bg-[#fbf9f9]"><img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-6" /></div>
            <div>
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold leading-7 text-[#1b1c1c]">{product.name}</h3><p className="mt-1 font-mono text-xs text-[#8f7069]">{product.sku}</p></div><StatusBadge status={product.status} /></div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Danh mục</dt><dd className="mt-1 font-semibold text-[#1b1c1c]">{product.category}</dd></div>
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Số biến thể</dt><dd className="mt-1 font-semibold text-[#1b1c1c]">{variantStats.count} SKU</dd></div>
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Giá bán</dt><dd className="mt-1 font-semibold text-[#b22204]">{getPriceRangeLabel(product)}</dd></div>
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Tổng tồn kho</dt><dd className="mt-1 font-semibold text-[#1b1c1c]">{variantStats.totalStock}</dd></div>
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Tên cửa hàng</dt><dd className="mt-1 font-semibold text-[#1b1c1c]">{product.storeName}</dd></div>
                <div className="rounded-lg bg-[#fbf9f9] p-3"><dt className="text-xs text-[#8f7069]">Người bán</dt><dd className="mt-1 font-semibold text-[#1b1c1c]">{product.seller}</dd></div>
              </dl>
            </div>
          </div>

          <section className="mt-5 overflow-hidden rounded-xl border border-[#e3e2e2] bg-white">
            <div className="flex items-center justify-between border-b border-[#e3e2e2] bg-[#fbf9f9] px-4 py-3">
              <div><h4 className="font-semibold text-[#1b1c1c]">Biến thể và SKU</h4><p className="mt-0.5 text-xs text-[#8f7069]">Admin kiểm tra từng biến thể trước khi duyệt sản phẩm.</p></div>
              <span className="rounded-full bg-[#ffdad3] px-3 py-1 text-xs font-semibold text-[#8d1600]">{variantStats.count} biến thể</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#e9e8e7] text-xs font-semibold uppercase text-[#5b403b]"><tr><th className="px-4 py-3">Biến thể</th><th className="px-4 py-3">Mã SKU</th><th className="px-4 py-3 text-right">Giá bán</th><th className="px-4 py-3 text-right">Giá gốc</th><th className="px-4 py-3 text-right">Tồn kho</th><th className="px-4 py-3 text-center">Trạng thái</th></tr></thead>
                <tbody className="divide-y divide-[#e3e2e2]">
                  {(product.variants || []).map((variant) => (
                    <tr key={variant.id} className="hover:bg-[#fbf9f9]"><td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><img src={variant.imageUrl} alt={variant.name} className="h-11 w-11 rounded-lg border border-[#e3e2e2] object-contain p-1" /><span className="font-semibold text-[#1b1c1c]">{variant.name}</span></div></td><td className="px-4 py-3 font-mono text-xs text-[#8f7069]">{variant.sku}</td><td className="px-4 py-3 text-right font-semibold text-[#b22204]">{formatCurrency(variant.price)}</td><td className="px-4 py-3 text-right text-[#5b403b]">{formatCurrency(variant.originalPrice)}</td><td className="px-4 py-3 text-right text-[#1b1c1c]">{variant.stock}</td><td className="px-4 py-3 text-center"><VariantStatusBadge status={variant.status} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-[#e3e2e2] bg-white p-4"><h4 className="font-semibold text-[#1b1c1c]">Mô tả sản phẩm</h4><p className="mt-2 text-sm leading-6 text-[#5b403b]">{product.description}</p></section>
          <section className="mt-4 rounded-xl border border-[#e3e2e2] bg-[#fff7f5] p-4"><h4 className="font-semibold text-[#1b1c1c]">Ghi chú kiểm duyệt</h4><p className="mt-2 text-sm leading-6 text-[#5b403b]">{product.moderationNote}</p><p className="mt-3 text-xs font-medium text-[#8f7069]">Ngày gửi duyệt: {formatDate(product.submittedAt)}</p></section>
          {rejectMode ? <section className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"><label htmlFor="reject-reason" className="text-sm font-semibold text-[#93000a]">Lý do từ chối</label><textarea id="reject-reason" value={rejectReason} onChange={(event) => onRejectReasonChange(event.target.value)} placeholder="Nhập lý do để Seller chỉnh sửa sản phẩm..." className="mt-2 min-h-28 w-full resize-none rounded-lg border border-red-200 bg-white p-3 text-sm text-[#1b1c1c] outline-none focus:border-[#ba1a1a]" /><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={onRejectMode} className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-4 text-sm font-semibold text-[#5b403b]">Hủy</button><button type="button" onClick={onRejectConfirm} className="h-10 rounded-lg bg-[#ba1a1a] px-4 text-sm font-semibold text-white hover:bg-[#93000a]">Xác nhận từ chối</button></div></section> : null}
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-[#e3e2e2] p-5"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-4 text-sm font-semibold text-[#5b403b]">Đóng</button><button type="button" onClick={onRejectMode} className="h-10 rounded-lg border border-[#ba1a1a] bg-white px-4 text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]">Từ chối</button><button type="button" onClick={() => onApprove(product.id)} className="h-10 rounded-lg bg-[#b22204] px-4 text-sm font-semibold text-white hover:bg-[#d63c1e]">Duyệt sản phẩm</button></footer>
      </aside>
    </div>
  )
}

export default function AdminProductApprovalsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [selectedIds, setSelectedIds] = useState([])
  const [page, setPage] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const summary = useMemo(() => products.reduce((result, product) => {
    result.total += 1
    if (product.status === 'PENDING') result.pending += 1
    if (product.status === 'APPROVED' && product.submittedAt.startsWith('2026-06-24')) result.approvedToday += 1
    if (product.status === 'REJECTED') result.rejected += 1
    return result
  }, { pending: 0, approvedToday: 0, rejected: 0, total: 0 }), [products])

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return products.filter((product) => {
      const variantKeywords = (product.variants || []).flatMap((variant) => [variant.name, variant.sku])
      const matchesKeyword = normalizedKeyword ? [product.name, product.sku, product.category, product.storeName, product.seller, ...variantKeywords].some((value) => value.toLowerCase().includes(normalizedKeyword)) : true
      const matchesStatus = status === 'all' ? true : product.status === status
      const matchesCategory = category === 'all' ? true : product.category === category || (category === 'Điện tử' && product.category === 'Thiết bị âm thanh')
      return matchesKeyword && matchesStatus && matchesCategory && isWithinRange(product.submittedAt, dateRange)
    })
  }, [category, dateRange, keyword, products, status])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const pageProducts = filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)
  const selectedProduct = products.find((product) => product.id === selectedProductId)
  const selectableIds = pageProducts.filter((product) => product.status === 'PENDING').map((product) => product.id)
  const allVisibleSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id))

  useEffect(() => { setPage(1); setSelectedIds([]) }, [keyword, status, category, dateRange])

  const updateProductStatus = (productIds, nextStatus) => {
    const nextVariantStatus = nextStatus === 'APPROVED' ? 'Đã duyệt' : nextStatus === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'
    setProducts((current) => current.map((product) => productIds.includes(product.id) ? { ...product, status: nextStatus, variants: product.variants.map((variant) => ({ ...variant, status: nextVariantStatus })) } : product))
    setSelectedIds((current) => current.filter((id) => !productIds.includes(id)))
  }
  const toggleSelected = (productId) => setSelectedIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  const toggleAllVisible = () => setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !selectableIds.includes(id)) : Array.from(new Set([...current, ...selectableIds])))
  const openDetail = (productId) => { setSelectedProductId(productId); setRejectMode(false); setRejectReason('') }
  const approveProduct = (productId) => { updateProductStatus([productId], 'APPROVED'); setSelectedProductId('') }
  const confirmReject = () => { if (!selectedProduct) return; updateProductStatus([selectedProduct.id], 'REJECTED'); setSelectedProductId(''); setRejectMode(false); setRejectReason('') }
  const emptyPending = filteredProducts.length === 0 && status === 'PENDING'

  return (
    <section className="flex w-full min-w-0 flex-col p-3 md:p-6">
      <header className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div><div className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#8f7069]"><span>Admin</span><AdminIcon name="chevron_right" className="text-[16px]" /><span className="text-[#b22204]">Duyệt sản phẩm</span></div><h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Duyệt sản phẩm mới</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-[#5b403b]">Kiểm tra và phê duyệt các sản phẩm do Seller đăng trước khi hiển thị trên sàn.</p></div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#e3beb6] bg-[#fff7f5] px-4 py-3 text-sm font-medium text-[#8d1600]"><AdminIcon name="visibility_off" className="text-[20px]" />Sản phẩm và toàn bộ biến thể chưa duyệt sẽ chưa được đăng bán cho Buyer.</div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4"><KpiCard icon="pending_actions" label="Chờ duyệt" value={summary.pending} tone="primary" /><KpiCard icon="task_alt" label="Đã duyệt hôm nay" value={summary.approvedToday} tone="success" /><KpiCard icon="cancel" label="Bị từ chối" value={summary.rejected} tone="danger" /><KpiCard icon="inventory_2" label="Tổng sản phẩm mới" value={summary.total} tone="neutral" /></div>

      <div className="rounded-t-xl border-b border-[#e3e2e2] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full xl:max-w-md"><AdminIcon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" /><input type="search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tên sản phẩm, SKU, biến thể, cửa hàng..." className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#b22204] focus:ring-1 focus:ring-[#b22204]" /></div>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] xl:w-44">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] xl:w-44"><option value="all">Tất cả danh mục</option>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="h-10 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] xl:w-40">{dateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          </div>
          <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => updateProductStatus(selectedIds, 'APPROVED')} disabled={!selectedIds.length} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b22204] px-4 text-sm font-semibold text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:bg-[#e3e2e2] disabled:text-[#8f7069]"><AdminIcon name="check_circle" className="text-[18px]" />Duyệt đã chọn</button><button type="button" onClick={() => updateProductStatus(selectedIds, 'REJECTED')} disabled={!selectedIds.length} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ba1a1a] bg-white px-4 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6] disabled:cursor-not-allowed disabled:border-[#e3e2e2] disabled:text-[#8f7069]"><AdminIcon name="block" className="text-[18px]" />Từ chối đã chọn</button></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-xl bg-white shadow-sm">
        <div className="overflow-x-auto"><table className="w-full min-w-[1360px] border-collapse text-left"><thead><tr className="bg-[#e9e8e7] text-xs font-semibold uppercase tracking-wide text-[#5b403b]"><th className="w-12 p-4"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Chọn tất cả sản phẩm chờ duyệt đang hiển thị" className="h-4 w-4 accent-[#b22204]" /></th><th className="p-4">Ảnh</th><th className="p-4">Thông tin sản phẩm</th><th className="p-4">Cửa hàng</th><th className="p-4 text-center">Biến thể</th><th className="p-4 text-right">Giá bán</th><th className="p-4 text-right">Tồn kho</th><th className="p-4">Ngày gửi duyệt</th><th className="p-4 text-center">Trạng thái</th><th className="p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-[#e3e2e2] text-sm">{pageProducts.length ? pageProducts.map((product) => {
            const isPending = product.status === 'PENDING'
            const variantStats = getVariantStats(product)
            return <tr key={product.id} className={`transition-colors hover:bg-[#fbf9f9] ${isPending ? 'bg-[#fffaf2]' : 'bg-white'}`}><td className="p-4"><input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelected(product.id)} disabled={!isPending} aria-label={`Chọn ${product.name}`} className="h-4 w-4 accent-[#b22204] disabled:opacity-30" /></td><td className="p-4"><div className="h-14 w-14 overflow-hidden rounded-lg border border-[#e3e2e2] bg-[#fbf9f9]"><img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-1.5" /></div></td><td className="p-4"><p className="font-semibold text-[#1b1c1c]">{product.name}</p><p className="mt-1 font-mono text-xs text-[#8f7069]">{product.sku}</p><p className="mt-1 text-xs font-medium text-[#5b403b]">{product.category}</p></td><td className="p-4"><p className="font-semibold text-[#1b1c1c]">{product.storeName}</p><p className="mt-1 text-xs text-[#8f7069]">{product.seller}</p></td><td className="p-4 text-center"><button type="button" onClick={() => openDetail(product.id)} className="rounded-full bg-[#fff3db] px-3 py-1 text-xs font-semibold text-[#8d1600] hover:bg-[#ffdad3]">{variantStats.count} SKU</button></td><td className="p-4 text-right font-semibold text-[#b22204]">{getPriceRangeLabel(product)}</td><td className="p-4 text-right text-[#1b1c1c]">{variantStats.totalStock}</td><td className="p-4 text-[#5b403b]">{formatDate(product.submittedAt)}</td><td className="p-4 text-center"><StatusBadge status={product.status} /></td><td className="p-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openDetail(product.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3e2e2] text-[#5b403b] transition hover:border-[#b22204] hover:text-[#b22204]" title="Xem" aria-label={`Xem ${product.name}`}><AdminIcon name="visibility" className="text-[18px]" /></button><button type="button" onClick={() => updateProductStatus([product.id], 'APPROVED')} disabled={!isPending} className="h-9 rounded-lg bg-[#b22204] px-3 text-xs font-semibold text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:bg-[#e3e2e2] disabled:text-[#8f7069]">Duyệt</button><button type="button" onClick={() => updateProductStatus([product.id], 'REJECTED')} disabled={!isPending} className="h-9 rounded-lg border border-[#ba1a1a] bg-white px-3 text-xs font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6] disabled:cursor-not-allowed disabled:border-[#e3e2e2] disabled:text-[#8f7069]">Từ chối</button></div></td></tr>
          }) : <tr><td colSpan={10} className="p-12 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff3db] text-[#b22204]"><AdminIcon name={emptyPending ? 'inventory_2' : 'fact_check'} className="text-[28px]" /></div><p className="mt-4 text-base font-bold text-[#1b1c1c]">{emptyPending ? 'Không có sản phẩm nào đang chờ duyệt' : 'Không có sản phẩm phù hợp'}</p><p className="mt-1 text-sm text-[#5b403b]">{emptyPending ? 'Các sản phẩm mới từ Seller sẽ xuất hiện tại đây.' : 'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.'}</p></td></tr>}</tbody></table></div>
        <div className="flex flex-col gap-3 border-t border-[#e3e2e2] p-4 text-sm text-[#5b403b] md:flex-row md:items-center md:justify-between"><span>Hiển thị {pageProducts.length ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0}-{(safePage - 1) * ITEMS_PER_PAGE + pageProducts.length} của {filteredProducts.length} sản phẩm</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} className="grid h-8 w-8 place-items-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50"><AdminIcon name="chevron_left" className="text-[18px]" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`grid h-8 w-8 place-items-center rounded border text-xs font-semibold ${pageNumber === safePage ? 'border-[#b22204] bg-[#b22204] text-white' : 'border-[#e3e2e2] text-[#1b1c1c]'}`}>{pageNumber}</button>)}<button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages} className="grid h-8 w-8 place-items-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50"><AdminIcon name="chevron_right" className="text-[18px]" /></button></div></div>
      </div>

      <ProductDetailPanel product={selectedProduct} rejectMode={rejectMode} rejectReason={rejectReason} onApprove={approveProduct} onClose={() => setSelectedProductId('')} onRejectMode={() => setRejectMode((value) => !value)} onRejectReasonChange={setRejectReason} onRejectConfirm={confirmReject} />
    </section>
  )
}
