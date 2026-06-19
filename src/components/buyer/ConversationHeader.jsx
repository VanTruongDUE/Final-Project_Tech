import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'

export default function ConversationHeader({ conversation, mobileBackLink = null }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      if (!conversation.productId) {
        setProduct(null)
        return
      }

      const response = await productService.getProductById(conversation.productId)

      if (isMounted) {
        setProduct(response.success ? response.data : null)
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [conversation.productId])

  const storeInitials = conversation.storeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#e3beb6]/30 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          {mobileBackLink ? (
            <Link
              to={mobileBackLink}
              className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] md:hidden"
            >
              ←
            </Link>
          ) : null}

          <div className="relative">
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#e3beb6]/30 bg-[#fff1ec] text-sm font-bold text-[#ee4d2d]">
              {product?.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={conversation.storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                storeInitials
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div>
            <h2 className="flex items-center gap-1 text-sm font-semibold text-[#1b1c1c]">
              {conversation.storeName}
              <span className="text-[#ee4d2d]">✓</span>
            </h2>
            <p className="text-[11px] text-[#8f7069]">Đang hoạt động • Phản hồi nhanh</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={
              conversation.productId
                ? `/products/${encodeURIComponent(conversation.productId)}`
                : '/products'
            }
            className="hidden rounded-lg border border-[#e3beb6] bg-white px-3 py-1.5 text-xs font-medium text-[#1b1c1c] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d] sm:inline-flex"
          >
            {conversation.productId ? 'Xem sản phẩm' : 'Xem shop'}
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#ee4d2d]"
          >
            ⋯
          </button>
        </div>
      </div>

      {(conversation.productName || conversation.orderId) ? (
        <div className="flex items-center gap-3 border-b border-[#e3beb6]/20 bg-[#f8f6f6] px-4 py-3">
          <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-md border border-[#e3beb6]/30 bg-white">
            {product?.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={conversation.productName || conversation.storeName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl text-[#c7b7b2]">📦</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#1b1c1c]">
              {conversation.productName || `Đơn hàng ${conversation.orderId}`}
            </p>
            {product ? (
              <p className="mt-1 text-sm font-semibold text-[#ee4d2d]">
                {formatCurrency(product.price)}
              </p>
            ) : null}
          </div>

          <div className="text-right">
            <span className="inline-block rounded bg-[#e9e8e7] px-2 py-1 text-[10px] font-semibold uppercase text-[#5b403b]">
              Hỗ trợ
            </span>
            {conversation.orderId ? (
              <Link
                to={`/orders/${encodeURIComponent(conversation.orderId)}`}
                className="mt-1 block text-[11px] font-medium text-[#ee4d2d] hover:underline"
              >
                Xem chi tiết đơn
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
