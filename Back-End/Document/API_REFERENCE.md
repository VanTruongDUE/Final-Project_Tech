# TechTonic API Reference

Base URL: `http://localhost:5000/api/v1`. Backend: Flask/Python + SQL Server. Auth dùng `Authorization: Bearer <access_token>`.

Response dùng JSON với `success`; lỗi authorization trả 401 (thiếu/sai token) hoặc 403 (sai role). Tiền được backend tính từ database; client không phải nguồn authoritative.

## Public và Auth

| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/roles` | Bốn role core |
| GET | `/categories`, `/categories/:id` | Category tree/detail |
| GET | `/products`, `/products/:id` | List/detail có default variant, SKU và variants |
| GET | `/products/:id/reviews` | Chỉ review `VISIBLE` |
| GET | `/stores/:id` | Store public |
| POST | `/auth/register` | Đăng ký Customer |
| POST | `/auth/login` | Access + refresh token |
| POST | `/auth/refresh-token`, `/auth/logout` | Rotation/revoke |
| POST | `/auth/forgot-password`, `/auth/reset-password` | OTP chỉ lộ khi bật explicit dev flag |

## Customer

| Method | Endpoint | Ghi chú |
|---|---|---|
| GET/PATCH | `/users/me` | Hồ sơ hiện tại |
| PATCH | `/users/me/password` | Đổi mật khẩu |
| GET/POST | `/me/addresses` | Danh sách/tạo địa chỉ |
| PATCH/PUT/DELETE | `/me/addresses/:id` | Sửa/xóa địa chỉ sở hữu |
| PATCH | `/me/addresses/:id/default` | Đặt mặc định |
| GET/POST | `/me/store-application` | Xem/gửi một hồ sơ Seller; tạo store `PENDING`, owner lấy từ JWT |
| GET/DELETE | `/cart` | Xem/xóa giỏ |
| POST | `/cart/items` | Bắt buộc product; hỗ trợ `variant_id` |
| PATCH/DELETE | `/cart/items/:id` | Sửa số lượng/xóa dòng SKU |
| POST/GET | `/orders` | Tạo/list đơn |
| GET | `/orders/:id` | Detail có SKU/variant và voucher snapshot |
| POST | `/orders/:id/cancel` | Hủy, hoàn stock và reverse voucher |
| GET | `/vouchers/check` | Query `code`, `order_amount`, `store_id` |
| POST | `/reviews` | Review order item đã completed |
| GET/POST | `/conversations` | List/tạo conversation |
| GET/POST | `/conversations/:id/messages` | List/gửi message |
| PATCH | `/conversations/:id/read` | Mark read |
| GET | `/shipments/:orderId` | Theo dõi shipment thuộc customer |

## Seller

| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/seller/products` | Product/SKU của store owner |
| GET | `/seller/products/generate-sku` | Gợi ý SKU |
| POST | `/products` | Tạo product và variants |
| PATCH/DELETE | `/products/:id` | Sửa/soft-delete product sở hữu |
| PATCH | `/seller/products/:product_id/variants/:variant_id` | Sửa variant sở hữu |
| GET | `/seller/orders` | Store orders |
| GET | `/seller/orders/:id` | Detail snapshot SKU/variant |
| PATCH | `/orders/:id/status` | State transition Seller |
| GET | `/orders/:id/history` | Lịch sử trạng thái |
| POST | `/:order_id/shipments` | Tạo shipment (route legacy hiện tại) |
| GET | `/seller/revenue` | `from_date`, `to_date`, optional `group_by`, `limit` |
| GET/PATCH | `/seller/store` | Settings store owner, field whitelist |
| POST | `/vouchers` | Tạo voucher store |
| PATCH | `/vouchers/:id` | Cập nhật status voucher sở hữu |

## Admin

| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/admin/users`, `/admin/stores`, `/admin/orders` | Danh sách quản trị |
| PATCH | `/admin/users/:id/status`, `/admin/stores/:id/status` | Cập nhật status; duyệt store `ACTIVE` đồng thời cấp `SELLER` cho owner |
| POST/DELETE | `/admin/users/:id/roles`, `/admin/users/:id/roles/:role_id` | Gán/thu hồi role; cấm Admin tự gán role |
| GET | `/admin/revenue` | Báo cáo revenue legacy |
| GET | `/admin/reports` | Overview, status, trend, store, top SKU |
| GET | `/admin/reviews` | Filter `VISIBLE|HIDDEN`, pagination |
| PATCH | `/reviews/:id/hide` | Hide; không có unhide |
| POST | `/admin/shipments/:order_id/assign` | Assign shipper |
| POST/PATCH/DELETE | `/admin/roles`, `/admin/roles/:id` | Quản lý role |

## Shipper

| Method | Endpoint | Ghi chú |
|---|---|---|
| GET | `/shipper/shipments` | Chỉ shipment được assign |
| PATCH | `/shipper/shipments/:id/status` | Ownership + transition validation |

Date report dùng `YYYY-MM-DD`; `to_date` inclusive theo ngày. Revenue chỉ cộng order `COMPLETED`. Seller/Admin report group `day|week|month`, limit 1..100.
