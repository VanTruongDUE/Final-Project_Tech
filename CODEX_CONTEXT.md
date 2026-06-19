# CODEX_CONTEXT.md

## 1. Tổng quan dự án

Tên dự án: **TechTonic Commerce**

Đây là frontend cho dự án sàn thương mại điện tử đa ngành của Nhóm 2.

Mục tiêu dự án:

* Xây dựng sàn thương mại điện tử đa ngành.
* Có nhiều vai trò: CUSTOMER, SELLER, ADMIN, SHIPPER.
* Hoàn thiện các chức năng chính: xác thực, phân quyền, sản phẩm, giỏ hàng, thanh toán, đơn hàng, đánh giá, nhắn tin shop, quản lý seller, doanh thu/thống kê.

Công nghệ frontend:

* ReactJS
* JavaScript
* Tailwind CSS
* React Router
* Không dùng TypeScript
* Không dùng Redux
* Không dùng Bootstrap
* Không dùng MUI
* Không dùng Ant Design

Backend/API:

* Backend Node.js sẽ tích hợp sau.
* Database dự án là SQL Server, nhưng frontend hiện chưa kết nối database trực tiếp.
* Hiện tại frontend dùng mock data, localStorage và service layer.
* Không gọi API thật nếu task chưa yêu cầu.

---

## 2. Quy tắc quan trọng nhất về UI

**Không được tự thiết kế UI mới.**

Dự án đã có thư mục:

```txt
UI-Flow
```

Đây là nguồn UI bắt buộc.

Khi code hoặc sửa UI:

* Phải tìm màn tương ứng trong `UI-Flow` trước.
* Phải bám layout, màu sắc, spacing, typography, card, table, form, button, sidebar, topbar, header, footer trong UI-Flow.
* Tailwind CSS chỉ dùng để chuyển UI-Flow thành React component.
* Không tự sáng tạo theme mới.
* Không tự thêm block/card/section ngoài UI-Flow.
* Không tự tạo layout khác nếu UI-Flow đã có layout rõ.
* Nếu không tìm thấy UI-Flow phù hợp, phải dừng và báo lại.
* Không được tự dựng giao diện thay thế theo suy đoán.
* Text tiếng Việt phải đúng dấu, UTF-8.
* Không để lỗi mã hóa tiếng Việt.
* Không để icon render thành chữ thô như:

  * `calendar_today`
  * `shopping_cart`
  * `chevron_right`
  * `notifications`
  * `inventory_2`
  * `analytics`

Nếu cần sửa UI, phải báo rõ:

* Route/page nào.
* UI-Flow path đã dùng.
* File đã sửa.
* Đã sửa gì.
* Còn lệch gì so với UI-Flow không.

---

## 3. Quy tắc code chung

Không được làm ngoài phạm vi task.

Không được:

* Không thêm package mới nếu chưa được yêu cầu.
* Không gọi API thật.
* Không sửa `AuthContext` hoặc `ProtectedRoute` nếu không có bug rõ.
* Không sửa Buyer khi đang làm Seller, trừ khi task yêu cầu.
* Không sửa Admin/Shipper khi đang làm Seller, trừ khi task yêu cầu.
* Không sửa service không liên quan.
* Không xóa route/file nếu chưa hiểu tác động.
* Không rewrite toàn bộ project.
* Không đổi flow đã test ổn.

Sau mỗi lần sửa code, phải chạy:

```bash
npm run lint
npm run build
```

Báo cáo ngắn:

* File đã sửa/tạo.
* UI-Flow path đã dùng.
* Lỗi đã sửa hoặc chức năng đã làm.
* Có đổi logic không.
* Có ảnh hưởng Buyer/Auth/ProtectedRoute không.
* Phần nào vẫn mock.
* `npm run lint`: pass/fail.
* `npm run build`: pass/fail.
* Việc nên làm tiếp theo.

---

## 4. Tài khoản mock

Các tài khoản test chính:

```txt
customer@techtonic.vn / 123456 / CUSTOMER
seller@techtonic.vn / 123456 / SELLER
admin@techtonic.vn / 123456 / ADMIN
shipper@techtonic.vn / 123456 / SHIPPER
```

Redirect theo role:

* CUSTOMER → `/`
* SELLER → `/seller/dashboard`
* ADMIN → `/admin/dashboard`
* SHIPPER → `/shipper/dashboard`

---

## 5. Auth đã có

Các route Auth:

