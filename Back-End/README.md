# TechTonic Backend

Backend thực tế của TechTonic là Flask/Python, dùng Flask-SQLAlchemy và SQL Server qua PyODBC. API có prefix `/api/v1` và hỗ trợ bốn role: `CUSTOMER`, `SELLER`, `ADMIN`, `SHIPPER`.

> Sai lệch kiến trúc: một số yêu cầu ban đầu mô tả Node.js, nhưng source hiện tại là Flask. Nhóm dự án/giảng viên cần xác nhận Flask là baseline chính thức trước khi đóng băng repository.

## Thiết lập

1. Tạo virtual environment và cài `pip install -r requirement.txt`.
2. Copy `.env.example` thành `.env`, sau đó điền `DATABASE_URL` và `JWT_SECRET_KEY` riêng cho máy local.
3. Dùng JWT secret ngẫu nhiên dài ít nhất 32 ký tự. Không commit `.env` hoặc connection string.
4. Chạy `python app.py`.

`FLASK_DEBUG` mặc định tắt. OTP chỉ xuất hiện trong response khi đồng thời có `FLASK_ENV=development` và `ENABLE_DEV_OTP=true`; cờ OTP mặc định tắt. OTP, token và password không được log.

## Kiểm thử core

Lệnh duy nhất:

```powershell
python -m unittest -v tests.test_api_smoke
```

Suite dùng Flask test client và database cấu hình hiện tại. Fixture mới có prefix `CORE-FREEZE-`; cleanup có mục tiêu chạy trước/sau suite và khi setup lỗi. Suite tự tìm role/product/store/shipment theo contract, không phụ thuộc ID cứng và không in token/password.

Database integrity audit read-only:

```powershell
python -m tests.db_audit
```

Kiểm tra compile:

```powershell
python -m compileall -q .
```

## API

Contract đầy đủ: [Document/API_REFERENCE.md](Document/API_REFERENCE.md). Postman: [Document/TechTonic API.postman_collection.json](Document/TechTonic%20API.postman_collection.json).
