import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/common/PagePlaceholder'

export default function ShipperShipmentDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Shipper"
      title={`Shipper - Chi tiet van chuyen #${id}`}
      description="Trang chi tiet don giao cho shipper dang dung route dong, chua ket noi API hay mock data chi tiet."
    />
  )
}
