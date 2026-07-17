from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

from sqlalchemy.exc import IntegrityError

from extensions import db
from models.order import Order
from models.store import Store
from models.user_store import UserStore
from models.voucher import OrderVoucher, Voucher


class VoucherService:
    @staticmethod
    def _get_seller_store_id(user_id):
        row = (
            db.session.query(UserStore.store_id)
            .filter(
                UserStore.user_id == user_id,
                UserStore.store_member_role == 'OWNER',
                UserStore.is_active == 1
            )
            .first()
        )
        return row.store_id if row else None

    @staticmethod
    def _voucher_to_dict(voucher):
        return {
            'voucher_id': voucher.voucher_id,
            'voucher_code': voucher.voucher_code,
            'voucher_name': voucher.voucher_name,
            'store_id': voucher.store_id,
            'discount_type': voucher.discount_type,
            'discount_value': float(voucher.discount_value),
            'min_order_amount': float(voucher.min_order_amount),
            'max_discount_amount': (
                float(voucher.max_discount_amount)
                if voucher.max_discount_amount is not None else None
            ),
            'usage_limit': voucher.usage_limit,
            'used_count': voucher.used_count,
            'usage_limit_per_customer': voucher.usage_limit_per_customer,
            'starts_at': voucher.starts_at.isoformat(),
            'ends_at': voucher.ends_at.isoformat(),
            'status': voucher.status,
            'created_at': voucher.created_at.isoformat() if voucher.created_at else None,
            'updated_at': voucher.updated_at.isoformat() if voucher.updated_at else None,
        }

    @staticmethod
    def _parse_datetime(value):
        parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
        if parsed.tzinfo is not None:
            parsed = parsed.astimezone(timezone.utc).replace(tzinfo=None)
        return parsed

    @staticmethod
    def _parse_decimal(value, field_name, default=None):
        if value is None and default is not None:
            return Decimal(str(default)), None
        try:
            return Decimal(str(value)), None
        except (InvalidOperation, TypeError, ValueError):
            return None, {'success': False, 'message': f'{field_name} phải là số'}

    @staticmethod
    def validate_and_calculate(customer_id, code, order_amount, store_id, now=None):
        """Validate and calculate a voucher without committing the transaction."""
        normalized_code = str(code or '').strip().upper()
        if not normalized_code:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher code là bắt buộc'}, 400

        subtotal, error = VoucherService._parse_decimal(order_amount, 'Tổng tiền')
        if error:
            return None, Decimal('0'), error, 400
        if subtotal < 0:
            return None, Decimal('0'), {'success': False, 'message': 'Tổng tiền không được âm'}, 400

        voucher = db.session.query(Voucher).filter(
            Voucher.voucher_code == normalized_code,
            Voucher.deleted_at.is_(None)
        ).first()
        if not voucher:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher không tồn tại'}, 404

        now = now or datetime.utcnow()
        if now.tzinfo is not None:
            now = now.astimezone(timezone.utc).replace(tzinfo=None)
        if voucher.status != 'ACTIVE':
            return None, Decimal('0'), {'success': False, 'message': 'Voucher không ở trạng thái ACTIVE'}, 409
        if voucher.starts_at > now:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher chưa bắt đầu'}, 409
        if voucher.ends_at < now:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher đã hết hạn'}, 409
        if voucher.store_id is not None and voucher.store_id != store_id:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher không áp dụng cho cửa hàng này'}, 409

        minimum = Decimal(voucher.min_order_amount)
        if subtotal < minimum:
            return None, Decimal('0'), {
                'success': False,
                'message': f'Đơn hàng tối thiểu {minimum} để dùng voucher này'
            }, 409

        if voucher.usage_limit is not None and voucher.used_count >= voucher.usage_limit:
            return None, Decimal('0'), {'success': False, 'message': 'Voucher đã hết lượt sử dụng'}, 409

        customer_usage = (
            db.session.query(OrderVoucher)
            .join(Order, Order.order_id == OrderVoucher.order_id)
            .filter(
                OrderVoucher.voucher_id == voucher.voucher_id,
                OrderVoucher.application_status == 'APPLIED',
                Order.customer_id == customer_id,
                Order.order_status != 'CANCELLED'
            )
            .count()
        )
        if customer_usage >= voucher.usage_limit_per_customer:
            return None, Decimal('0'), {
                'success': False,
                'message': 'Bạn đã sử dụng hết lượt voucher này'
            }, 409

        discount_value = Decimal(voucher.discount_value)
        if discount_value <= 0:
            return None, Decimal('0'), {'success': False, 'message': 'Giá trị voucher không hợp lệ'}, 409

        if voucher.discount_type == 'PERCENT':
            if discount_value > 100:
                return None, Decimal('0'), {'success': False, 'message': 'Phần trăm voucher không hợp lệ'}, 409
            discount_amount = subtotal * discount_value / Decimal('100')
            if voucher.max_discount_amount is not None:
                discount_amount = min(discount_amount, Decimal(voucher.max_discount_amount))
        elif voucher.discount_type == 'FIXED':
            discount_amount = discount_value
        else:
            return None, Decimal('0'), {'success': False, 'message': 'Loại voucher không hợp lệ'}, 409

        discount_amount = max(Decimal('0'), min(discount_amount, subtotal)).quantize(Decimal('0.01'))
        return voucher, discount_amount, None, 200

    @staticmethod
    def check_voucher(customer_id, code, order_amount, store_id=None):
        voucher, discount_amount, error, status_code = VoucherService.validate_and_calculate(
            customer_id=customer_id,
            code=code,
            order_amount=order_amount,
            store_id=store_id
        )
        if error:
            return error, status_code

        return {
            'success': True,
            'data': {
                **VoucherService._voucher_to_dict(voucher),
                'valid': True,
                'discount_amount': float(discount_amount),
            }
        }, 200

    @staticmethod
    def create_voucher(user_id, roles, data):
        try:
            is_admin = 'ADMIN' in roles
            is_seller = 'SELLER' in roles

            voucher_code = str(data.get('voucher_code') or '').strip().upper()
            voucher_name = str(data.get('voucher_name') or '').strip()
            discount_type = str(data.get('discount_type') or '').strip().upper()
            if not voucher_code:
                return {'success': False, 'message': 'voucher_code là bắt buộc'}, 400
            if len(voucher_code) > 30:
                return {'success': False, 'message': 'voucher_code tối đa 30 ký tự'}, 400
            if not voucher_name:
                return {'success': False, 'message': 'voucher_name là bắt buộc'}, 400
            if discount_type not in ('PERCENT', 'FIXED'):
                return {'success': False, 'message': 'discount_type phải là PERCENT hoặc FIXED'}, 400

            discount_value, error = VoucherService._parse_decimal(data.get('discount_value'), 'discount_value')
            if error:
                return error, 400
            min_order_amount, error = VoucherService._parse_decimal(
                data.get('min_order_amount'), 'min_order_amount', default=0
            )
            if error:
                return error, 400
            max_discount_amount = None
            if data.get('max_discount_amount') is not None:
                max_discount_amount, error = VoucherService._parse_decimal(
                    data.get('max_discount_amount'), 'max_discount_amount'
                )
                if error:
                    return error, 400

            if discount_value <= 0 or (discount_type == 'PERCENT' and discount_value > 100):
                return {'success': False, 'message': 'discount_value không hợp lệ'}, 400
            if min_order_amount < 0:
                return {'success': False, 'message': 'min_order_amount không được âm'}, 400
            if max_discount_amount is not None and max_discount_amount < 0:
                return {'success': False, 'message': 'max_discount_amount không được âm'}, 400

            try:
                usage_limit = int(data['usage_limit']) if data.get('usage_limit') is not None else None
                usage_limit_per_customer = int(data.get('usage_limit_per_customer', 1))
            except (TypeError, ValueError):
                return {'success': False, 'message': 'Giới hạn sử dụng phải là số nguyên'}, 400
            if usage_limit is not None and usage_limit <= 0:
                return {'success': False, 'message': 'usage_limit phải > 0'}, 400
            if usage_limit_per_customer <= 0:
                return {'success': False, 'message': 'usage_limit_per_customer phải > 0'}, 400

            starts_at_raw = data.get('starts_at')
            ends_at_raw = data.get('ends_at')
            if not starts_at_raw or not ends_at_raw:
                return {'success': False, 'message': 'starts_at và ends_at là bắt buộc'}, 400
            try:
                starts_at = VoucherService._parse_datetime(starts_at_raw)
                ends_at = VoucherService._parse_datetime(ends_at_raw)
            except (ValueError, AttributeError):
                return {'success': False, 'message': 'Định dạng starts_at / ends_at không hợp lệ'}, 400
            if ends_at <= starts_at:
                return {'success': False, 'message': 'ends_at phải sau starts_at'}, 400

            store_id = data.get('store_id')
            if is_seller and not is_admin:
                seller_store_id = VoucherService._get_seller_store_id(user_id)
                if not seller_store_id:
                    return {'success': False, 'message': 'Bạn chưa tạo cửa hàng'}, 403
                if store_id is not None:
                    try:
                        requested_store_id = int(store_id)
                    except (TypeError, ValueError):
                        return {'success': False, 'message': 'store_id không hợp lệ'}, 400
                    if requested_store_id != seller_store_id:
                        return {'success': False, 'message': 'Bạn không có quyền tạo voucher cho cửa hàng này'}, 403
                store_id = seller_store_id
            elif is_admin:
                try:
                    store_id = int(store_id) if store_id is not None else None
                except (TypeError, ValueError):
                    return {'success': False, 'message': 'store_id không hợp lệ'}, 400

            if store_id is not None:
                store = db.session.query(Store).filter(
                    Store.store_id == store_id,
                    Store.deleted_at.is_(None)
                ).first()
                if not store:
                    return {'success': False, 'message': 'Cửa hàng không tồn tại'}, 404

            now = datetime.utcnow()
            voucher = Voucher(
                voucher_code=voucher_code,
                voucher_name=voucher_name,
                store_id=store_id,
                created_by_user_id=user_id,
                discount_type=discount_type,
                discount_value=discount_value,
                min_order_amount=min_order_amount,
                max_discount_amount=max_discount_amount,
                usage_limit=usage_limit,
                used_count=0,
                usage_limit_per_customer=usage_limit_per_customer,
                starts_at=starts_at,
                ends_at=ends_at,
                status='ACTIVE',
                created_at=now,
                updated_at=now
            )
            db.session.add(voucher)
            db.session.commit()
            return {'success': True, 'data': VoucherService._voucher_to_dict(voucher)}, 201
        except IntegrityError:
            db.session.rollback()
            return {'success': False, 'message': 'Mã voucher đã tồn tại'}, 409
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def update_voucher_status(user_id, roles, voucher_id, status):
        try:
            valid_statuses = ('ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED')
            if status not in valid_statuses:
                return {
                    'success': False,
                    'message': f'status phải là một trong: {", ".join(valid_statuses)}'
                }, 400

            voucher = db.session.query(Voucher).filter(
                Voucher.voucher_id == voucher_id,
                Voucher.deleted_at.is_(None)
            ).first()
            if not voucher:
                return {'success': False, 'message': 'Voucher không tồn tại'}, 404

            is_admin = 'ADMIN' in roles
            is_seller = 'SELLER' in roles
            if is_seller and not is_admin:
                seller_store_id = VoucherService._get_seller_store_id(user_id)
                if not seller_store_id or voucher.store_id != seller_store_id:
                    return {'success': False, 'message': 'Bạn không có quyền cập nhật voucher này'}, 403

            voucher.status = status
            voucher.updated_at = datetime.utcnow()
            db.session.commit()
            return {
                'success': True,
                'data': {'voucher_id': voucher.voucher_id, 'status': voucher.status}
            }, 200
        except Exception:
            db.session.rollback()
            raise
