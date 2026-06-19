import SellerIcon from './SellerIcon'

const formatMessageTime = (value) => {
  if (!value) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export default function SellerMessageBubble({ message }) {
  const isSeller = message.senderRole === 'SELLER' || message.senderRole === 'SHOP'
  const senderInitials = (message.senderName || (isSeller ? 'Shop' : 'Khách'))
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`flex w-full ${isSeller ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[76%] flex-col gap-1 ${isSeller ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-2 ${isSeller ? 'flex-row-reverse' : ''}`}>
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#f0cfc5] bg-white text-[9px] font-semibold text-[#ee4d2d]">
            {senderInitials}
          </div>

          <div
            className={`rounded-[14px] border px-4 py-2.5 text-[13px] leading-6 shadow-sm ${
              isSeller
                ? 'rounded-br-sm border-[#f0cfc5] bg-[#fff8f5] text-[#5b403b]'
                : 'rounded-bl-sm border-[#ead8d2] bg-white text-[#1b1c1c]'
            }`}
          >
            {message.content}
          </div>
        </div>

        <span className={`flex items-center gap-1 text-[10px] text-[#8f7069] ${isSeller ? 'mr-9' : 'ml-9'}`}>
          {isSeller ? 'Đã gửi' : 'Đã xem'} {formatMessageTime(message.createdAt)}
          {isSeller ? <SellerIcon name="done_all" className="text-[13px] text-[#ee4d2d]" /> : null}
        </span>
      </div>
    </div>
  )
}
