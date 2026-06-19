import SellerIcon from './SellerIcon'

export default function SellerProductFilterBar({ keyword, onKeywordChange, totalProducts, onAddProduct }) {
  return (
    <header className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1b1c1c] md:text-[32px]">Danh sách sản phẩm</h1>
        <p className="mt-1 text-sm text-[#5b403b]">Quản lý kho hàng và thông tin sản phẩm của bạn.</p>
        <p className="mt-2 text-xs font-medium text-[#8f7069]">Tổng sản phẩm hiển thị: {totalProducts}</p>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3 md:w-auto md:flex-row md:items-center">
        <div className="relative w-full min-w-0 md:w-64">
          <SellerIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8f7069]" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-10 w-full rounded-lg border border-[#e3beb6] bg-white pl-11 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </div>

        <button
          type="button"
          onClick={onAddProduct}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d73211]"
        >
          <SellerIcon name="add" className="text-[20px]" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>
    </header>
  )
}
