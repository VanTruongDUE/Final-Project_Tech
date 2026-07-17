# File config/settings.py này chứa cấu hình cho ứng dụng Flask, đặc biệt là cấu hình kết nối cơ sở dữ liệu SQL Server.
# Import các thư viện cần thiết
import os
import warnings
# Operating System (OS) module để làm việc với các biến môi trường
from dotenv import load_dotenv
# Tải các biến môi trường từ file .env

load_dotenv()


def _is_enabled(name):
    return os.getenv(name, "").strip().lower() in {"1", "true", "yes", "on"}


database_url = os.getenv("DATABASE_URL")
jwt_secret = os.getenv("JWT_SECRET_KEY")

if jwt_secret and len(jwt_secret) < 32:
    warnings.warn(
        "JWT_SECRET_KEY is shorter than 32 characters; use a strong random secret before deployment.",
        RuntimeWarning,
        stacklevel=2,
    )

class Config:
    # Flask-SQLAlchemy expects the key `SQLALCHEMY_DATABASE_URI` (not "_URL").
    SQLALCHEMY_DATABASE_URI = database_url
    # Với module dotenv thì đã truy cập vào file .env
    # rồi sau đó lấy module os với method getenv để lấy giá trị của biến môi trường DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Tắt tính năng theo dõi các thay đổi của SQLAlchemy để tiết kiệm tài nguyên
    JWT_SECRET_KEY = jwt_secret
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = _is_enabled("FLASK_DEBUG")
    ENVIRONMENT = os.getenv("FLASK_ENV", "production").strip().lower()
    ENABLE_DEV_OTP = ENVIRONMENT == "development" and _is_enabled("ENABLE_DEV_OTP")
    
    
