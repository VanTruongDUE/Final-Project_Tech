import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerIcon from '../../components/seller/SellerIcon'
import SellerProductFilterBar from '../../components/seller/SellerProductFilterBar'
import SellerProductStatusBadge from '../../components/seller/SellerProductStatusBadge'
import SellerProductTable from '../../components/seller/SellerProductTable'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

export default function SellerProductsPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const productsResponse = sellerService.getSellerProducts(currentUser, {
    keyword,
    refreshKey,
  })

  if (!productsResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {productsResponse.message || 'Không thể tải danh sách sản phẩm của seller.'}
        </div>
      </section>
    )
  }

  const { data: products, meta } = productsResponse

  const handleDeleteProduct = (product) => {
    const confirmed = window.confirm(`Xóa sản phẩm "${product.name}" khỏi danh sách seller?`)

    if (!confirmed) {
      return
    }

    const response = sellerService.deleteSellerProduct(currentUser, product.id)

    if (!response.success) {
      window.alert(response.message || 'Không thể xóa sản phẩm.')
      return
    }

    if (selectedProduct && String(selectedProduct.id) === String(product.id)) {
      setSelectedProduct(null)
    }

    setRefreshKey((currentKey) => currentKey + 1)
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3] p-4 md:p-6">
      <div className="flex w-full min-w-0 flex-col gap-6 xl:pr-8">
        <SellerProductFilterBar
          keyword={keyword}
          onKeywordChange={setKeyword}
          totalProducts={meta.totalCount}
          onAddProduct={() => navigate('/seller/products/new')}
        />

        {products.length ? (
          <SellerProductTable
            products={products}
            totalCount={meta.totalCount}
            onViewProduct={setSelectedProduct}
            onEditProduct={(product) => navigate(`/seller/products/${encodeURIComponent(product.id)}/edit`)}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <div className="rounded-xl border border-[#e3beb6] bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b1c1c]">Không tìm thấy sản phẩm phù hợp</h2>
            <p className="mt-2 text-sm text-[#5b403b]">
              Seller hiện chỉ được xem sản phẩm thuộc shop của mình trong mock data. Hãy thử đổi từ khóa tìm kiếm để tiếp tục demo giao diện.
            </p>
            <button type="button" onClick={() => setKeyword('')} className="mt-5 rounded-lg bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]">
              Xóa tìm kiếm
            </button>
          </div>
        )}
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true" aria-label="Chi tiết sản phẩm">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-[#e3beb6] bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e3beb6] bg-[#fbf9f9] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#1b1c1c]">Chi tiết sản phẩm</h2>
                <p className="mt-1 break-all text-xs text-[#8f7069]">SKU: {selectedProduct.skuCode}</p>
              </div>
              <button type="button" onClick={() => setSelectedProduct(null)} className="rounded-full p-1.5 text-[#5b403b] transition hover:bg-[#efeded] hover:text-[#b22204]" aria-label="Đóng">
                <SellerIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-lg border border-[#e3beb6] bg-[#efeded]">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="aspect-square h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#1b1c1c]">{selectedProduct.name}</h3>
                    <p className="mt-1 text-sm text-[#5b403b]">{selectedProduct.category}</p>
                  </div>
                  <SellerProductStatusBadge status={selectedProduct.status} />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#5b403b]">{selectedProduct.description || 'Sản phẩm chưa có mô tả chi tiết.'}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div className="rounded-lg bg-[#fbf9f9] p-3">
                    <p className="text-xs text-[#8f7069]">Giá bán</p>
                    <p className="mt-1 font-bold text-[#b22204]">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div className="rounded-lg bg-[#fbf9f9] p-3">
                    <p className="text-xs text-[#8f7069]">Tồn kho</p>
                    <p className="mt-1 font-bold text-[#1b1c1c]">{selectedProduct.stockQuantity}</p>
                  </div>
                  <div className="rounded-lg bg-[#fbf9f9] p-3">
                    <p className="text-xs text-[#8f7069]">Đã bán</p>
                    <p className="mt-1 font-bold text-[#1b1c1c]">{selectedProduct.soldQuantity}</p>
                  </div>
                  <div className="rounded-lg bg-[#fbf9f9] p-3">
                    <p className="text-xs text-[#8f7069]">Shop</p>
                    <p className="mt-1 truncate font-bold text-[#1b1c1c]">{selectedProduct.storeName}</p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => navigate(`/seller/products/${encodeURIComponent(selectedProduct.id)}/edit`)} className="inline-flex h-10 items-center gap-2 rounded border border-[#b22204] px-4 text-sm font-semibold text-[#b22204] transition hover:bg-[#ffdad3]">
                    <SellerIcon name="edit" className="text-[18px]" />
                    Chỉnh sửa
                  </button>
                  <button type="button" onClick={() => handleDeleteProduct(selectedProduct)} className="inline-flex h-10 items-center gap-2 rounded bg-[#ba1a1a] px-4 text-sm font-semibold text-white transition hover:bg-[#93000a]">
                    <SellerIcon name="delete" className="text-[18px]" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
