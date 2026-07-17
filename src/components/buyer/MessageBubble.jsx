const formatMessageTime = (value) => {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function MessageBubble({ message }) {
  const isCustomer = message.senderRole === 'CUSTOMER'
  const senderInitials = (message.senderName || (isCustomer ? 'Bạn' : 'Shop'))
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`flex gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      {!isCustomer ? (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#e3beb6]/20 bg-[#fff1ec] text-[11px] font-bold text-[#ee4d2d]">
          {senderInitials}
        </div>
      ) : null}

      <div
        className={`flex max-w-[75%] flex-col gap-1 md:max-w-[60%] ${
          isCustomer ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
            isCustomer
              ? 'rounded-tr-sm border border-[#f3c8bc] bg-[#ffede6] text-[#5b403b]'
              : 'rounded-tl-sm border border-[#e3beb6]/30 bg-white text-[#1b1c1c]'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-[#8f7069]">
          {isCustomer ? 'Đã gửi ' : 'Đã xem '}
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