* `/login`
* `/register`
* `/forgot-password`
* `/verify-otp`
* `/reset-password`

Đã có:

* Login mock theo role.
* Logout.
* AuthContext.
* ProtectedRoute.
* Role redirect.
* Register mock.
* Forgot password mock.
* Verify OTP mock.
* Reset password mock.
* Password override cho mock user nếu reset password.

Không sửa Auth nếu không có task hoặc bug rõ.

---

## 6. Buyer/Public đã có

Buyer/Public đã tương đối ổn, chỉ sửa nếu có bug rõ hoặc có task cụ thể.

Các route:

* `/`
* `/products`
* `/products/:id`
* `/cart`
* `/checkout`
* `/orders`
* `/orders/:id`
* `/messages`
* `/messages/:conversationId`
* `/profile` nếu đã có trong repo

Đã có:

* Trang chủ marketplace.
* Danh sách sản phẩm.
* Search/filter/sort sản phẩm.
* Chi tiết sản phẩm.
* Thêm vào giỏ hàng.
* Mua ngay.
* Cart bằng localStorage.
* Checkout mock.
* Tạo đơn hàng mock.
* Lịch sử đơn hàng.
* Chi tiết đơn hàng.
* Hủy đơn PENDING.
* Đánh giá sản phẩm khi đơn COMPLETED.
* Nhắn tin shop từ ProductDetailPage.
* Liên hệ shop từ OrderDetailPage.
* Danh sách hội thoại Buyer.
* Chi tiết hội thoại Buyer.
* Gửi tin nhắn và lưu localStorage.

Các service liên quan:

* `productService`
* `cartService`
* `orderService`
* `reviewService`
* `conversationService`

Buyer UI đã polish nhiều vòng:

* `/products` bám `buyer_danh_sach_san_pham`.
* `/messages` bám `buyer_tin_nhan_techtonic`.
* `/checkout` bám `buyer_thanh_toan_techtonic_optimized`.
* `/products/:id` đủ dùng cho demo.

---

## 7. Seller hiện tại

Seller là phần đang tiếp tục phát triển.

Các route Seller:

* `/seller/dashboard`
* `/seller/products`
* `/seller/orders`
* `/seller/revenue`
* `/seller/messages` nếu đã làm hoặc chuẩn bị làm

UI-Flow Seller đã map:

* `/seller/dashboard` → `UI-Flow/seller_dashboard_tong_quan_optimized_2`
* `/seller/products` → `UI-Flow/seller_danh_sach_san_pham`
* `/seller/orders` → `UI-Flow/seller_danh_sach_don_hang`
* `/seller/revenue` → `UI-Flow/seller_bao_cao_doanh_thu`

Seller đã làm:

* SellerLayout.
* Seller Dashboard.
* Seller Products.
* Seller Orders.
* Cập nhật trạng thái đơn hàng.
* Seller Revenue/Báo cáo doanh thu.
* sellerService mock.

Seller đã xử lý các lỗi:

* Không còn dùng `PagePlaceholder`/`RoleLayoutShell` generic cho các màn Seller đã làm.
* `/seller/products` không còn sai màn chọn phân loại sản phẩm.
* Icon Seller không render thành chữ raw.
* Text tiếng Việt trong Seller đã được sửa UTF-8.
* Seller orders đã scope theo store.
* Seller revenue đã scope theo store.
* Pagination orders đã sửa để không hiển thị nhiều trang giả khi filter ít kết quả.

Các quy tắc Seller service:

* Seller chỉ thấy dữ liệu thuộc shop/store của mình.
* Nếu mock user chưa có storeId, dùng mapping tạm trong `sellerService`.
* Dữ liệu mock phải phục vụ FE demo, không gọi API thật.
* Không để seller xem toàn bộ dữ liệu toàn sàn.

---

## 8. Seller order status flow

Các trạng thái đơn hàng raw status:

```txt
PENDING
CONFIRMED
PROCESSING
PACKING
SHIPPING
COMPLETED
CANCELLED
```

Label tiếng Việt:

* PENDING → Chờ xác nhận
* CONFIRMED → Đã xác nhận
* PROCESSING → Đang xử lý
* PACKING → Đang đóng gói
* SHIPPING → Đang giao
* COMPLETED → Hoàn thành
* CANCELLED → Đã hủy

Transition hợp lệ:

