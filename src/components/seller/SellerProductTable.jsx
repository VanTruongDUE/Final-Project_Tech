import SellerIcon from './SellerIcon'
import { formatCurrency } from '../../utils/formatCurrency'
import SellerProductStatusBadge from './SellerProductStatusBadge'

function ProductActionButton({ icon, title, onClick, hoverClassName = 'hover:text-[#ee4d2d] hover:bg-[#ee4d2d]/10' }) {
  return (
    <button
      type="button"
      title={title}
      className={`rounded-md p-1.5 text-[#8f7069] transition ${hoverClassName}`}
      onClick={onClick}
    >
      <SellerIcon name={icon} className="text-[18px]" />
    </button>
  )
}

export default function SellerProductTable({ products, totalCount, onViewProduct, onEditProduct, onDeleteProduct }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#e3beb6]/70 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e3beb6]/70 bg-[#f5f3f3]">
              <th className="w-[88px] p-4 text-xs font-medium text-[#1b1c1c]">Ảnh</th>
              <th className="p-4 text-xs font-medium text-[#1b1c1c]">Tên sản phẩm</th>
              <th className="p-4 text-xs font-medium text-[#1b1c1c]">Danh mục</th>
              <th className="p-4 text-right text-xs font-medium text-[#1b1c1c]">Giá</th>
              <th className="p-4 text-right text-xs font-medium text-[#1b1c1c]">Tồn kho</th>
              <th className="p-4 text-right text-xs font-medium text-[#1b1c1c]">Đã bán</th>
              <th className="p-4 text-xs font-medium text-[#1b1c1c]">Trạng thái</th>
              <th className="p-4 text-center text-xs font-medium text-[#1b1c1c]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3beb6]/70">
            {products.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-[#fbf9f9]">
                <td className="p-4 align-middle">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-[#e3beb6] bg-[#efeded]">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="text-sm font-semibold text-[#1b1c1c]">{product.name}</div>
                  <div className="mt-0.5 text-xs text-[#8f7069]">SKU: TT-{String(product.id).padStart(3, '0')}</div>
                </td>
                <td className="p-4 align-middle text-sm text-[#1b1c1c]">{product.category}</td>
                <td className="p-4 text-right align-middle text-sm font-semibold text-[#b22204]">{formatCurrency(product.price)}</td>
                <td className={`p-4 text-right align-middle text-sm ${product.stockQuantity === 0 ? 'font-medium text-[#ba1a1a]' : 'text-[#1b1c1c]'}`}>
                  {product.stockQuantity}
                </td>
                <td className="p-4 text-right align-middle text-sm text-[#1b1c1c]">{product.soldQuantity}</td>
                <td className="p-4 align-middle">
                  <SellerProductStatusBadge status={product.status} />
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <ProductActionButton icon="visibility" title="Xem sản phẩm" onClick={() => onViewProduct(product)} />
                    <ProductActionButton icon="edit" title="Sửa sản phẩm" onClick={() => onEditProduct(product)} hoverClassName="hover:bg-[#f5f3f3] hover:text-[#F59E0B]" />
                    <ProductActionButton icon="delete" title="Xóa sản phẩm" onClick={() => onDeleteProduct(product)} hoverClassName="hover:bg-[#ffdad6] hover:text-[#ba1a1a]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#e3beb6]/70 bg-white px-4 py-4">
        <span className="text-xs text-[#8f7069]">Hiển thị 1-{products.length} của {totalCount} sản phẩm</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3beb6] text-[#8f7069]">
            <SellerIcon name="chevron_left" className="text-[16px]" />
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-[#ee4d2d] text-xs font-medium text-white">
            1
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#e3beb6] text-xs font-medium text-[#1b1c1c]">
            2
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#e3beb6] text-xs font-medium text-[#1b1c1c]">
            3
          </button>
          <span className="flex h-8 w-8 items-center justify-center text-xs text-[#8f7069]">...</span>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#e3beb6] text-[#1b1c1c]">
            <SellerIcon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
