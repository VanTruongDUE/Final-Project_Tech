# DEMO CHECKLIST - TechTonic Commerce

Tài liệu này dùng để nhóm đi theo khi demo frontend TechTonic Commerce. Dữ liệu hiện tại là mock/localStorage, chưa gọi API thật và chưa kết nối backend/database.

## 1. Tài khoản test

| Role | Email | Mật khẩu | Trang sau đăng nhập |
| --- | --- | --- | --- |
| CUSTOMER | `customer@techtonic.vn` | `123456` | `/` |
| SELLER | `seller@techtonic.vn` | `123456` | `/seller/dashboard` |
| ADMIN | `admin@techtonic.vn` | `123456` | `/admin/dashboard` |
| SHIPPER | `shipper@techtonic.vn` | `123456` | `/shipper/dashboard` |

## 2. Thứ tự demo đề xuất

- [ ] Giới thiệu ngắn: TechTonic Commerce là frontend sàn thương mại điện tử nhiều vai trò.
- [ ] Demo Public/Buyer: xem sản phẩm, chi tiết sản phẩm, giỏ hàng, checkout, đơn hàng, tin nhắn shop.
- [ ] Demo Seller: dashboard, sản phẩm, đơn hàng, doanh thu, tin nhắn với buyer.
- [ ] Demo Admin: dashboard toàn sàn, quản lý users/stores/orders, thống kê.
- [ ] Demo Shipper: dashboard giao hàng, danh sách đơn được giao, chi tiết và cập nhật trạng thái.
- [ ] Nhấn mạnh phân quyền: mỗi role chỉ vào được khu vực phù hợp.
- [ ] Nhấn mạnh dữ liệu demo hiện là mock/localStorage, backend sẽ tích hợp sau.

## 3. Checklist demo Buyer

- [ ] Mở `/`.
- [ ] Mở `/products`.
- [ ] Tìm kiếm/lọc/sắp xếp sản phẩm nếu cần.
- [ ] Mở `/products/:id`.
- [ ] Thêm sản phẩm vào giỏ hàng.
- [ ] Mở `/cart`.
- [ ] Kiểm tra số lượng/sản phẩm trong giỏ.
- [ ] Mở `/checkout`.
- [ ] Điền hoặc kiểm tra thông tin thanh toán mock.
- [ ] Tạo đơn hàng mock.
- [ ] Mở `/orders`.
- [ ] Mở `/orders/:id`.
- [ ] Nếu đơn phù hợp, thử hủy đơn PENDING hoặc đánh giá đơn COMPLETED.
- [ ] Từ sản phẩm hoặc đơn hàng, mở nhắn tin với shop.
- [ ] Mở `/messages`.
- [ ] Mở `/messages/:conversationId`.
- [ ] Gửi tin nhắn buyer và kiểm tra tin nhắn được lưu localStorage.

## 4. Checklist demo Seller

- [ ] Đăng nhập `seller@techtonic.vn / 123456`.
- [ ] Xác nhận vào `/seller/dashboard`.
- [ ] Xem KPI/dashboard của seller.
- [ ] Mở `/seller/products`.
- [ ] Kiểm tra danh sách sản phẩm thuộc shop seller.
- [ ] Mở `/seller/orders`.
- [ ] Xác nhận seller chỉ thấy đơn thuộc store của mình.
- [ ] Cập nhật trạng thái đơn hàng hợp lệ bằng mock/localStorage.
- [ ] Mở `/seller/revenue`.
- [ ] Xác nhận doanh thu được tính theo store seller, không phải toàn sàn.
- [ ] Mở `/seller/messages`.
- [ ] Mở `/seller/messages/:conversationId`.
- [ ] Seller trả lời tin nhắn buyer.
- [ ] Quay lại Buyer để xác nhận buyer thấy tin nhắn seller nếu cần.

## 5. Checklist demo Admin

