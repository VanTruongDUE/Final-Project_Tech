import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'LOCKED', label: 'Tạm ngưng' },
  { value: 'REJECTED', label: 'Từ chối' },
]

const statusMeta = {
  ACTIVE: { label: 'Đang hoạt động', className: 'bg-green-100 text-green-800', icon: 'check_circle' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-[#ffdad6] text-[#93000a]', icon: 'pending_actions' },
  LOCKED: { label: 'Tạm ngưng', className: 'bg-[#ffdad6] text-[#ba1a1a]', icon: 'block' },
  REJECTED: { label: 'Từ chối', className: 'bg-[#e9e8e7] text-[#5b403b]', icon: 'cancel' },
}

function StoreAvatar({ store }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#e3beb6] bg-[#e3e2e2] text-[#5b403b] ${store.status === 'LOCKED' ? 'opacity-60' : ''}`}>
      <AdminIcon name="storefront" className="text-[22px]" />
    </div>
  )
}

function StoreStatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING

  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>
}

function StoreDetailModal({ store, onClose, onUpdateStatus }) {
  if (!store) {
    return null
  }

  const isLocked = store.status === 'LOCKED'
  const isRejected = store.status === 'REJECTED'
  const isPending = store.status === 'PENDING'

  const stats = [
    { label: 'Sản phẩm', value: store.productCount.toLocaleString('vi-VN'), icon: 'inventory_2' },
    { label: 'Đơn hàng', value: store.orderCount.toLocaleString('vi-VN'), icon: 'shopping_bag' },
    { label: 'Doanh thu', value: store.revenueLabel, icon: 'payments' },
    { label: 'Đánh giá', value: `${store.rating}/5`, icon: 'star' },
  ]

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-3">
      <div className="flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-xl bg-[#fbf9f9] shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-[#e3e2e2] bg-white p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#e3beb6] bg-[#e3e2e2] text-[#5b403b]">
              <AdminIcon name="storefront" className="text-[30px]" />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
                <span>Cửa hàng</span>
                <AdminIcon name="chevron_right" className="text-[16px]" />
                <span className="text-[#1b1c1c]">Chi tiết</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate text-2xl font-bold text-[#1b1c1c]">{store.name}</h2>
                <StoreStatusBadge status={store.status} />
              </div>
              <p className="mt-1 text-sm text-[#5b403b]">#{store.id} · {store.category} · {store.address}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(store, 'ACTIVE')}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b22204] px-4 text-sm font-semibold text-white transition hover:bg-[#d63c1e]"
                >
                  <AdminIcon name="check_circle" className="text-[18px]" />
                  Duyệt
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(store, 'REJECTED')}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ba1a1a] bg-white px-4 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                >
                  <AdminIcon name="cancel" className="text-[18px]" />
                  Từ chối
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onUpdateStatus(store, isLocked || isRejected ? 'ACTIVE' : 'LOCKED')}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                  isLocked || isRejected ? 'bg-green-600 text-white hover:bg-green-700' : 'border border-[#ba1a1a] bg-white text-[#ba1a1a] hover:bg-[#ffdad6]'
                }`}
              >
                <AdminIcon name={isLocked || isRejected ? 'settings_backup_restore' : 'block'} className="text-[18px]" />
                {isLocked || isRejected ? 'Khôi phục' : 'Đình chỉ'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e2e2] bg-white text-[#5b403b] transition hover:bg-[#f5f3f3]"
              aria-label="Đóng chi tiết cửa hàng"
            >
              <AdminIcon name="close" className="text-[20px]" />
            </button>
          </div>
        </header>

        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1b1c1c]">Tổng quan cửa hàng</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b403b]">{store.description}</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-3">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ffdad3] text-[#b22204]">
                        <AdminIcon name={item.icon} className="text-[19px]" />
                      </div>
                      <p className="text-xs font-medium text-[#5b403b]">{item.label}</p>
                      <p className="mt-1 text-lg font-bold text-[#1b1c1c]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1b1c1c]">Hồ sơ xác minh</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {store.documents.map((document) => (
                    <div key={document.id} className="rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-3">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e9e8e7] text-[#5b403b]">
                        <AdminIcon name="description" className="text-[18px]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1b1c1c]">{document.label}</p>
                      <p className="mt-1 text-xs text-[#5b403b]">{document.status}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1b1c1c]">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {store.activity.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ffdad3] text-[#b22204]">
                        <AdminIcon name={item.icon} className="text-[16px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c]">{item.label}</p>
                        <p className="mt-0.5 text-xs text-[#8f7069]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="person" className="text-[22px] text-[#b22204]" />
                  Chủ cửa hàng
                </h3>
                <div className="space-y-3 text-sm text-[#1b1c1c]">
                  <p className="font-semibold">{store.ownerName}</p>
                  <p className="text-[#5b403b]">{store.email}</p>
                  <p className="text-[#5b403b]">{store.phone}</p>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="analytics" className="text-[22px] text-[#b22204]" />
                  Hiệu suất
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5b403b]">Đơn hoàn thành</span>
                    <span className="font-semibold text-[#1b1c1c]">{store.completedOrders.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5b403b]">Đơn đã hủy</span>
                    <span className="font-semibold text-[#ba1a1a]">{store.cancelledOrders.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5b403b]">Giá trị đơn TB</span>
                    <span className="font-semibold text-[#b22204]">{store.averageOrderValueLabel}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="location_on" className="text-[22px] text-[#b22204]" />
                  Địa chỉ
                </h3>
                <p className="text-sm leading-6 text-[#5b403b]">{store.address}</p>
                <p className="mt-3 text-xs text-[#8f7069]">Ngày tạo: {store.createdAt}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminStoresPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [, setRefreshKey] = useState(0)

  const storesResponse = adminService.getAdminStores({ keyword, status, category })
  const stores = storesResponse.success ? storesResponse.data : []
  const summary = storesResponse.meta?.summary || { total: 0, active: 0, locked: 0, pending: 0 }
  const categories = storesResponse.meta?.categories || []
  const totalCount = storesResponse.meta?.totalCount || 0
  const allCount = storesResponse.meta?.allCount || 0
  const selectedStoreResponse = selectedStoreId ? adminService.getAdminStoreById(selectedStoreId) : null
  const selectedStore = selectedStoreResponse?.success ? selectedStoreResponse.data : null

  const handleUpdateStatus = (store, nextStatus) => {
    adminService.updateStoreStatus(store.id, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  const kpiCards = [
    { label: 'Tổng Cửa hàng', value: summary.total, icon: 'store', iconClassName: 'bg-[#ffdad3] text-[#b22204]' },
    { label: 'Đang hoạt động', value: summary.active, icon: 'check_circle', iconClassName: 'bg-[#e3e2e2] text-[#1b1c1c]' },
    { label: 'Tạm ngưng', value: summary.locked, icon: 'block', iconClassName: 'bg-[#ffdad6] text-[#ba1a1a]' },
    { label: 'Chờ duyệt', value: summary.pending, icon: 'pending_actions', iconClassName: 'bg-[#ffdad6] text-[#bb0017]' },
  ]

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col p-3 md:p-6 lg:p-12">
      <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Quản lý Cửa hàng</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Giám sát và quản lý trạng thái các đối tác bán hàng.</p>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconClassName}`}>
              <AdminIcon name={card.icon} className="text-[24px]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#5b403b]">{card.label}</p>
              <p className="text-xl font-semibold text-[#1b1c1c]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-t-lg border-b border-[#e3e2e2] bg-white p-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b403b]" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo Tên, ID, Chủ sở hữu..."
              className="h-10 w-full rounded border border-[#e3e2e2] bg-[#f5f3f3] py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition placeholder:text-[#8f7069] focus:border-[#b22204] focus:ring-1 focus:ring-[#b22204]"
            />
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none rounded border border-[#e3e2e2] bg-white py-2 pl-3 pr-9 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] sm:w-44"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <AdminIcon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#5b403b]" />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none rounded border border-[#e3e2e2] bg-white py-2 pl-3 pr-9 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] sm:w-36"
              >
                <option value="all">Tất cả ngành</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <AdminIcon name="expand_more" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#5b403b]" />
            </div>

            <button type="button" className="flex h-10 items-center justify-center gap-2 rounded border border-[#e3e2e2] px-4 text-xs font-medium text-[#1b1c1c] transition hover:bg-[#f5f3f3]">
              <AdminIcon name="filter_list" className="text-[18px]" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-medium text-[#5b403b]">
                <th className="p-4 font-medium">Cửa hàng</th>
                <th className="p-4 font-medium">Store ID</th>
                <th className="p-4 font-medium">Chủ sở hữu</th>
                <th className="p-4 text-right font-medium">Sản phẩm</th>
                <th className="p-4 text-right font-medium">Đơn hàng</th>
                <th className="p-4 text-center font-medium">Trạng thái</th>
                <th className="p-4 font-medium">Ngày tạo</th>
                <th className="p-4 text-center font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2] text-sm">
              {stores.length ? (
                stores.map((store) => {
                  const isLocked = store.status === 'LOCKED'
                  const isRejected = store.status === 'REJECTED'
                  const isPending = store.status === 'PENDING'

                  return (
                    <tr key={store.id} className={`transition-colors hover:bg-[#fbf9f9] ${isLocked ? 'bg-[#ffdad6]/20' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <StoreAvatar store={store} />
                          <div>
                            <p className="font-medium text-[#1b1c1c]">{store.name}</p>
                            <p className={`text-xs ${isLocked ? 'text-[#ba1a1a]' : 'text-[#5b403b]'}`}>{store.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-[#5b403b]">#{store.id}</td>
                      <td className="p-4">
                        <p className="font-medium text-[#1b1c1c]">{store.ownerName}</p>
                        <p className="text-xs text-[#5b403b]">{store.email}</p>
                      </td>
                      <td className="p-4 text-right font-medium text-[#1b1c1c]">{store.productCount}</td>
                      <td className="p-4 text-right font-medium text-[#b22204]">{store.orderCount.toLocaleString('vi-VN')}</td>
                      <td className="p-4 text-center">
                        <StoreStatusBadge status={store.status} />
                      </td>
                      <td className="p-4 text-sm text-[#5b403b]">{store.createdAt}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStoreId(store.id)}
                            className="rounded p-1.5 text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#b22204]"
                            title="Xem chi tiết"
                          >
                            <AdminIcon name="visibility" className="text-[20px]" />
                          </button>
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(store, 'ACTIVE')}
                                className="rounded p-1.5 text-[#5b403b] transition hover:bg-green-100 hover:text-green-700"
                                title="Duyệt"
                              >
                                <AdminIcon name="check_circle" className="text-[20px]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(store, 'REJECTED')}
                                className="rounded p-1.5 text-[#5b403b] transition hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
                                title="Từ chối"
                              >
                                <AdminIcon name="cancel" className="text-[20px]" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(store, isLocked || isRejected ? 'ACTIVE' : 'LOCKED')}
                              className={`rounded p-1.5 transition ${
                                isLocked || isRejected ? 'text-[#5b403b] hover:bg-green-100 hover:text-green-700' : 'text-[#5b403b] hover:bg-[#ffdad6] hover:text-[#ba1a1a]'
                              }`}
                              title={isLocked || isRejected ? 'Khôi phục' : 'Đình chỉ'}
                            >
                              <AdminIcon name={isLocked || isRejected ? 'settings_backup_restore' : 'block'} className="text-[20px]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-sm text-[#5b403b]">
                    Không có cửa hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#e3e2e2] bg-white p-4">
          <span className="text-sm text-[#5b403b]">
            Hiển thị {stores.length ? 1 : 0}-{totalCount} trên {allCount} cửa hàng
          </span>
          <div className="flex gap-1">
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_left" className="text-[18px]" />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-[#b22204] text-sm font-medium text-white">
              1
            </button>
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <StoreDetailModal
        store={selectedStore}
        onClose={() => setSelectedStoreId('')}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  )
}
