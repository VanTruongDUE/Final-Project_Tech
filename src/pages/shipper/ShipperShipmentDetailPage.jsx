import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShipperIcon from '../../components/shipper/ShipperIcon'
import { useAuth } from '../../contexts/useAuth'
import { shipperService } from '../../services/shipperService'

const nextStatusLabels = {
  PICKED_UP: 'Đã lấy hàng',
  IN_TRANSIT: 'Đang giao',
  DELIVERED: 'Đã giao',
  FAILED: 'Giao thất bại',
}

function TimelineDot({ state }) {
  if (state === 'completed') {
    return (
      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#b22204] text-white shadow-sm">
        <ShipperIcon name="check" className="text-[14px]" />
      </div>
    )
  }

  if (state === 'current') {
    return (
      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#b22204] bg-white shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[#b22204]" />
      </div>
    )
  }

  return <div className="relative z-10 h-6 w-6 rounded-full border-2 border-[#e3e2e2] bg-white" />
}

export default function ShipperShipmentDetailPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [result, setResult] = useState(() => shipperService.getShipperShipmentById(currentUser, id))
  const [showStatusActions, setShowStatusActions] = useState(false)
  const [message, setMessage] = useState('')

  const shipment = result.success ? result.data : null

  const handleOpenUpdate = () => {
    setMessage('')

    if (!shipment?.nextStatuses?.length) {
      setMessage('Đơn giao này đã ở trạng thái cuối, không thể cập nhật tiếp.')
      return
    }

    if (shipment.nextStatuses.length === 1) {
      const nextStatus = shipment.nextStatuses[0]
      const confirmed = window.confirm(`Cập nhật trạng thái sang "${nextStatusLabels[nextStatus]}"?`)

      if (!confirmed) {
        return
      }

      const updateResult = shipperService.updateShipperShipmentStatus(currentUser, shipment.id, nextStatus)
      setResult(updateResult)
      setMessage(updateResult.success ? 'Đã cập nhật trạng thái giao hàng.' : updateResult.message)
      return
    }

    setShowStatusActions(true)
  }

  const handleStatusChange = (nextStatus) => {
    const confirmed = window.confirm(`Cập nhật trạng thái sang "${nextStatusLabels[nextStatus]}"?`)

    if (!confirmed) {
      return
    }

    const updateResult = shipperService.updateShipperShipmentStatus(currentUser, shipment.id, nextStatus)
    setResult(updateResult)
    setShowStatusActions(false)
    setMessage(updateResult.success ? 'Đã cập nhật trạng thái giao hàng.' : updateResult.message)
  }

  if (!shipment) {
    return (
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
            <ShipperIcon name="error" className="text-[24px]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1b1c1c]">Không thể mở chi tiết vận chuyển</h2>
          <p className="mt-2 text-sm text-[#5b403b]">{result.message || 'Không tìm thấy đơn giao phù hợp.'}</p>
          <Link
            to="/shipper/shipments"
            className="mt-5 inline-flex items-center justify-center rounded-lg border border-[#b22204] px-4 py-2 text-sm font-semibold text-[#b22204] transition hover:bg-[#ffdad3]"
          >
            Quay lại danh sách
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[32px] font-bold leading-tight text-[#1b1c1c]">#{shipment.id}</h2>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${shipment.statusMeta.className}`}>
              <ShipperIcon name={shipment.statusMeta.icon} className="text-[14px]" />
              {shipment.statusMeta.label}
            </span>
          </div>
          <p className="text-sm text-[#5b403b]">Mã đơn hàng: #{shipment.orderId}</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <Link
            to="/shipper/shipments"
            className="flex-1 rounded-lg border border-[#b22204] px-4 py-2 text-center text-sm font-semibold text-[#b22204] transition hover:bg-[#ffdad3] lg:flex-none"
          >
            Quay lại danh sách
          </Link>
          <button
            type="button"
            onClick={handleOpenUpdate}
            className="flex-1 rounded-lg bg-[#b22204] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
            disabled={!shipment.nextStatuses.length}
          >
            Cập nhật trạng thái
          </button>
        </div>
      </div>

      {showStatusActions ? (
        <div className="rounded-xl border border-[#e3beb6] bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-[#1b1c1c]">Chọn trạng thái mới</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {shipment.nextStatuses.map((nextStatus) => (
              <button
                key={nextStatus}
                type="button"
                onClick={() => handleStatusChange(nextStatus)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#e3beb6] px-4 py-3 text-sm font-semibold text-[#1b1c1c] transition hover:border-[#b22204] hover:bg-[#ffdad3]"
              >
                <ShipperIcon name={nextStatus === 'FAILED' ? 'error' : nextStatus === 'DELIVERED' ? 'check_circle' : 'local_shipping'} className="text-[20px] text-[#b22204]" />
                {nextStatusLabels[nextStatus]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-[#e3beb6] bg-[#f5f3f3] px-4 py-3 text-sm font-semibold text-[#5b403b]">
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <section className="rounded-xl border border-[#efeded] bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-[#e3beb6] pb-3 text-xl font-semibold text-[#1b1c1c]">Timeline giao hàng</h3>
            <div className="relative">
              {shipment.timeline.map((event, index) => (
                <div key={event.status} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < shipment.timeline.length - 1 ? (
                    <span className={`absolute left-[11px] top-6 h-full w-0.5 ${event.state === 'pending' ? 'bg-[#e3e2e2]' : 'bg-[#b22204]'}`} />
                  ) : null}
                  <TimelineDot state={event.state} />
                  <div className="pt-0.5">
                    <p className={`text-sm font-semibold ${event.state === 'current' ? 'text-[#b22204]' : event.state === 'pending' ? 'text-[#8f7069]' : 'text-[#1b1c1c]'}`}>
                      {event.label}
                    </p>
                    <p className="mt-1 text-xs text-[#5b403b]">
                      {event.time} · {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#efeded] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#e3beb6] pb-3">
              <h3 className="text-xl font-semibold text-[#1b1c1c]">Sản phẩm trong đơn</h3>
              <span className="text-xs font-semibold text-[#5b403b]">{shipment.items.length} sản phẩm</span>
            </div>

            <div className="flex flex-col gap-3">
              {shipment.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg p-2 transition hover:bg-[#f5f3f3]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-[#e3beb6] bg-[#f5f3f3] text-[#5b403b]">
                    <ShipperIcon name="devices" className="text-[28px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1b1c1c]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#5b403b]">SKU: {item.sku}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1b1c1c]">x{item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[#e3beb6] bg-[#f5f3f3] p-3">
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-[#1b1c1c]">
                <ShipperIcon name="speaker_notes" className="text-[16px]" />
                Ghi chú giao hàng:
              </p>
              <p className="text-sm italic text-[#5b403b]">{shipment.deliveryNote}</p>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="relative overflow-hidden rounded-xl border border-[#efeded] bg-white p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-[#ffdad3] opacity-60" />
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
              <ShipperIcon name="person_pin_circle" className="text-[22px] text-[#b22204]" />
              Người nhận
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-[#5b403b]">Họ tên</p>
                <p className="font-semibold text-[#1b1c1c]">{shipment.receiverName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#5b403b]">Số điện thoại</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-semibold text-[#1b1c1c]">{shipment.receiverPhone}</p>
                  <button type="button" className="rounded-full p-1 text-[#b22204] transition hover:bg-[#ffdad3]" aria-label="Gọi người nhận">
                    <ShipperIcon name="call" className="text-[18px]" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#5b403b]">Địa chỉ</p>
                <p className="font-medium text-[#1b1c1c]">{shipment.receiverAddress}</p>
              </div>
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#8f7069] py-2 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#f5f3f3]">
                <ShipperIcon name="map" className="text-[18px]" />
                Mở bản đồ
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[#efeded] bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#1b1c1c]">
              <ShipperIcon name="storefront" className="text-[22px] text-[#5b403b]" />
              Người gửi
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e3e2e2] text-[#1b1c1c]">
                  <ShipperIcon name="devices" className="text-[22px]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5b403b]">Tên shop</p>
                  <p className="font-semibold text-[#1b1c1c]">{shipment.sender.shopName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#5b403b]">Liên hệ</p>
                <p className="font-medium text-[#1b1c1c]">
                  {shipment.sender.contactName} ({shipment.sender.contactPhone})
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#5b403b]">Địa chỉ kho</p>
                <p className="font-medium text-[#1b1c1c]">{shipment.sender.address}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