* PENDING → CONFIRMED hoặc CANCELLED
* CONFIRMED → PROCESSING
* PROCESSING → PACKING
* PACKING → SHIPPING
* SHIPPING → COMPLETED
* COMPLETED không đổi tiếp
* CANCELLED không đổi tiếp

Seller chỉ được update đơn thuộc store của mình.

---

## 9. Seller Revenue

Route:

* `/seller/revenue`

UI-Flow:

```txt
UI-Flow/seller_bao_cao_doanh_thu
```

Yêu cầu:

* Không dùng chart package mới.
* Nếu cần chart, dựng bằng SVG/div/Tailwind.
* Chỉ tính doanh thu từ đơn thuộc store seller.
* Thường chỉ tính đơn COMPLETED hoặc logic hợp lý đã có trong sellerService.
* Không để seller xem doanh thu toàn sàn.

---

## 10. Phần còn cần làm tiếp

Ưu tiên tiếp theo sau Seller Revenue:

### Seller Sprint tiếp theo

1. Seller Inbox / Seller Messages

   * Route đề xuất:

     * `/seller/messages`
     * `/seller/messages/:conversationId`
   * Dùng conversationService/localStorage.
   * Seller chỉ thấy hội thoại thuộc store của mình.
   * Seller có thể trả lời Buyer.
   * Message seller có senderRole là `SELLER` hoặc `SHOP`.
   * UI phải bám UI-Flow liên quan như:

     * `contact_seller`
     * `seller_tin_nhan`
     * `seller_chat`
     * `seller_inbox`
     * `message`
     * `conversation`
   * Nếu không tìm thấy UI-Flow phù hợp, dừng và báo.

2. Sau Seller Inbox, chuyển sang Admin UI.

### Admin cần làm sau

Các route Admin:

* `/admin/dashboard`
* `/admin/users`
* `/admin/stores`
* `/admin/orders`
* `/admin/statistics`

Admin hiện chưa ưu tiên, có thể còn placeholder/generic. Khi làm Admin phải map UI-Flow trước, không tự thiết kế.

### Shipper cần làm sau

Các route Shipper:

* `/shipper/dashboard`
* `/shipper/shipments`
* `/shipper/shipments/:id`

Shipper là role phụ, làm sau Admin/Seller core nếu còn thời gian.

---

## 11. Quy tắc responsive/layout

UI phải hợp lý trên desktop:

* Không horizontal scroll toàn trang.
* Main content dùng `w-full`, `min-w-0`, `flex-1` nếu nằm cạnh sidebar.
* Không dùng width cố định lớn gây vỡ layout.
* Card/table/grid phải co giãn theo desktop.
* Table nhiều cột phải nằm trong card có `overflow-x-auto`.
* Sidebar có thể cố định nếu UI-Flow có sidebar.
* Nên kiểm tra desktop width:

  * 1366px
  * 1440px
  * 1536px
  * 1920px

---

## 12. Quy tắc icon

Nếu UI-Flow dùng Material Symbols:

* Không để icon name hiện thành chữ thô.
* Không để `calendar_today`, `notifications`, `shopping_cart`, `chevron_right` xuất hiện trực tiếp trên UI.
* Dùng component icon thống nhất hoặc class Material Symbols đúng.
* Nếu không dùng font ngoài, dùng icon component/SVG nội bộ.

---

## 13. Khi bắt đầu task mới

Trước khi code:

1. Đọc task.
2. Đọc file liên quan trong repo.
3. Xác nhận UI-Flow path nếu task liên quan UI.
4. Không sửa ngoài phạm vi.
5. Nếu không chắc, báo lại thay vì tự suy đoán.

Prompt ngắn mẫu:

```txt
Đọc CODEX_CONTEXT.md trước.

Task: [mô tả task]
Phạm vi sửa: [file/route]
Không sửa: [phần cấm]
UI-Flow bắt buộc: [path nếu có]
Sau khi sửa chạy npm run lint và npm run build.
Báo cáo ngắn.
```

---



Mục tiêu:

* Seller xem danh sách hội thoại với Buyer.
* Seller mở hội thoại chi tiết.
* Seller gửi tin nhắn.
* Tin nhắn lưu localStorage.
* Buyer nhìn thấy tin nhắn Seller trong `/messages/:conversationId`.
* Seller chỉ thấy conversation thuộc store của mình.
* Không gọi API thật.
* UI phải bám UI-Flow. Nếu không tìm thấy UI-Flow phù hợp thì dừng và báo.
