# TechTonic Commerce - Frontend

React/Vite frontend cho TechTonic commerce với bốn role `CUSTOMER`, `SELLER`, `ADMIN`, `SHIPPER`. Backend thực tế là Flask/Python + SQL Server tại `/api/v1`, không phải Node.js. Sai lệch với yêu cầu kiến trúc ban đầu cần nhóm/giảng viên xác nhận trước Core Freeze.

## Cài đặt và chạy

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

`.env` local:

```dotenv
VITE_API_BASE_URL=/api/v1
VITE_DATA_SOURCE=api
```

Không đưa database credential, JWT secret, AI/API provider key hoặc secret bất kỳ vào `VITE_*`; Vite nhúng các giá trị này vào browser bundle.

## Core API đang dùng

- Account `/users/me`, address `/me/addresses`.
- Product SKU/Variant xuyên product detail, cart và order snapshot.
- Voucher check/checkout và snapshot/reversal.
- Review create/list và Admin moderation hide.
- Conversation/message Customer–Seller.
- Seller product/order/revenue/store settings.
- Admin users/stores/orders/dashboard/reports/reviews.
- Shipper shipment ownership/status.

Một số module ngoài core như Seller promotion/inventory và Admin presentation demo vẫn có thể chứa mock/localStorage; không dùng chúng để tuyên bố core API đã pass.

## Route UI chính

- Public/Customer: `/`, `/products`, `/products/:id`, `/cart`, `/checkout`, `/profile`, `/orders`, `/messages`.
- Seller: `/seller/dashboard`, `/seller/products`, `/seller/orders`, `/seller/revenue`, `/seller/settings`, `/seller/messages`.
- Admin: `/admin/dashboard`, `/admin/users`, `/admin/stores`, `/admin/orders`, `/admin/statistics`, `/admin/reviews`.
- Shipper: `/shipper/dashboard`, `/shipper/shipments`.

Credential demo được quản lý ngoài repository. Không ghi password hoặc token vào README, source hay Postman.

## Quality gate

```powershell
npm run lint
npm run build
$env:VITE_DATA_SOURCE='api'; npm run build
```

Backend smoke (từ `BE`):

```powershell
python -m unittest -v tests.test_api_smoke
```

Xem thêm [CODEX_CONTEXT.md](CODEX_CONTEXT.md), [DEMO_CHECKLIST.md](DEMO_CHECKLIST.md) và [API reference](../BE/Document/API_REFERENCE.md).
