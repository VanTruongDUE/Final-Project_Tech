export default function MessageComposer({
  value,
  onChange,
  onSubmit,
  onQuickReply = null,
  quickReplies = [],
  placeholder = 'Nhập tin nhắn...',
  disabled = false,
}) {
  return (
    <div className="border-t border-[#e3beb6]/30 bg-white p-4">
      {quickReplies.length ? (
        <div className="mb-3 flex flex-wrap gap-2 px-1">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onQuickReply?.(reply)}
              disabled={disabled}
              className="rounded-full border border-[#e3beb6] bg-white px-3 py-1.5 text-xs font-medium text-[#5b403b] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reply}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-3 flex items-center gap-2 px-1 text-[#8f7069]">
        <button
          type="button"
          disabled={disabled}
          className="rounded-full p-1 transition hover:text-[#ee4d2d]"
        >
          🖼️
        </button>
        <button
          type="button"
          disabled={disabled}
          className="rounded-full p-1 transition hover:text-[#ee4d2d]"
        >
          🏷️
        </button>
        <button
          type="button"
          disabled={disabled}
          className="rounded-full p-1 transition hover:text-[#ee4d2d]"
        >
          🧾
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-end gap-2 rounded-2xl border border-[#e3beb6]/40 bg-[#f5f3f3] p-1 pl-4 focus-within:border-[#ee4d2d] focus-within:ring-1 focus-within:ring-[#ee4d2d]/50"
      >
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="max-h-[100px] min-h-[40px] w-full resize-none border-none bg-transparent py-2 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Gửi tin nhắn"
          className="mb-0.5 mr-0.5 grid h-10 w-10 place-items-center rounded-xl bg-[#ee4d2d] text-white transition hover:bg-[#db3514] disabled:cursor-not-allowed disabled:opacity-60"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
