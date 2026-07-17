# CODEX_CONTEXT.md

## Baseline kỹ thuật

- Frontend: React 19, React Router, Vite 6.
- Backend thật: Flask/Python, không phải Node.js.
- Database: SQL Server qua Flask-SQLAlchemy/PyODBC.
- API prefix: `/api/v1`; mode tích hợp dùng `VITE_DATA_SOURCE=api`.
- Role canonical: `CUSTOMER`, `SELLER`, `ADMIN`, `SHIPPER`.
- Sai lệch Flask so với yêu cầu Node.js ban đầu cần nhóm/giảng viên xác nhận trước freeze.

## Contract core đã nối

- Account: `/users/me`; address: `/me/addresses`.
- Product detail/list trả SKU và variants; cart/order gửi `variant_id`, order giữ snapshot.
- Voucher check/checkout/snapshot/reversal dùng backend.
- Review create/public list/Admin hide; không có unhide.
- Conversation/message cho Customer và Seller, ownership ở backend.
- Seller products/orders/revenue/settings dùng API thật.
- Admin users/stores/orders/reports/reviews dùng API thật trong module đã hoàn tất.
- Shipper list/detail/status có ownership và state transition.

## Quy tắc phát triển

- Không invent field hoặc persistence localStorage khi backend chưa có contract.
- Không hard-code ID, token, credential, report date hoặc business totals.
- Backend là nguồn authoritative cho stock, price, discount, total, role và ownership.
- Không đưa JWT/database/AI key vào `VITE_*`; mọi Vite variable xuất hiện trong browser bundle.
- Giữ loading/error/empty state ở mọi trang API.
- Chạy `npm run lint`, `npm run build`, API-mode build và backend smoke trước baseline.

## Giới hạn còn lại

- Browser regression chưa có báo cáo PASS.
- Seller promotion/inventory và một số Admin demo module ngoài core vẫn có mock/localStorage.
- Bundle chính còn warning kích thước lớn.
- Root Git chưa hợp lệ; `FE/.git` là repository lồng cần hợp nhất an toàn.
- AI chưa tích hợp; chỉ bắt đầu sau khi Core Freeze gate đạt.
