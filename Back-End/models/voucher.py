from extensions import db
from datetime import datetime


class Voucher(db.Model):
    __tablename__ = 'vouchers'

    voucher_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    voucher_code = db.Column(db.String(30), nullable=False, unique=True)
    voucher_name = db.Column(db.Unicode(150), nullable=False)
    # store_id = NULL → platform-wide voucher (Admin only); store_id != NULL → store voucher (Seller)
    store_id = db.Column(db.BigInteger, db.ForeignKey('stores.store_id'), nullable=True)
    created_by_user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id'), nullable=False)
    discount_type = db.Column(db.String(20), nullable=False)  # PERCENT | FIXED
    discount_value = db.Column(db.Numeric(18, 2), nullable=False)
    min_order_amount = db.Column(db.Numeric(18, 2), nullable=False, default=0)
    max_discount_amount = db.Column(db.Numeric(18, 2), nullable=True)
    usage_limit = db.Column(db.Integer, nullable=True)
    used_count = db.Column(db.Integer, nullable=False, default=0)
    usage_limit_per_customer = db.Column(db.Integer, nullable=False, default=1)
    starts_at = db.Column(db.DateTime, nullable=False)
    ends_at = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='ACTIVE')

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    order_applications = db.relationship('OrderVoucher', back_populates='voucher', lazy='select')

    @property
    def per_customer_limit(self):
        """Backward-compatible Python alias; this is not a database column."""
        return self.usage_limit_per_customer

    @per_customer_limit.setter
    def per_customer_limit(self, value):
        self.usage_limit_per_customer = value


class OrderVoucher(db.Model):
    __tablename__ = 'order_vouchers'

    order_voucher_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    order_id = db.Column(db.BigInteger, db.ForeignKey('orders.order_id'), nullable=False)
    voucher_id = db.Column(db.BigInteger, db.ForeignKey('vouchers.voucher_id'), nullable=False)
    voucher_code_snapshot = db.Column(db.String(30), nullable=False)
    discount_type_snapshot = db.Column(db.String(20), nullable=False)
    discount_value_snapshot = db.Column(db.Numeric(18, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(18, 2), nullable=False)
    application_status = db.Column(db.String(20), nullable=False, default='APPLIED')
    applied_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    reversed_at = db.Column(db.DateTime, nullable=True)
    reversed_reason = db.Column(db.Unicode(500), nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = db.relationship('Order', back_populates='voucher_applications')
    voucher = db.relationship('Voucher', back_populates='order_applications')
