import SellerIcon from './SellerIcon'

export default function SellerMessageComposer({
  value,
  onChange,
  onSubmit,
  onQuickReply,
  quickReplies = [],
  disabled = false,
}) {
  return (
    <div className="bg-white">
      {quickReplies.length ? (
        <div className="flex gap-2 overflow-x-auto border-b border-[#ead8d2] px-5 py-3">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              disabled={disabled}
              onClick={() => onQuickReply?.(reply)}
              className="shrink-0 rounded-full border border-[#f0cfc5] bg-white px-3 py-1.5 text-[12px] text-[#5b403b] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reply}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="border-b border-[#ead8d2] bg-[#f7f3f2] px-5 py-3">
        <div className="mb-2 flex items-center gap-1 text-[#8f7069]">
          <button
            type="button"
            disabled={disabled}
            className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Thêm ảnh"
          >
            <SellerIcon name="image" className="text-[18px]" />
          </button>
          <button
            type="button"
            disabled={disabled}
            className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Thêm nhãn"
          >
            <SellerIcon name="sell" className="text-[18px]" />
          </button>
          <button
            type="button"
            disabled={disabled}
            className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Thêm hóa đơn"
          >
            <SellerIcon name="receipt_long" className="text-[18px]" />
          </button>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-2 rounded-xl border border-[#ead8d2] bg-white p-2 focus-within:border-[#ee4d2d] focus-within:ring-1 focus-within:ring-[#ee4d2d]/25">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Nhập tin nhắn..."
            disabled={disabled}
            rows={1}
            className="max-h-28 min-h-8 min-w-0 resize-none border-none bg-transparent px-2 py-1.5 text-[13px] text-[#1b1c1c] outline-none placeholder:text-[#a08a84] focus:ring-0"
          />

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#ee4d2d] text-white transition hover:bg-[#d93c1f] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Gửi tin nhắn"
          >
            <SellerIcon name="send" className="text-[17px]" filled />
          </button>
        </div>
      </form>
    </div>
  )
}
