import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'
import SellerIcon from './SellerIcon'

const getInitials = (name) =>
  (name || 'Khách hàng')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

export default function SellerConversationHeader({ conversation, mobileBackLink = null }) {
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

  const initials = getInitials(conversation.customerName)
  const productTitle = conversation.productName || (conversation.orderId ? `Đơn hàng ${conversation.orderId}` : '')

  return (
    <div className="shrink-0 border-b border-[#ead8d2] bg-white">
      <div className="flex min-w-0 items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {mobileBackLink ? (
            <Link
              to={mobileBackLink}
              className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] xl:hidden"
              aria-label="Quay lại danh sách hội thoại"
            >
              <SellerIcon name="arrow_back" className="text-[20px]" />
            </Link>
          ) : null}

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#f0cfc5] bg-[#fff8f5] text-[11px] font-semibold text-[#8f7069]">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <h2 className="truncate text-[14px] font-semibold text-[#1b1c1c]">
                {conversation.customerName || 'Khách hàng TechTonic'}
              </h2>
              <span className="text-[13px] font-semibold text-[#ee4d2d]">✓</span>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#8f7069]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Đang hoạt động · Phản hồi nhanh
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-[#8f7069] transition hover:bg-[#f6f2f1] hover:text-[#ee4d2d]"
          aria-label="Tùy chọn hội thoại"
        >
          <SellerIcon name="more_horiz" className="text-[18px]" />
        </button>
      </div>

      {productTitle ? (
        <div className="border-t border-[#f4e7e2] bg-[#faf7f6] px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md bg-[#d8e0de] text-[9px] font-semibold text-[#5b403b]">
              {product?.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={productTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                'Watch'
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#1b1c1c]">{productTitle}</p>
              {product ? (
                <p className="mt-0.5 text-[13px] font-semibold text-[#ee4d2d]">
                  {formatCurrency(product.price)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
