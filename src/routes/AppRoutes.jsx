import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../utils/roles'
import PublicLayout from '../layouts/PublicLayout'
import BuyerLayout from '../layouts/BuyerLayout'
import CheckoutLayout from '../layouts/CheckoutLayout'
import MarketplaceProtectedLayout from '../layouts/MarketplaceProtectedLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import ShipperLayout from '../layouts/ShipperLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/public/HomePage'
import ProductListPage from '../pages/public/ProductListPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import CartPage from '../pages/buyer/CartPage'
import CheckoutPage from '../pages/buyer/CheckoutPage'
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage'
import OrderDetailPage from '../pages/buyer/OrderDetailPage'
import BuyerMessagesPage from '../pages/buyer/BuyerMessagesPage'
import BuyerConversationPage from '../pages/buyer/BuyerConversationPage'
import BuyerAddressPage from '../pages/buyer/BuyerAddressPage'
import BuyerBankPage from '../pages/buyer/BuyerBankPage'
import BuyerChangePasswordPage from '../pages/buyer/BuyerChangePasswordPage'
import BuyerPrivacyPage from '../pages/buyer/BuyerPrivacyPage'
import BuyerPersonalInfoPage from '../pages/buyer/BuyerPersonalInfoPage'
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import SellerProductVariantCreatePage from '../pages/seller/SellerProductVariantCreatePage'
import SellerProductEditPage from '../pages/seller/SellerProductEditPage'
import SellerProductsPage from '../pages/seller/SellerProductsPage'
import SellerInventoryPage from '../pages/seller/SellerInventoryPage'
import SellerShippingPage from '../pages/seller/SellerShippingPage'
import SellerPromotionCreatePage from '../pages/seller/SellerPromotionCreatePage'
import SellerPromotionsPage from '../pages/seller/SellerPromotionsPage'
import SellerOrderDetailPage from '../pages/seller/SellerOrderDetailPage'
import SellerOrdersPage from '../pages/seller/SellerOrdersPage'
import SellerRevenuePage from '../pages/seller/SellerRevenuePage'
import SellerMessagesPage from '../pages/seller/SellerMessagesPage'
import SellerConversationPage from '../pages/seller/SellerConversationPage'
import SellerSettingsPage from '../pages/seller/SellerSettingsPage'
import SellerOnboardingPage from '../pages/seller/SellerOnboardingPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminStoresPage from '../pages/admin/AdminStoresPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminStatisticsPage from '../pages/admin/AdminStatisticsPage'
import AdminStoreApprovalsPage from '../pages/admin/AdminStoreApprovalsPage'
import AdminReportedProductsPage from '../pages/admin/AdminReportedProductsPage'
import AdminProductApprovalsPage from '../pages/admin/AdminProductApprovalsPage'
import AdminReviewsPage from '../pages/admin/AdminReviewsPage'
import ShipperDashboardPage from '../pages/shipper/ShipperDashboardPage'
import ShipperShipmentsPage from '../pages/shipper/ShipperShipmentsPage'
import ShipperShipmentDetailPage from '../pages/shipper/ShipperShipmentDetailPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SELLER]} />}>
        <Route path="/seller-onboarding" element={<SellerOnboardingPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SELLER]} />}>
        <Route element={<MarketplaceProtectedLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/messages" element={<BuyerMessagesPage />} />
          <Route path="/messages/:conversationId" element={<BuyerConversationPage />} />
        </Route>
        <Route element={<CheckoutLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route element={<BuyerLayout />}>
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SELLER, ROLES.ADMIN]} />}>
        <Route element={<BuyerLayout />}>
          <Route path="/profile" element={<BuyerPersonalInfoPage />} />
          <Route path="/profile/banks" element={<BuyerBankPage />} />
          <Route path="/profile/addresses" element={<BuyerAddressPage />} />
          <Route path="/profile/change-password" element={<BuyerChangePasswordPage />} />
          <Route path="/profile/privacy" element={<BuyerPrivacyPage />} />
          <Route path="/profile/personal-info" element={<Navigate to="/profile" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/products/new" element={<SellerProductVariantCreatePage />} />
          <Route path="/seller/products/:productId/edit" element={<SellerProductEditPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/inventory" element={<SellerInventoryPage />} />
          <Route path="/seller/shipping" element={<SellerShippingPage />} />
          <Route path="/seller/promotions/new" element={<SellerPromotionCreatePage />} />
          <Route path="/seller/promotions" element={<SellerPromotionsPage />} />
          <Route path="/seller/orders/:orderId" element={<SellerOrderDetailPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/revenue" element={<SellerRevenuePage />} />
          <Route path="/seller/messages" element={<SellerMessagesPage />} />
          <Route path="/seller/messages/:conversationId" element={<SellerConversationPage />} />
          <Route path="/seller/settings" element={<SellerSettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/stores" element={<AdminStoresPage />} />
          <Route path="/admin/store-approvals" element={<AdminStoreApprovalsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/reported-products" element={<AdminReportedProductsPage />} />
          <Route path="/admin/product-approvals" element={<AdminProductApprovalsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SHIPPER]} />}>
        <Route element={<ShipperLayout />}>
          <Route path="/shipper/dashboard" element={<ShipperDashboardPage />} />
          <Route path="/shipper/shipments" element={<ShipperShipmentsPage />} />
          <Route path="/shipper/shipments/:id" element={<ShipperShipmentDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
