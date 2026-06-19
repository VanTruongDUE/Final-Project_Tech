import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const initialForm = {
  name: '',
  code: 'SALE15',
  startAt: '',
  endAt: '',
  discountType: 'percentage',
  discountValue: 15,
  maxDiscount: '',
  minOrderValue: 0,
  scope: 'all',
  totalUsageLimit: 100,
  perUserLimit: 1,
}

function FormSection({ icon, title, children }) {
  return (
    <section className="rounded-xl border border-[#e3beb6]/60 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-[#e3beb6]/60 pb-4">
        <SellerIcon name={icon} className="text-[24px] text-[#b22204]" />
        <h2 className="text-xl font-bold text-[#1b1c1c]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[#5b403b]">
      {children}
    </label>
  )
}

function TextInput({ id, value, onChange, placeholder, type = 'text', rightLabel }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15 ${rightLabel ? 'pr-12 text-right' : ''}`}
      />
      {rightLabel ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5b403b]">{rightLabel}</span> : null}
    </div>
  )
}

export default function SellerPromotionCreatePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const previewDiscount = useMemo(() => {
    if (form.discountType === 'fixed') {
      return `Giảm ${formatCurrency(Number(form.discountValue) || 0)}`
    }

    return `Giảm ${Number(form.discountValue) || 0}%`
  }, [form.discountType, form.discountValue])

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setMessage('')
  }

  const randomizeCode = () => {
    const code = `SALE${Math.floor(10 + Math.random() * 89)}`
    updateField('code', code)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const response = sellerService.createSellerPromotion(currentUser, form)

    if (!response.success) {
      setMessage(response.message || 'Không thể tạo khuyến mãi.')
      return
    }

    setMessage(response.message)
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9] p-4 md:p-6">
      <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <header className="flex items-center gap-3 border-b border-[#e3beb6] pb-4">
            <button type="button" onClick={() => navigate('/seller/dashboard')} className="grid h-10 w-10 place-items-center rounded-full text-[#5b403b] transition hover:bg-[#efeded] hover:text-[#b22204]" aria-label="Quay lại">
              <SellerIcon name="arrow_back" className="text-[24px]" />
            </button>
            <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1b1c1c] md:text-[40px]">Tạo khuyến mãi mới</h1>
          </header>

          <FormSection icon="info" title="Thông tin cơ bản">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldLabel htmlFor="promoName">Tên chương trình *</FieldLabel>
                <TextInput id="promoName" value={form.name} onChange={(value) => updateField('name', value)} placeholder="Ví dụ: Siêu Sale Giữa Tháng" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel htmlFor="promoCode">Mã giảm giá *</FieldLabel>
                <div className="relative">
                  <TextInput id="promoCode" value={form.code} onChange={(value) => updateField('code', value.toUpperCase())} placeholder="SALE15" />
                  <button type="button" onClick={randomizeCode} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-3 py-1.5 text-xs font-bold text-[#b22204] transition hover:bg-[#fff1ec]">
                    Tạo ngẫu nhiên
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="startAt">Thời gian bắt đầu *</FieldLabel>
                <TextInput id="startAt" type="datetime-local" value={form.startAt} onChange={(value) => updateField('startAt', value)} />
              </div>
              <div>
                <FieldLabel htmlFor="endAt">Thời gian kết thúc *</FieldLabel>
                <TextInput id="endAt" type="datetime-local" value={form.endAt} onChange={(value) => updateField('endAt', value)} />
              </div>
            </div>
          </FormSection>

          <FormSection icon="sell" title="Thiết lập giảm giá">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#5b403b]">Loại giảm giá *</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'percentage', label: 'Theo phần trăm (%)' },
                    { value: 'fixed', label: 'Số tiền cố định (đ)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('discountType', option.value)}
                      className={`h-11 rounded-lg border text-sm font-bold transition ${form.discountType === option.value ? 'border-[#ee4d2d] bg-[#ee4d2d]/5 text-[#ee4d2d]' : 'border-[#e3beb6] bg-white text-[#5b403b] hover:bg-[#fbf9f9]'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="discountValue">Mức giảm *</FieldLabel>
                  <TextInput id="discountValue" type="number" value={form.discountValue} onChange={(value) => updateField('discountValue', value)} rightLabel={form.discountType === 'percentage' ? '%' : 'đ'} />
                </div>
                <div>
                  <FieldLabel htmlFor="maxDiscount">Mức giảm tối đa</FieldLabel>
                  <TextInput id="maxDiscount" type="number" value={form.maxDiscount} onChange={(value) => updateField('maxDiscount', value)} placeholder="Không giới hạn" rightLabel="đ" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu *</FieldLabel>
                  <TextInput id="minOrderValue" type="number" value={form.minOrderValue} onChange={(value) => updateField('minOrderValue', value)} rightLabel="đ" />
                </div>
              </div>
            </div>
          </FormSection>

          <div className="grid gap-6 md:grid-cols-2">
            <FormSection icon="category" title="Phạm vi áp dụng">
              <div className="space-y-3">
                {[
                  { value: 'all', label: 'Toàn cửa hàng' },
                  { value: 'specific', label: 'Chọn sản phẩm cụ thể' },
                ].map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#1b1c1c]">
                    <input type="radio" name="scope" checked={form.scope === option.value} onChange={() => updateField('scope', option.value)} className="text-[#ee4d2d]" />
                    {option.label}
                  </label>
                ))}
                <div className={`mt-4 grid min-h-24 place-items-center rounded-lg border border-dashed border-[#e3beb6] text-center text-sm text-[#8f7069] ${form.scope === 'specific' ? 'bg-[#fff8f6]' : 'opacity-50'}`}>
                  <div>
                    <SellerIcon name="add_circle" className="mx-auto text-[28px]" />
                    <p className="mt-2">Chọn sản phẩm (0 đã chọn)</p>
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection icon="group" title="Giới hạn lượt dùng">
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="totalUsageLimit">Tổng lượt dùng tối đa *</FieldLabel>
                  <TextInput id="totalUsageLimit" type="number" value={form.totalUsageLimit} onChange={(value) => updateField('totalUsageLimit', value)} />
                </div>
                <div>
                  <FieldLabel htmlFor="perUserLimit">Lượt dùng tối đa mỗi khách hàng *</FieldLabel>
                  <TextInput id="perUserLimit" type="number" value={form.perUserLimit} onChange={(value) => updateField('perUserLimit', value)} />
                </div>
              </div>
            </FormSection>
          </div>
        </div>

        <aside className="min-w-0 lg:pt-[90px]">
          <div className="sticky top-6 flex flex-col gap-5">
            <h2 className="text-xl font-bold text-[#5b403b]">Xem trước hiển thị</h2>
            <div className="relative overflow-hidden rounded-xl border border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffdad3] blur-2xl" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-[#ee4d2d] text-2xl font-bold text-white">%</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#5b403b]">Mã giảm giá</p>
                  <h3 className="mt-1 text-xl font-bold text-[#ee4d2d]">{previewDiscount}</h3>
                </div>
              </div>
              <div className="relative z-10 mt-5 space-y-2 border-t border-dashed border-[#e3beb6] pt-4 text-sm text-[#5b403b]">
                <p className="font-bold text-[#1b1c1c]">
                  Mã: <span className="rounded border border-[#ee4d2d]/20 bg-[#f5f3f3] px-2 py-0.5 text-[#b22204]">{form.code || 'SALE15'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <SellerIcon name="shopping_bag" className="text-[17px]" />
                  Đơn tối thiểu {formatCurrency(Number(form.minOrderValue) || 0)}
                </p>
                <p className="flex items-center gap-2">
                  <SellerIcon name="schedule" className="text-[17px]" />
                  HSD: {form.endAt ? new Date(form.endAt).toLocaleDateString('vi-VN') : 'Chưa thiết lập'}
                </p>
              </div>
            </div>

            {message ? (
              <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${message.includes('Vui lòng') || message.includes('Không') ? 'border-[#ffdad6] bg-[#ffdad6]/40 text-[#ba1a1a]' : 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#15803D]'}`}>
                {message}
              </div>
            ) : null}

            <div className="rounded-xl border border-[#e3beb6]/60 bg-white p-4 shadow-sm">
              <button type="submit" className="h-11 w-full rounded-lg bg-[#ee4d2d] text-sm font-bold text-white shadow-sm transition hover:bg-[#d73211]">
                Lưu & Kích hoạt
              </button>
              <button type="button" onClick={() => navigate('/seller/dashboard')} className="mt-3 h-11 w-full rounded-lg border border-[#e3beb6] text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]">
                Hủy
              </button>
            </div>
          </div>
        </aside>
      </form>
    </section>
  )
}
