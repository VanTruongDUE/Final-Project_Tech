import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConversationListItem from '../../components/buyer/ConversationListItem'
import { conversationService } from '../../services/conversationService'

export default function BuyerMessagesPage() {
  const [keyword, setKeyword] = useState('')
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    conversationService.getConversations()
      .then((response) => {
        if (isMounted) setConversations(response.data)
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filteredConversations = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return conversations
    }

    return conversations.filter((conversation) => {
      const searchableText = [
        conversation.storeName,
        conversation.productName,
        conversation.orderId,
        conversation.lastMessage,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedKeyword)
    })
  }, [conversations, keyword])

  if (isLoading || errorMessage || !conversations.length) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#e3e2e2] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff1ec] text-3xl text-[#ee4d2d]">
            <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
              chat
            </span>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#1b1c1c]">
            {isLoading ? 'Đang tải tin nhắn...' : errorMessage || 'Bạn chưa có cuộc trò chuyện nào'}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5b403b]">
            Hãy vào trang sản phẩm hoặc chi tiết đơn hàng để nhắn tin với shop khi cần hỗ trợ thêm.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#ee4d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </section>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 sm:px-6 lg:h-[calc(100vh-172px)] lg:flex-row lg:px-8">
      <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)] lg:w-[360px] xl:w-[400px]">
        <div className="flex items-center justify-between border-b border-[#e3beb6]/30 p-4">
          <h1 className="text-xl font-semibold text-[#1b1c1c]">Tin nhắn</h1>
          <button type="button" className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#ee4d2d]">
            ⋯
          </button>
        </div>

        <div className="border-b border-[#e3beb6]/30 p-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f7069]">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                search
              </span>
            </span>
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm hội thoại..."
              className="h-10 w-full rounded-lg border-none bg-[#f5f3f3] px-10 text-sm outline-none ring-1 ring-transparent transition focus:ring-[#ee4d2d]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length ? (
            filteredConversations.map((conversation) => (
              <ConversationListItem key={conversation.id} conversation={conversation} />
            ))
          ) : (
            <div className="px-4 py-10 text-center text-sm text-[#8f7069]">
              Không có hội thoại phù hợp với từ khóa bạn đang tìm.
            </div>
          )}
        </div>
      </aside>

      <section className="hidden min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)] lg:flex">
        <div className="border-b border-[#e3beb6]/30 bg-white px-5 py-4">
          <h2 className="text-base font-semibold text-[#1b1c1c]">Chọn một cuộc trò chuyện để xem chi tiết</h2>
          <p className="mt-1 text-sm text-[#8f7069]">
            Danh sách hội thoại vẫn được lấy theo tài khoản hiện tại và sẽ mở đúng trang chat khi bạn chọn.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-[#fafafa] px-8 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#fff1ec] text-4xl text-[#ee4d2d]">
            <span className="material-symbols-outlined text-[36px]" aria-hidden="true">
              forum
            </span>
          </div>
          <h3 className="mt-5 text-2xl font-bold text-[#1b1c1c]">Hộp thư hỗ trợ của bạn</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#5b403b]">
            Hãy chọn một cuộc trò chuyện ở cột bên trái để xem nội dung trao đổi với shop, theo dõi phản hồi
            và tiếp tục nhắn tin khi cần.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-[#e3beb6] bg-white px-5 py-4 text-sm text-[#8f7069]">
            Bạn có thể tìm kiếm theo tên shop, sản phẩm hoặc mã đơn hàng ở danh sách bên trái.
          </div>
        </div>
      </section>
    </main>
  )
}
