from datetime import datetime
from decimal import Decimal

import pytz
from nanoid import generate

from extensions import db
from models.cart import Cart
from models.cart_item import CartItem
from models.order import Order
from models.order_item import OrderItem
from models.order_status_history import OrderStatusHistory
from models.product import Product
from models.product_image import ProductImage
from models.product_variant import ProductVariant
from models.shipment import Shipment
from models.store import Store
from models.address import Address
from models.voucher import OrderVoucher
from services.variant_service import VariantService
from services.voucher_service import VoucherService


class OrderService:
    @staticmethod
    def _primary_image_url(product_id):
        primary_img = db.session.query(ProductImage.image_url).filter(
            ProductImage.product_id == product_id,
            ProductImage.is_primary == True
        ).first()
        return primary_img[0] if primary_img else None

    @staticmethod
    def _validate_voucher_contract(customer_id, store_id, subtotal, voucher_code, now):
        if not voucher_code:
            return None, Decimal('0'), None, 200

        return VoucherService.validate_and_calculate(
            customer_id=customer_id,
            code=voucher_code,
            order_amount=subtotal,
            store_id=store_id,
            now=now
        )

    @staticmethod
    def _resolve_order_items(store_id, items):
        product_ids = list({item['product_id'] for item in items})
        products = db.session.query(Product).filter(
            Product.product_id.in_(product_ids),
            Product.store_id == store_id,
            Product.status == 'ACTIVE',
            Product.deleted_at.is_(None)
        ).all()

        if len(products) != len(product_ids):
            found_ids = {product.product_id for product in products}
            missing = [pid for pid in product_ids if pid not in found_ids]
            return None, f'Sản phẩm không hợp lệ hoặc không thuộc cửa hàng: {missing}'

        product_map = {product.product_id: product for product in products}
        resolved_items = []

        for item in items:
            product_id = item['product_id']
            quantity = item['quantity']
            product = product_map[product_id]
            variant = VariantService.resolve_variant(product, item.get('variant_id'))

            if not variant:
                return None, f'Variant không hợp lệ cho sản phẩm "{product.product_name}"'

            existing = next(
                (
                    entry for entry in resolved_items
                    if entry['product_id'] == product_id and entry['variant'].variant_id == variant.variant_id
                ),
                None
            )

            if existing:
                existing['quantity'] += quantity
            else:
                resolved_items.append({
                    'product_id': product_id,
                    'product': product,
                    'variant': variant,
                    'quantity': quantity,
                })

        for entry in resolved_items:
            variant = entry['variant']
            quantity = entry['quantity']
            if (variant.stock_quantity or 0) < quantity:
                return None, (
                    f'Không đủ hàng cho "{entry["product"].product_name}" '
                    f'({variant.variant_name}). Tồn kho: {variant.stock_quantity or 0}, yêu cầu: {quantity}'
                )

        return resolved_items, None

    @staticmethod
    def place_order(customer_id, store_id, items, recipient_name, recipient_phone,
                    shipping_address_line, shipping_province, shipping_ward=None,
                    shipping_district=None, payment_method='COD', customer_note=None,
                    address_id=None, voucher_code=None):
        try:
            utc = pytz.UTC
            now = datetime.now(utc)

            source_address = None
            if address_id is not None:
                source_address = db.session.query(Address).filter(
                    Address.address_id == address_id,
                    Address.user_id == customer_id,
                    Address.status == 'ACTIVE',
                    Address.deleted_at.is_(None)
                ).first()

                if not source_address:
                    return {
                        'success': False,
                        'message': 'Địa chỉ không tồn tại, không thuộc tài khoản hoặc đã ngừng hoạt động'
                    }, 404

                # A persisted address is authoritative when address_id is supplied.
                recipient_name = source_address.recipient_name
                recipient_phone = source_address.recipient_phone
                shipping_address_line = source_address.address_line
                shipping_ward = source_address.ward
                shipping_district = source_address.district
                shipping_province = source_address.province

            resolved_items, error = OrderService._resolve_order_items(store_id, items)
            if error:
                return {'success': False, 'message': error}, 400

            subtotal = sum(
                Decimal(entry['variant'].price) * entry['quantity']
                for entry in resolved_items
            )

            voucher, discount_amount, voucher_error, voucher_status = OrderService._validate_voucher_contract(
                customer_id=customer_id,
                store_id=store_id,
                subtotal=subtotal,
                voucher_code=voucher_code,
                now=now
            )
            if voucher_error:
                return voucher_error, voucher_status

            shipping_fee = Decimal('0')
            total_amount = subtotal - discount_amount + shipping_fee

            order = Order(
                customer_id=customer_id,
                store_id=store_id,
                source_address_id=source_address.address_id if source_address else None,
                order_code=f"ORD-{now.strftime('%Y%m%d')}-{generate(size=8).upper()}",
                order_status='PENDING',
                recipient_name=recipient_name,
                recipient_phone=recipient_phone,
                shipping_address_line=shipping_address_line,
                shipping_ward=shipping_ward,
                shipping_district=shipping_district,
                shipping_province=shipping_province,
                payment_method=payment_method,
                payment_status='UNPAID' if payment_method == 'COD' else 'PENDING',
                customer_note=customer_note,
                subtotal=subtotal,
                discount_amount=discount_amount,
                shipping_fee=shipping_fee,
                total_amount=total_amount,
                created_at=now,
                updated_at=now
            )
            db.session.add(order)
            db.session.flush()

            for entry in resolved_items:
                product = entry['product']
                variant = entry['variant']
                quantity = entry['quantity']

                db.session.add(OrderItem(
                    order_id=order.order_id,
                    product_id=product.product_id,
                    variant_id=variant.variant_id,
                    quantity=quantity,
                    unit_price=variant.price,
                    product_name_snapshot=product.product_name,
                    product_image_url_snapshot=OrderService._primary_image_url(product.product_id),
                    sku_code_snapshot=variant.sku_code,
                    variant_name_snapshot=variant.variant_name,
                    created_at=now,
                    updated_at=now
                ))

                variant.stock_quantity = (variant.stock_quantity or 0) - quantity
                variant.updated_at = now
                product.sold_quantity = (product.sold_quantity or 0) + quantity
                product.updated_at = now

            VariantService.sync_product_stock(
                entry['product_id'] for entry in resolved_items
            )

            db.session.add(OrderStatusHistory(
                order_id=order.order_id,
                prev_status=None,
                new_status='PENDING',
                changed_by=customer_id,
                note='Khách hàng tạo đơn',
                created_at=now
            ))

            if voucher:
                db.session.add(OrderVoucher(
                    order_id=order.order_id,
                    voucher_id=voucher.voucher_id,
                    voucher_code_snapshot=voucher.voucher_code,
                    discount_type_snapshot=voucher.discount_type,
                    discount_value_snapshot=voucher.discount_value,
                    discount_amount=discount_amount,
                    application_status='APPLIED',
                    applied_at=now,
                    created_at=now,
                    updated_at=now
                ))
                voucher.used_count = (voucher.used_count or 0) + 1
                voucher.updated_at = now

            cart = db.session.query(Cart).filter(Cart.customer_id == customer_id).first()
            if cart:
                ordered_variant_ids = [entry['variant'].variant_id for entry in resolved_items]
                db.session.query(CartItem).filter(
                    CartItem.cart_id == cart.cart_id,
                    CartItem.variant_id.in_(ordered_variant_ids)
                ).delete(synchronize_session='fetch')

            db.session.commit()

            return {
                'success': True,
                'data': {
                    'order_id': order.order_id,
                    'order_code': order.order_code,
                    'order_status': order.order_status,
                    'store_id': order.store_id,
                    'source_address_id': order.source_address_id,
                    'subtotal': float(order.subtotal),
                    'discount_amount': float(order.discount_amount),
                    'total_amount': float(order.total_amount),
                    'voucher': ({
                        'voucher_code': voucher.voucher_code,
                        'discount_type': voucher.discount_type,
                        'discount_value': float(voucher.discount_value),
                        'discount_amount': float(discount_amount),
                    } if voucher else None),
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def list_my_orders(customer_id, status=None, page=1, limit=20):
        try:
            offset = (page - 1) * limit

            query = db.session.query(Order).filter(
                Order.customer_id == customer_id,
                Order.deleted_at.is_(None)
            )

            if status:
                query = query.filter(Order.order_status == status)

            total_items = query.count()
            total_pages = (total_items + limit - 1) // limit if total_items > 0 else 0
            orders = query.order_by(Order.created_at.desc()).offset(offset).limit(limit).all()

            orders_list = []
            for order in orders:
                first_item = db.session.query(OrderItem).filter(
                    OrderItem.order_id == order.order_id
                ).first()
                store = db.session.query(Store.store_name).filter(
                    Store.store_id == order.store_id
                ).first()

                orders_list.append({
                    'order_id': order.order_id,
                    'order_code': order.order_code,
                    'order_status': order.order_status,
                    'store_id': order.store_id,
                    'source_address_id': order.source_address_id,
                    'total_amount': float(order.total_amount),
                    'created_at': order.created_at.isoformat() if order.created_at else None,
                    'store_name': store[0] if store else None,
                    'first_item': first_item.product_name_snapshot if first_item else None,
                })

            return {
                'success': True,
                'data': {
                    'orders': orders_list,
                    'pagination': {
                        'current_page': page,
                        'per_page': limit,
                        'total_items': total_items,
                        'total_pages': total_pages,
                    }
                }
            }, 200

        except Exception as e:
            raise e

    @staticmethod
    def get_order_detail(customer_id, order_id):
        try:
            order = db.session.query(Order).filter(
                Order.order_id == order_id,
                Order.deleted_at.is_(None)
            ).first()

            if not order:
                return {'success': False, 'message': 'Đơn hàng không tồn tại'}, 404
            if order.customer_id != customer_id:
                return {'success': False, 'message': 'Không có quyền xem đơn hàng này'}, 403

            items = db.session.query(OrderItem).filter(
                OrderItem.order_id == order_id
            ).all()

            items_list = []
            for item in items:
                total_price = float(item.unit_price) * item.quantity
                items_list.append({
                    'order_item_id': item.order_item_id,
                    'product_id': item.product_id,
                    'variant_id': item.variant_id,
                    'sku_code': item.sku_code_snapshot,
                    'variant_name': item.variant_name_snapshot or 'Mặc định',
                    'product_name': item.product_name_snapshot,
                    'product_name_snapshot': item.product_name_snapshot,
                    'product_image_url_snapshot': item.product_image_url_snapshot,
                    'quantity': item.quantity,
                    'unit_price': float(item.unit_price),
                    'total_price': total_price,
                })

            store = db.session.query(Store).filter(Store.store_id == order.store_id).first()
            store_info = {
                'store_name': store.store_name if store else None,
                'logo_url': store.logo_url if store else None,
            }

            shipment = db.session.query(Shipment).filter(
                Shipment.order_id == order_id
            ).first()

            shipment_info = None
            if shipment:
                shipment_info = {
                    'status': shipment.shipment_status,
                    'tracking_code': shipment.tracking_code,
                    'carrier': shipment.carrier,
                    'shipped_at': shipment.shipped_at.isoformat() if shipment.shipped_at else None,
                    'delivered_at': shipment.delivered_at.isoformat() if shipment.delivered_at else None,
                }

            voucher_applications = db.session.query(OrderVoucher).filter(
                OrderVoucher.order_id == order_id
            ).all()
            voucher_snapshots = [{
                'voucher_id': application.voucher_id,
                'voucher_code': application.voucher_code_snapshot,
                'discount_type': application.discount_type_snapshot,
                'discount_value': float(application.discount_value_snapshot),
                'discount_amount': float(application.discount_amount),
                'application_status': application.application_status,
                'applied_at': application.applied_at.isoformat() if application.applied_at else None,
                'reversed_at': application.reversed_at.isoformat() if application.reversed_at else None,
            } for application in voucher_applications]

            return {
                'success': True,
                'data': {
                    'order_id': order.order_id,
                    'order_code': order.order_code,
                    'order_status': order.order_status,
                    'store_id': order.store_id,
                    'source_address_id': order.source_address_id,
                    'recipient_name': order.recipient_name,
                    'recipient_phone': order.recipient_phone,
                    'shipping_address_line': order.shipping_address_line,
                    'shipping_ward': order.shipping_ward,
                    'shipping_district': order.shipping_district,
                    'shipping_province': order.shipping_province,
                    'payment_method': order.payment_method,
                    'customer_note': order.customer_note,
                    'subtotal': float(order.subtotal),
                    'discount_amount': float(order.discount_amount),
                    'shipping_fee': float(order.shipping_fee),
                    'total_amount': float(order.total_amount),
                    'created_at': order.created_at.isoformat() if order.created_at else None,
                    'items': items_list,
                    'vouchers': voucher_snapshots,
                    'store': store_info,
                    'shipment': shipment_info,
                }
            }, 200

        except Exception as e:
            raise e

    @staticmethod
    def cancel_order(customer_id, order_id, cancel_reason=None):
        try:
            order = db.session.query(Order).filter(
                Order.order_id == order_id,
                Order.deleted_at.is_(None)
            ).first()

            if not order:
                return {'success': False, 'message': 'Đơn hàng không tồn tại'}, 404
            if order.customer_id != customer_id:
                return {'success': False, 'message': 'Không có quyền hủy đơn hàng này'}, 403
            if order.order_status != 'PENDING':
                return {'success': False, 'message': 'Không thể hủy đơn đã xử lý'}, 400

            now = datetime.now(pytz.UTC)
            order.order_status = 'CANCELLED'
            order.cancelled_by_user_id = customer_id
            order.cancel_reason = cancel_reason
            order.cancelled_at = now
            order.updated_at = now

            db.session.add(OrderStatusHistory(
                order_id=order.order_id,
                prev_status='PENDING',
                new_status='CANCELLED',
                changed_by=customer_id,
                note=cancel_reason,
                created_at=now
            ))

            order_items = db.session.query(OrderItem).filter(
                OrderItem.order_id == order_id
            ).all()

            for item in order_items:
                variant = db.session.query(ProductVariant).filter(
                    ProductVariant.variant_id == item.variant_id
                ).first()
                if variant:
                    variant.stock_quantity = (variant.stock_quantity or 0) + item.quantity
                    variant.updated_at = now

                product = db.session.query(Product).filter(
                    Product.product_id == item.product_id
                ).first()
                if product:
                    product.sold_quantity = max((product.sold_quantity or 0) - item.quantity, 0)
                    product.updated_at = now

            VariantService.sync_product_stock(
                item.product_id for item in order_items
            )

            voucher_applications = db.session.query(OrderVoucher).filter(
                OrderVoucher.order_id == order_id,
                OrderVoucher.application_status == 'APPLIED'
            ).all()
            for application in voucher_applications:
                application.application_status = 'REVERSED'
                application.reversed_at = now
                application.reversed_reason = cancel_reason or 'ORDER_CANCELLED'
                application.updated_at = now
                voucher = application.voucher
                if voucher:
                    voucher.used_count = max((voucher.used_count or 0) - 1, 0)
                    voucher.updated_at = now

            db.session.commit()
            return {'success': True, 'message': 'Đã hủy đơn'}, 200

        except Exception as e:
            db.session.rollback()
            raise e
