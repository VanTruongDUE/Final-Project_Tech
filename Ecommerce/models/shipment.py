from extensions import db
from datetime import datetime


class Shipment(db.Model):
    __tablename__ = 'shipments'

    shipment_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    order_id = db.Column(db.BigInteger, db.ForeignKey('orders.order_id'), nullable=False)
    tracking_code = db.Column(db.String(100), nullable=True)
    carrier = db.Column(db.Unicode(100), nullable=True)
    status = db.Column(db.String(30), default='PENDING')
    shipped_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
