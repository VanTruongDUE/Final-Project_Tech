import { sellerService } from '../../services/sellerService'

export default function SellerProductStatusBadge({ status }) {
  const statusMeta = sellerService.getProductStatusMeta(status)

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
}
