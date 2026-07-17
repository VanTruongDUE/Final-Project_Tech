from datetime import datetime

import pytz

from extensions import db
from models.cart import Cart
from models.cart_item import CartItem
from models.product import Product
from models.product_image import ProductImage
from models.product_variant import ProductVariant
from services.variant_service import VariantService


class CartService:
    @staticmethod
    def _get_or_create_cart(customer_id):
        cart = db.session.query(Cart).filter(
            Cart.customer_id == customer_id
        ).first()

        if not cart:
            cart = Cart(customer_id=customer_id)
            db.session.add(cart)
            db.session.flush()

        return cart

    @staticmethod
    def _serialize_item(item, product, variant, primary_image_url):
        current_price = variant.price if variant else product.price
        stock_quantity = variant.stock_quantity if variant else product.stock_quantity

        return {
            'cart_item_id': item.cart_item_id,
            'product_id': item.product_id,
            'variant_id': item.variant_id,
            'sku_code': variant.sku_code if variant else product.sku,
            'variant_name': variant.variant_name if variant else 'Mặc định',
            'quantity': item.quantity,
            'price_at_added': float(item.price_at_added),
            'price': float(current_price),
            'current_price': float(current_price),
            'price_changed': float(current_price) != float(item.price_at_added),
            'product_name': product.product_name,
            'stock_quantity': stock_quantity or 0,
            'product_status': product.status,
            'primary_image': primary_image_url,
            'image_url': primary_image_url,
        }

    @staticmethod
    def get_my_cart(customer_id):
        try:
            cart = CartService._get_or_create_cart(customer_id)
            db.session.commit()

            rows = (
                db.session.query(CartItem, Product, ProductVariant, ProductImage.image_url)
                .join(Product, Product.product_id == CartItem.product_id)
                .outerjoin(ProductVariant, ProductVariant.variant_id == CartItem.variant_id)
                .outerjoin(
                    ProductImage,
                    (ProductImage.product_id == CartItem.product_id) &
                    (ProductImage.is_primary == True)
                )
                .filter(CartItem.cart_id == cart.cart_id)
                .all()
            )

            items = []
            total_amount = 0.0
            has_price_change = False

            for cart_item, product, variant, primary_image_url in rows:
                if not variant:
                    variant = VariantService.get_or_create_default_variant(product)
                    cart_item.variant_id = variant.variant_id
                    cart_item.price_at_added = variant.price

                serialized = CartService._serialize_item(cart_item, product, variant, primary_image_url)
                items.append(serialized)
                total_amount += float(variant.price) * cart_item.quantity
                if serialized['price_changed']:
                    has_price_change = True

            db.session.commit()

            return {
                'success': True,
                'data': {
                    'cart_id': cart.cart_id,
                    'items': items,
                    'total_amount': round(total_amount, 2),
                    'has_price_change': has_price_change,
                }
            }, 200

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def add_item(customer_id, product_id, quantity, variant_id=None):
        try:
            product = db.session.query(Product).filter(
                Product.product_id == product_id,
                Product.status == 'ACTIVE',
                Product.deleted_at.is_(None)
            ).first()

            if not product:
                return {'success': False, 'message': 'Sản phẩm không tồn tại hoặc không còn bán'}, 404

            variant = VariantService.resolve_variant(product, variant_id)
            if not variant:
                return {'success': False, 'message': 'Variant không hợp lệ hoặc không thuộc sản phẩm'}, 400

            cart = CartService._get_or_create_cart(customer_id)

            existing_item = db.session.query(CartItem).filter(
                CartItem.cart_id == cart.cart_id,
                CartItem.product_id == product_id,
                CartItem.variant_id == variant.variant_id
            ).first()

            if existing_item:
                new_qty = existing_item.quantity + quantity
                if (variant.stock_quantity or 0) < new_qty:
                    return {
                        'success': False,
                        'message': f'Không đủ hàng trong kho. Tồn kho: {variant.stock_quantity or 0}, yêu cầu: {new_qty}'
                    }, 400

                existing_item.quantity = new_qty
                existing_item.updated_at = datetime.now(pytz.UTC)
                db.session.commit()

                return {
                    'success': True,
                    'data': {
                        'cart_item_id': existing_item.cart_item_id,
                        'product_id': existing_item.product_id,
                        'variant_id': existing_item.variant_id,
                        'sku_code': variant.sku_code,
                        'variant_name': variant.variant_name,
                        'quantity': existing_item.quantity,
                        'price_at_added': float(existing_item.price_at_added),
                    }
                }, 200

            if (variant.stock_quantity or 0) < quantity:
                return {
                    'success': False,
                    'message': f'Không đủ hàng trong kho. Tồn kho: {variant.stock_quantity or 0}'
                }, 400

            item = CartItem(
                cart_id=cart.cart_id,
                product_id=product_id,
                variant_id=variant.variant_id,
                quantity=quantity,
                price_at_added=variant.price,
            )
            db.session.add(item)
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'cart_item_id': item.cart_item_id,
                    'product_id': item.product_id,
                    'variant_id': item.variant_id,
                    'sku_code': variant.sku_code,
                    'variant_name': variant.variant_name,
                    'quantity': item.quantity,
                    'price_at_added': float(item.price_at_added),
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_item_qty(customer_id, cart_item_id, quantity):
        try:
            if quantity < 1:
                return {'success': False, 'message': 'Số lượng phải >= 1'}, 400

            cart = db.session.query(Cart).filter(
                Cart.customer_id == customer_id
            ).first()

            if not cart:
                return {'success': False, 'message': 'Giỏ hàng không tồn tại'}, 404

            item = db.session.query(CartItem).filter(
                CartItem.cart_item_id == cart_item_id,
                CartItem.cart_id == cart.cart_id
            ).first()

            if not item:
                return {'success': False, 'message': 'Không tìm thấy sản phẩm trong giỏ hàng'}, 404

            product = db.session.query(Product).filter(
                Product.product_id == item.product_id
            ).first()

            variant = db.session.query(ProductVariant).filter(
                ProductVariant.variant_id == item.variant_id,
                ProductVariant.status == 'ACTIVE'
            ).first()

            if not variant and product:
                variant = VariantService.get_or_create_default_variant(product)
                item.variant_id = variant.variant_id

            if not variant or (variant.stock_quantity or 0) < quantity:
                stock = variant.stock_quantity if variant else 0
                return {
                    'success': False,
                    'message': f'Không đủ hàng trong kho. Tồn kho: {stock}'
                }, 400

            item.quantity = quantity
            item.updated_at = datetime.now(pytz.UTC)
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'cart_item_id': item.cart_item_id,
                    'product_id': item.product_id,
                    'variant_id': item.variant_id,
                    'sku_code': variant.sku_code,
                    'variant_name': variant.variant_name,
                    'quantity': item.quantity,
                    'price_at_added': float(item.price_at_added),
                }
            }, 200

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def remove_item(customer_id, cart_item_id):
        try:
            cart = db.session.query(Cart).filter(
                Cart.customer_id == customer_id
            ).first()

            if not cart:
                return {'success': False, 'message': 'Giỏ hàng không tồn tại'}, 404

            item = db.session.query(CartItem).filter(
                CartItem.cart_item_id == cart_item_id,
                CartItem.cart_id == cart.cart_id
            ).first()

            if not item:
                return {'success': False, 'message': 'Không tìm thấy sản phẩm trong giỏ hàng'}, 404

            db.session.delete(item)
            db.session.commit()

            return {'success': True, 'message': 'Đã xóa'}, 200

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def clear_cart(customer_id):
        try:
            cart = db.session.query(Cart).filter(
                Cart.customer_id == customer_id
            ).first()

            if not cart:
                return {'success': True, 'message': 'Đã xóa giỏ hàng'}, 200

            db.session.query(CartItem).filter(
                CartItem.cart_id == cart.cart_id
            ).delete()

            db.session.commit()

            return {'success': True, 'message': 'Đã xóa giỏ hàng'}, 200

        except Exception as e:
            db.session.rollback()
            raise e
