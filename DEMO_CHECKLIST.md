# DEMO CHECKLIST - TechTonic

## Chuẩn bị

- [ ] Xác nhận SQL Server test đã backup và kết nối đúng database.
- [ ] Chuẩn bị riêng bốn tài khoản `CUSTOMER`, `SELLER`, `ADMIN`, `SHIPPER`; không commit password/token vào repository hoặc Postman.
- [ ] Backend `python app.py`; frontend `npm run dev`; `VITE_DATA_SOURCE=api`.
- [ ] Chạy `cd BE` và `python -m unittest -v tests.test_api_smoke`.
- [ ] Chạy frontend lint, build và API-mode build.
- [ ] Mở DevTools, theo dõi Console và Network; không dùng localStorage/mock để chứng minh core API.

## Customer

- [ ] Login, `/users/me`, xem/sửa profile.
- [ ] List/create/update/default address qua `/me/addresses`.
- [ ] Chọn hai SKU variants cùng product, xác nhận giá/SKU/stock và hai dòng cart.
- [ ] Apply/remove voucher; checkout; kiểm tra order snapshot và cancel.
- [ ] Tạo review từ completed order item.
- [ ] Tạo conversation, gửi message, reload vẫn thấy dữ liệu API.

## Seller

- [ ] Product list/detail/create/edit variant và SKU.
- [ ] Order list/detail có snapshot SKU/variant; transition hợp lệ.
- [ ] Revenue/statistics/top SKU theo date range thật.
- [ ] Store settings GET/PATCH và reload persisted.

## Admin

- [ ] Users, stores, orders đều tải API với ADMIN.
- [ ] Dashboard/reports khớp range, status, store performance và top SKU.
- [ ] Review moderation hide; public list loại review hidden; không có unhide.
- [ ] Assign shipment cho đúng Shipper nếu demo state cho phép.

## Shipper

- [ ] Chỉ thấy shipment được assign.
- [ ] Ownership sai trả 403; transition sai trả 400.
- [ ] Flow hợp lệ `ASSIGNED → PICKED_UP → SHIPPING → DELIVERED` và order thành `COMPLETED`.

## Gate sau demo

- [ ] Không có request core hợp lệ trả 500.
- [ ] Không có lỗi Console nghiêm trọng.
- [ ] DB integrity audit toàn bộ trả 0.
- [ ] Ghi riêng flow chưa test; không suy diễn browser PASS từ API/build.
