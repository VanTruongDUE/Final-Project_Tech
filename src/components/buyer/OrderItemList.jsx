import { formatCurrency } from '../../utils/formatCurrency'

export default function OrderItemList({ items, renderExtra }) {
  if (!items.length) {
    return (
      <div className="border border-[#e8e8e8] bg-white px-4 py-5 text-sm text-[#5b403b]">
        Không có sản phẩm hợp lệ trong đơn hàng này.
      </div>
    )
  }

  return (
    <section className="border border-[#e8e8e8] bg-white">
      <div className="border-b border-[#e8e8e8] bg-[#f5f3f3] px-4 py-3">
        <h2 className="text-base font-semibold uppercase tracking-[0.04em] text-[#1b1c1c]">Sản phẩm trong đơn</h2>
      </div>

      <div className="divide-y divide-[#e8e8e8]">
        {items.map((item, index) => {
          const product = item.product
          const itemTotal = item.price * item.quantity

          return (
            <div key={`${item.productId}-${index}`} className="px-4 py-4">
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden border border-[#e8e8e8] bg-[#f5f3f3]">
                  {product?.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[#c7b7b2]">
                      <span className="material-symbols-outlined text-[34px]">inventory_2</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-medium leading-5 text-[#1b1c1c] md:text-base">
                        {product?.name || 'Sản phẩm không còn khả dụng'}
                      </h3>
                      <p className="mt-1 text-sm text-[#5b403b]">Phân loại: {product?.category || 'Sản phẩm mua sắm'}</p>
                      <p className="mt-1 break-all text-xs text-[#8f7069]">
                        {item.variantName || product?.variantName || 'Mặc định'} · SKU: {item.skuCode || product?.skuCode || 'Chưa có SKU'}
                      </p>
                      <p className="mt-1 text-xs text-[#8f7069]">{product?.storeName || 'TechToShop Mall'}</p>
                    </div>

                    <div className="shrink-0 text-left md:text-right">
                      <p className="text-sm text-[#5b403b]">x{item.quantity}</p>
                      <p className="mt-1 text-lg font-semibold text-[#ee4d2d]">{formatCurrency(itemTotal)}</p>
                    </div>
                  </div>

                  {renderExtra ? <div className="mt-4">{renderExtra(item)}</div> : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