- [ ] Đăng nhập `admin@techtonic.vn / 123456`.
- [ ] Xác nhận vào `/admin/dashboard`.
- [ ] Xem dashboard toàn sàn: người dùng, cửa hàng, đơn hàng, doanh thu.
- [ ] Mở `/admin/users`.
- [ ] Search/filter danh sách tài khoản.
- [ ] Khóa/mở khóa user bằng mock/localStorage nếu demo cần.
- [ ] Mở `/admin/stores`.
- [ ] Search/filter danh sách cửa hàng.
- [ ] Duyệt/khóa/mở khóa cửa hàng bằng mock/localStorage nếu demo cần.
- [ ] Mở `/admin/orders`.
- [ ] Search/filter đơn hàng toàn sàn.
- [ ] Cập nhật trạng thái đơn bằng mock/localStorage nếu demo cần.
- [ ] Mở `/admin/statistics`.
- [ ] Xem 4 KPI chính.
- [ ] Xem doanh thu theo thời gian.
- [ ] Xem hiệu suất cửa hàng.
- [ ] Nhấn mạnh `/admin/statistics` không thêm section ngoài UI-Flow chính.

## 6. Checklist demo Shipper

- [ ] Đăng nhập `shipper@techtonic.vn / 123456`.
- [ ] Xác nhận vào `/shipper/dashboard`.
- [ ] Xem KPI giao hàng và danh sách đơn gần đây.
- [ ] Mở `/shipper/shipments`.
- [ ] Search/filter danh sách đơn được giao.
- [ ] Xác nhận shipper chỉ thấy shipment thuộc mình.
- [ ] Bấm "Xem chi tiết" để mở `/shipper/shipments/:id`.
- [ ] Xem mã vận chuyển/đơn hàng, trạng thái, timeline, người nhận, người gửi, sản phẩm, ghi chú giao hàng.
- [ ] Cập nhật trạng thái shipment hợp lệ.
- [ ] Refresh trang và kiểm tra trạng thái vẫn giữ nhờ localStorage.
- [ ] Thử mở shipment không thuộc shipper hiện tại nếu cần, hệ thống phải hiển thị lỗi thân thiện.

## 7. Lưu ý trước demo

- [ ] Chạy project ở môi trường local ổn định.
- [ ] Dọn localStorage nếu muốn demo từ dữ liệu mặc định.
- [ ] Nếu muốn giữ trạng thái đã update, không clear localStorage.
- [ ] Chuẩn bị sẵn các URL chính để tránh mất thời gian gõ.
- [ ] Dùng trình duyệt desktop ở độ rộng khoảng 1366px trở lên.
- [ ] Kiểm tra font/icon Material Symbols đã load để icon không hiện thành raw text.
- [ ] Không nhập dữ liệu thật hoặc thông tin nhạy cảm vì đây là frontend mock.

## 8. Lỗi/giới hạn hiện tại cần nói rõ

- [ ] Frontend hiện dùng mock data, service layer và localStorage.
- [ ] Chưa gọi API thật.
- [ ] Chưa kết nối backend Node.js.
- [ ] Chưa kết nối SQL Server trực tiếp.
- [ ] Các thao tác checkout, cập nhật trạng thái, quản lý user/store/order, nhắn tin đều là demo bằng localStorage/mock.
- [ ] Cập nhật trạng thái của Seller/Shipper chưa đồng bộ thật với backend.
- [ ] Admin quản lý toàn sàn là dữ liệu mock phục vụ frontend demo.
- [ ] Route không tồn tại đang redirect về `/`, chưa có trang 404 riêng.
- [ ] Build hiện có thể cảnh báo chunk size lớn của Vite, nhưng không làm fail build.

## 9. Lệnh chạy project

```bash
npm install
npm run dev
```

Sau đó mở URL do Vite hiển thị, thường là:

```txt
http://localhost:5173
```

## 10. Lệnh kiểm tra lint/build

```bash
npm run lint
npm run build
```

Nếu dùng PowerShell trên Windows bị chặn `npm.ps1`, có thể chạy:

```bash
npm.cmd run lint
npm.cmd run build
```
