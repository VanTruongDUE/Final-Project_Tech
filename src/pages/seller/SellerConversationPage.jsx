import { useParams } from 'react-router-dom'
import SellerMessagesWorkspace from '../../components/seller/SellerMessagesWorkspace'

export default function SellerConversationPage() {
  const { conversationId } = useParams()

  return <SellerMessagesWorkspace conversationId={conversationId} />
}
