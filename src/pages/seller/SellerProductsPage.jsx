import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categoryGroups = [
  {
    id: 'fashion',
    label: 'Thời trang',
    hint: 'Áo quần, giày dép, phụ kiện',
    children: ['Áo thun', 'Đầm nữ', 'Giày sneaker', 'Túi xách'],
  },
  {
    id: 'electronics',
    label: 'Điện tử',
    hint: 'Thiết bị số, điện thoại, phụ kiện',
    children: ['Điện thoại', 'Laptop', 'Tai nghe', 'Phụ kiện sạc'],
  },
  {
    id: 'home',
    label: 'Gia dụng',
    hint: 'Thiết bị nhà bếp và chăm sóc nhà cửa',
    children: ['Nồi chiên', 'Máy hút bụi', 'Đèn bàn', 'Kệ lưu trữ'],
  },
  {
    id: 'beauty',
    label: 'Mỹ phẩm',
    hint: 'Skincare, makeup, chăm sóc cá nhân',
    children: ['Son môi', 'Kem chống nắng', 'Serum', 'Nước hoa'],
  },
]

const initialCategory = categoryGroups[0]

export default function SellerProductsPage() {
  const navigate = useNavigate()
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory.id)
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialCategory.children[0])
  const [estimatedVariants, setEstimatedVariants] = useState(1)

  const selectedCategory =
    categoryGroups.find((category) => category.id === selectedCategoryId) || initialCategory

  const handleCategoryChange = (category) => {
    setSelectedCategoryId(category.id)
    setSelectedSubcategory(category.children[0])
  }

  const handleVariantChange = (nextValue) => {
    setEstimatedVariants(Math.max(1, nextValue))
  }

  const handleContinue = () => {
    window.alert(
      `Đã chọn ngành hàng "${selectedCategory.label}" - "${selectedSubcategory}". Chúng ta sẽ nối sang màn tạo sản phẩm ở bước tiếp theo.`,
    )
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[30px] bg-[#f3eeec] px-4 py-5 sm:px-6 sm:py-6 lg:min-h-[calc(100vh-5rem)] lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-8 h-24 w-44 rounded-[28px] bg-white/60 shadow-[0_25px_60px_rgba(101,67,33,0.08)] blur-[1px]" />
        <div className="absolute right-10 top-12 h-12 w-48 rounded-full bg-[#f7d7d0]/70 blur-sm" />
        <div className="absolute bottom-8 left-8 h-44 w-[38%] rounded-[36px] bg-[#d8d8d8]/80 shadow-inner blur-[1px]" />
        <div className="absolute bottom-10 right-8 h-16 w-[34%] rounded-[28px] bg-[#c84626]/18 blur-[1px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a4c3f]">
            Seller Center
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Chọn phân loại sản phẩm trước khi đăng bán
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6d5a55] sm:text-base">
            Bước này giúp chúng ta gán đúng ngành hàng và nhóm thuộc tính để màn tạo sản phẩm
            phía sau có form phù hợp hơn.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[26px] bg-white shadow-[0_30px_80px_rgba(84,44,32,0.18)]">
          <div className="flex items-center justify-between border-b border-[#f1c9bf] px-5 py-5 sm:px-6">
            <h2 className="text-[28px] font-bold tracking-tight text-[#1b1c1c]">
              Chọn phân loại
            </h2>
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-3xl leading-none text-[#6d3f36] transition hover:bg-[#f7efed]"
              aria-label="Đóng màn chọn phân loại"
            >
              ×
            </button>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,_#18314a,_#0d1722_62%,_#070b12)] shadow-[0_8px_22px_rgba(13,23,34,0.22)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl text-white/90">
                  +
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[18px] font-semibold text-[#7b1905] sm:text-[20px]">
                  Chuẩn bị đăng sản phẩm mới
                </p>
                <div className="text-[40px] font-bold leading-none tracking-tight text-[#ba2204] sm:text-[46px]">
                  {selectedCategory.label}
                </div>
                <p className="text-base text-[#594642]">
                  Nhóm con đã chọn: <span className="font-medium">{selectedSubcategory}</span>
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#251d1b]">
                  Ngành hàng
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {categoryGroups.map((category) => {
                    const isActive = category.id === selectedCategory.id

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          isActive
                            ? 'border-[#df5839] bg-[#fff4f1] text-[#b22204] shadow-[0_10px_24px_rgba(178,34,4,0.08)]'
                            : 'border-[#efc9bf] bg-white text-[#2a2422] hover:border-[#df5839]'
                        }`}
                      >
                        <div className="text-lg font-semibold">{category.label}</div>
                        <div className="mt-1 text-sm text-[#7a6660]">{category.hint}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#251d1b]">
                  Phân loại con
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {selectedCategory.children.map((item) => {
                    const isActive = item === selectedSubcategory

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedSubcategory(item)}
                        className={`min-w-[132px] rounded-2xl border px-5 py-3 text-lg transition ${
                          isActive
                            ? 'border-[#df5839] bg-[#fff4f1] font-semibold text-[#b22204]'
                            : 'border-[#efc9bf] bg-white text-[#2a2422] hover:border-[#df5839]'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#251d1b]">
                    Số lượng biến thể dự kiến
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#6d5a55]">
                    Chúng ta tạm ghi nhận số biến thể để chuẩn bị form thuộc tính ở bước tạo sản
                    phẩm tiếp theo.
                  </p>
                </div>

                <div className="flex h-14 w-full max-w-[236px] items-center overflow-hidden rounded-2xl border border-[#efc9bf] bg-[#faf6f5]">
                  <button
                    type="button"
                    onClick={() => handleVariantChange(estimatedVariants - 1)}
                    className="flex h-full w-16 items-center justify-center text-3xl text-[#5b4a45] transition hover:bg-[#f0e5e1]"
                    aria-label="Giảm số lượng biến thể"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center text-[32px] font-medium text-[#1b1c1c]">
                    {estimatedVariants}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVariantChange(estimatedVariants + 1)}
                    className="flex h-full w-16 items-center justify-center text-3xl text-[#5b4a45] transition hover:bg-[#f0e5e1]"
                    aria-label="Tăng số lượng biến thể"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f1c9bf] bg-white px-5 py-5 sm:px-6">
            <button
              type="button"
              onClick={handleContinue}
              className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#c72100] px-6 text-2xl font-bold text-white shadow-[0_16px_32px_rgba(199,33,0,0.18)] transition hover:bg-[#af1d00]"
            >
              Tiếp tục tạo sản phẩm
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
