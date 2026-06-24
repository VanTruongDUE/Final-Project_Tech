import { useEffect } from 'react'
import SellerIcon from './SellerIcon'

export default function SellerConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  icon = 'help',
  danger = false,
  error = '',
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => { if (event.key === 'Escape') onCancel() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1b1c1c]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="seller-confirm-title"
        className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-2xl"
      >
        <div className={`h-1 ${danger ? 'bg-[#ba1a1a]' : 'bg-[#b22204]'}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${danger ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ffdad3] text-[#b22204]'}`}>
              <SellerIcon name={icon} className="text-[24px]" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="seller-confirm-title" className="text-xl font-bold text-[#1b1c1c]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b403b]">{description}</p>
            </div>
            <button type="button" onClick={onCancel} aria-label="Đóng" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8f7069] hover:bg-[#f5f3f3] hover:text-[#b22204]">
              <SellerIcon name="close" className="text-[18px]" />
            </button>
          </div>

          {error ? <p className="mt-4 rounded-lg border border-[#ba1a1a]/25 bg-[#ffdad6] px-3 py-2 text-sm font-medium text-[#93000a]">{error}</p> : null}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="h-10 rounded-lg border border-[#e3beb6] px-5 text-sm font-bold text-[#5b403b] transition hover:bg-[#f5f3f3]">
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-bold text-white shadow-sm transition ${danger ? 'bg-[#ba1a1a] hover:bg-[#93000a]' : 'bg-[#b22204] hover:bg-[#d63c1e]'}`}
            >
              <SellerIcon name={icon} className="text-[18px]" />
              {confirmLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
