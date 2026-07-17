from models.cart import Cart
from extensions import db
from models.product import Product
from models.product_image import ProductImage
from models.store import Store
from models.user_store import UserStore
from models.order import Order
from models.shipment import Shipment
from services.seller_order_service import SellerOrderService
from models.order_status_history import OrderStatusHistory
from models.product_variant import ProductVariant
from models.order_item import OrderItem
from models.cart_item import CartItem
from sqlalchemy import func, and_
from datetime import datetime
from slugify import slugify
from nanoid import generate
import pytz
from utils.sku_helper import generate_sku
from services.variant_service import VariantService

class SellerProductService:

    @staticmethod
    def get_seller_store(user_id):
        query = db.session.query(UserStore.store_id).filter(
            UserStore.user_id == user_id,
            UserStore.store_member_role == 'OWNER',
            UserStore.is_active == 1,
            UserStore.deleted_at.is_(None)
        ).first()
        return query[0] if query else None

    @staticmethod
    def create_product(user_id, category_id, sku, product_name, description,
                    price, stock_quantity, image_urls, variants=None):
        try:
            store_id = SellerProductService.get_seller_store(user_id)
            if not store_id:
                return {'success': False, 'message': 'NgÆ°á»i dÃ¹ng khÃ´ng pháº£i chá»§ cá»­a hÃ ng'}, 403

            # â”€â”€â”€ Validate variants TRÆ¯á»šC khi táº¡o product (fail sá»›m, trÃ¡nh rollback) â”€â”€â”€
            if variants:
                incoming_skus = [v.get('sku_code', '').strip() for v in variants]

                if any(not s for s in incoming_skus):
                    return {'success': False, 'message': 'Má»—i variant pháº£i cÃ³ sku_code'}, 400

                # TrÃ¹ng SKU ngay trong chÃ­nh request
                if len(incoming_skus) != len(set(incoming_skus)):
                    return {'success': False, 'message': 'SKU đã tồn tại'}, 400

                # TrÃ¹ng SKU vá»›i variant Ä‘Ã£ cÃ³ sáºµn TRONG CÃ™NG SHOP (khÃ´ng check shop khÃ¡c)
                existing = db.session.query(ProductVariant.sku_code).filter(
                    ProductVariant.store_id == store_id,
                    ProductVariant.sku_code.in_(incoming_skus)
                ).all()
                if existing:
                    dup_list = ', '.join(row[0] for row in existing)
                    return {'success': False, 'message': f'SKU đã tồn tại: {dup_list}'}, 400

                for v in variants:
                    if not isinstance(v.get('price'), (int, float)) or v['price'] <= 0:
                        return {'success': False, 'message': f'GiÃ¡ variant "{v["sku_code"]}" pháº£i > 0'}, 400

            # Auto-generate SKU cho product gá»‘c náº¿u seller khÃ´ng truyá»n (giá»¯ flow cÅ©)
            if not sku:
                sku = generate_sku(product_name, store_id, db.session)
            else:
                existing_sku = db.session.query(Product).filter(
                    Product.store_id == store_id,
                    Product.sku == sku
                ).first()
                if existing_sku:
                    return {'success': False, 'message': f'SKU "{sku}" Ä‘Ã£ tá»“n táº¡i trong cá»­a hÃ ng'}, 409

            slug = f"{slugify(product_name)}-{generate(size=6)}"
            utc = pytz.UTC
            now = datetime.now(utc)

            product = Product(
                store_id=store_id,
                category_id=category_id,
                sku=sku,
                product_name=product_name,
                slug=slug,
                description=description,
                price=price,
                stock_quantity=stock_quantity,
                status='ACTIVE',
                created_at=now,
                updated_at=now
            )
            db.session.add(product)
            db.session.flush()  # láº¥y product_id trÆ°á»›c khi táº¡o variant

            # â”€â”€â”€ Táº¡o variant(s) â”€â”€â”€
            created_variants = []
            if not variants:
                # Seller khÃ´ng gá»­i variants -> tá»± táº¡o 1 default variant tá»« dá»¯ liá»‡u product
                default_variant = ProductVariant(
                    product_id=product.product_id,
                    store_id=store_id,
                    sku_code=sku,
                    variant_name='Máº·c Ä‘á»‹nh',
                    price=price,
                    stock_quantity=stock_quantity,
                    status='ACTIVE',
                    is_default=True,
                    created_at=now,
                    updated_at=now
                )
                db.session.add(default_variant)
                created_variants.append(default_variant)
            else:
                default_index = next((idx for idx, item in enumerate(variants) if item.get('is_default')), 0)
                for idx, v in enumerate(variants):
                    variant = ProductVariant(
                        product_id=product.product_id,
                        store_id=store_id,
                        sku_code=v['sku_code'].strip(),
                        variant_name=v.get('variant_name') or v['sku_code'],
                        option1_name=v.get('option1_name'),
                        option1_value=v.get('option1_value'),
                        option2_name=v.get('option2_name'),
                        option2_value=v.get('option2_value'),
                        price=v['price'],
                        stock_quantity=v.get('stock_quantity', 0),
                        status='ACTIVE',
                        is_default=(idx == default_index),
                        created_at=now,
                        updated_at=now
                    )
                    db.session.add(variant)
                    created_variants.append(variant)

            if image_urls:
                for idx, url in enumerate(image_urls):
                    image = ProductImage(
                        product_id=product.product_id,
                        image_url=url,
                        is_primary=(idx == 0)
                    )
                    db.session.add(image)

            store = db.session.query(Store).filter(Store.store_id == store_id).first()
            if store:
                store.total_products = (store.total_products or 0) + 1
                store.updated_at = now

            VariantService.sync_product_stock(product.product_id)
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'product_id': product.product_id,
                    'product_name': product.product_name,
                    'slug': product.slug,
                    'status': product.status,
                    'default_variant_id': next((v.variant_id for v in created_variants if v.is_default), created_variants[0].variant_id if created_variants else None),
                    'sku_code': next((v.sku_code for v in created_variants if v.is_default), created_variants[0].sku_code if created_variants else sku),
                    'variant_count': len(created_variants),
                    'variants': [{
                        'variant_id': v.variant_id,
                        'sku_code': v.sku_code,
                        'variant_name': v.variant_name,
                        'price': float(v.price),
                        'stock_quantity': v.stock_quantity,
                        'is_default': v.is_default
                    } for v in created_variants]
                }
            }, 201
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def update_product(user_id, product_id, category_id=None, product_name=None, description=None,
                       price=None, stock_quantity=None, status=None, variants=None):
        try:
            store_id = SellerProductService.get_seller_store(user_id)
            if not store_id:
                return {'success': False, 'message': 'NgÆ°á»i dÃ¹ng khÃ´ng pháº£i chá»§ cá»­a hÃ ng'}, 403

            product = db.session.query(Product).filter(
                Product.product_id == product_id,
                Product.store_id == store_id
            ).first()

            if not product:
                return {'success': False, 'message': 'Sáº£n pháº©m khÃ´ng tá»“n táº¡i'}, 404

            utc = pytz.UTC
            now = datetime.now(utc)

            if category_id is not None:
                product.category_id = category_id
            if description is not None:
                product.description = description
            if price is not None:
                if price <= 0:
                    return {'success': False, 'message': 'GiÃ¡ pháº£i > 0'}, 400
                product.price = price
            if stock_quantity is not None:
                if stock_quantity < 0:
                    return {'success': False, 'message': 'Sá»‘ lÆ°á»£ng khÃ´ng Ä‘Æ°á»£c Ã¢m'}, 400
                product.stock_quantity = stock_quantity
            if status is not None:
                if status not in ['ACTIVE', 'INACTIVE']:
                    return {'success': False, 'message': 'Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡'}, 400
                product.status = status
            if product_name is not None:
                product.product_name = product_name
                product.slug = f"{slugify(product_name)}-{generate(size=6)}"

            updated_variants = []
            if variants is not None:
                if not isinstance(variants, list):
                    return {'success': False, 'message': 'Variants phải là một danh sách'}, 400

                incoming_skus = [
                    item.get('sku_code', '').strip()
                    for item in variants
                    if not item.get('variant_id')
                ]

                if any(not sku_code for sku_code in incoming_skus):
                    return {'success': False, 'message': 'Mỗi variant mới phải có sku_code'}, 400
                if len(incoming_skus) != len(set(incoming_skus)):
                    return {'success': False, 'message': 'SKU đã tồn tại'}, 400

                existing_sku = db.session.query(ProductVariant).filter(
                    ProductVariant.store_id == store_id,
                    ProductVariant.product_id != product_id,
                    ProductVariant.sku_code.in_(incoming_skus)
                ).first() if incoming_skus else None
                if existing_sku:
                    return {'success': False, 'message': 'SKU đã tồn tại'}, 400

                default_index = next((idx for idx, item in enumerate(variants) if item.get('is_default')), 0)
                touched_variant_ids = []

                for idx, item in enumerate(variants):
                    variant_id = item.get('variant_id')
                    if variant_id:
                        variant = db.session.query(ProductVariant).filter(
                            ProductVariant.variant_id == variant_id,
                            ProductVariant.product_id == product_id,
                            ProductVariant.store_id == store_id
                        ).first()
                        if not variant:
                            return {'success': False, 'message': f'Variant {variant_id} không tồn tại'}, 404
                    else:
                        variant = ProductVariant(
                            product_id=product_id,
                            store_id=store_id,
                            sku_code=item['sku_code'].strip(),
                            variant_name=item.get('variant_name') or item['sku_code'].strip(),
                            price=item.get('price', product.price),
                            stock_quantity=item.get('stock_quantity', 0),
                            status=item.get('status') or 'ACTIVE',
                            created_at=now
                        )
                        db.session.add(variant)

                    if item.get('sku_code') and variant.sku_code != item['sku_code'].strip():
                        duplicate = db.session.query(ProductVariant).filter(
                            ProductVariant.store_id == store_id,
                            ProductVariant.sku_code == item['sku_code'].strip(),
                            ProductVariant.variant_id != variant.variant_id
                        ).first()
                        if duplicate:
                            return {'success': False, 'message': 'SKU đã tồn tại'}, 400
                        variant.sku_code = item['sku_code'].strip()

                    variant.variant_name = item.get('variant_name') or variant.variant_name or variant.sku_code
                    variant.option1_name = item.get('option1_name', variant.option1_name)
                    variant.option1_value = item.get('option1_value', variant.option1_value)
                    variant.option2_name = item.get('option2_name', variant.option2_name)
                    variant.option2_value = item.get('option2_value', variant.option2_value)

                    if item.get('price') is not None:
                        if item['price'] <= 0:
                            return {'success': False, 'message': 'Giá variant phải > 0'}, 400
                        variant.price = item['price']

                    if item.get('stock_quantity') is not None:
                        if item['stock_quantity'] < 0:
                            return {'success': False, 'message': 'Tồn kho variant không được âm'}, 400
                        variant.stock_quantity = item['stock_quantity']

                    variant.status = item.get('status') or variant.status or 'ACTIVE'
                    variant.is_default = (idx == default_index)
                    variant.updated_at = now
                    updated_variants.append(variant)

                    if variant.variant_id:
                        touched_variant_ids.append(variant.variant_id)

                db.session.flush()

                for variant in db.session.query(ProductVariant).filter(
                    ProductVariant.product_id == product_id,
                    ProductVariant.store_id == store_id,
                    ProductVariant.status == 'ACTIVE'
                ).all():
                    if variant not in updated_variants:
                        variant.is_default = False

                VariantService.normalize_default_variant(product_id)

            product.updated_at = now
            VariantService.sync_product_stock(product.product_id)
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'product_id': product.product_id,
                    'product_name': product.product_name,
                    'slug': product.slug,
                    'price': float(product.price),
                    'stock_quantity': product.stock_quantity,
                    'status': product.status,
                    'variants': [
                        VariantService.serialize_variant(variant)
                        for variant in db.session.query(ProductVariant).filter(
                            ProductVariant.product_id == product.product_id,
                            ProductVariant.status == 'ACTIVE'
                        ).order_by(ProductVariant.is_default.desc(), ProductVariant.variant_id.asc()).all()
                    ]
                }
            }, 200
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_variant(user_id, product_id, variant_id, sku_code=None,
                       variant_name=None, price=None, stock_quantity=None,
                       status=None, is_default=None):
        try:
            store_id = SellerProductService.get_seller_store(user_id)
            if not store_id:
                return {'success': False, 'message': 'Bạn không phải chủ cửa hàng'}, 403

            product = db.session.query(Product).filter(
                Product.product_id == product_id,
                Product.store_id == store_id,
                Product.deleted_at.is_(None)
            ).first()
            if not product:
                return {'success': False, 'message': 'Sản phẩm không tồn tại'}, 404

            variant = db.session.query(ProductVariant).filter(
                ProductVariant.variant_id == variant_id,
                ProductVariant.product_id == product_id,
                ProductVariant.store_id == store_id
            ).first()
            if not variant:
                return {'success': False, 'message': 'Variant không thuộc sản phẩm'}, 404

            if sku_code is not None:
                normalized_sku = str(sku_code).strip()
                if not normalized_sku:
                    return {'success': False, 'message': 'sku_code không được để trống'}, 400
                duplicate = db.session.query(ProductVariant).filter(
                    ProductVariant.store_id == store_id,
                    ProductVariant.sku_code == normalized_sku,
                    ProductVariant.variant_id != variant_id
                ).first()
                if duplicate:
                    return {'success': False, 'message': 'SKU đã tồn tại'}, 409
                variant.sku_code = normalized_sku

            if variant_name is not None:
                normalized_name = str(variant_name).strip()
                if not normalized_name:
                    return {'success': False, 'message': 'variant_name không được để trống'}, 400
                variant.variant_name = normalized_name

            if price is not None:
                if not isinstance(price, (int, float)) or isinstance(price, bool) or price <= 0:
                    return {'success': False, 'message': 'Giá variant phải > 0'}, 400
                variant.price = price

            if stock_quantity is not None:
                if not isinstance(stock_quantity, int) or isinstance(stock_quantity, bool) or stock_quantity < 0:
                    return {'success': False, 'message': 'Tồn kho variant không được âm'}, 400
                variant.stock_quantity = stock_quantity

            if status is not None:
                normalized_status = str(status).strip().upper()
                if normalized_status not in ('ACTIVE', 'INACTIVE'):
                    return {'success': False, 'message': 'Trạng thái variant không hợp lệ'}, 400
                variant.status = normalized_status

            if is_default is not None and not isinstance(is_default, bool):
                return {'success': False, 'message': 'is_default phải là boolean'}, 400
            if is_default is True:
                if variant.status != 'ACTIVE':
                    return {'success': False, 'message': 'Default variant phải ở trạng thái ACTIVE'}, 400
                for sibling in db.session.query(ProductVariant).filter(
                    ProductVariant.product_id == product_id
                ).all():
                    sibling.is_default = sibling.variant_id == variant_id
            elif is_default is False:
                variant.is_default = False

            variant.updated_at = datetime.now(pytz.UTC)
            db.session.flush()
            VariantService.normalize_default_variant(product_id)
            VariantService.sync_product_stock(product_id)
            db.session.commit()

            return {
                'success': True,
                'data': {
                    'product_id': product.product_id,
                    'product_stock_quantity': product.stock_quantity,
                    'variant': VariantService.serialize_variant(variant)
                }
            }, 200
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def delete_product(user_id, product_id):
        try:
            store_id = SellerProductService.get_seller_store(user_id)
            if not store_id:
                return {'success': False, 'message': 'NgÆ°á»i dÃ¹ng khÃ´ng pháº£i chá»§ cá»­a hÃ ng'}, 403

            product = db.session.query(Product).filter(
                Product.product_id == product_id,
                Product.store_id == store_id
            ).first()

            if not product:
                return {'success': False, 'message': 'Sáº£n pháº©m khÃ´ng tá»“n táº¡i'}, 404

            utc = pytz.UTC
            now = datetime.now(utc)

            product.status = 'INACTIVE'
            product.deleted_at = now
            product.updated_at = now

            store = db.session.query(Store).filter(Store.store_id == store_id).first()
            if store and store.total_products > 0:
                store.total_products -= 1
                store.updated_at = now

            db.session.commit()

            return {
                'success': True,
                'message': 'ÄÃ£ áº©n sáº£n pháº©m'
            }, 200
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_seller_products(user_id, page=1, limit=20, status=None, keyword=None):
        try:
            store_id = SellerProductService.get_seller_store(user_id)
            if not store_id:
                return {'success': False, 'message': 'NgÆ°á»i dÃ¹ng khÃ´ng pháº£i chá»§ cá»­a hÃ ng'}, 403

            offset = (page - 1) * limit

            query = db.session.query(Product).filter(
                Product.store_id == store_id,
                Product.deleted_at.is_(None)
            )

            if status:
                query = query.filter(Product.status == status)

            if keyword:
                query = query.filter(Product.product_name.ilike(f'%{keyword}%'))

            total_items = query.count()
            total_pages = (total_items + limit - 1) // limit

            products = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()

            products_list = []
            for product in products:
                images = db.session.query(ProductImage).filter(
                    ProductImage.product_id == product.product_id
                ).all()
                variants = db.session.query(ProductVariant).filter(
                    ProductVariant.product_id == product.product_id,
                    ProductVariant.status == 'ACTIVE'
                ).order_by(ProductVariant.is_default.desc(), ProductVariant.variant_id.asc()).all()
                if not variants:
                    variants = [VariantService.get_or_create_default_variant(product)]
                default_variant = next((variant for variant in variants if variant.is_default), variants[0] if variants else None)

                products_list.append({
                    'product_id': product.product_id,
                    'product_name': product.product_name,
                    'slug': product.slug,
                    'default_variant_id': default_variant.variant_id if default_variant else None,
                    'sku_code': default_variant.sku_code if default_variant else product.sku,
                    'variant_count': len(variants),
                    'variants': [VariantService.serialize_variant(variant) for variant in variants],
                    'price': float(default_variant.price if default_variant else product.price),
                    'stock_quantity': (default_variant.stock_quantity if default_variant else product.stock_quantity) or 0,
                    'status': product.status,
                    'images': [{'image_url': img.image_url, 'is_primary': img.is_primary} for img in images]
                })

            db.session.commit()

            return {
                'success': True,
                'data': {
                    'products': products_list,
                    'pagination': {
                        'current_page': page,
                        'per_page': limit,
                        'total_items': total_items,
                        'total_pages': total_pages
                    }
                }
            }, 200
        except Exception as e:
            raise e

    @staticmethod
    def create_shipment(seller_id, order_id):
        try:
            # 1. KIá»‚M TRA ÄIá»€U KIá»†N (Validation)
            order = Order.query.filter_by(order_id=order_id, store_id=seller_id).first()
            if not order:
                return {'success': False, 'message': 'ÄÆ¡n hÃ ng khÃ´ng tá»“n táº¡i hoáº·c khÃ´ng thuá»™c cá»­a hÃ ng cá»§a báº¡n.'}, 404
            
            if order.order_status != 'CONFIRMED':
                return {'success': False, 'message': f'Chá»‰ Ä‘Æ°á»£c táº¡o váº­n Ä‘Æ¡n cho Ä‘Æ¡n Ä‘Ã£ xÃ¡c nháº­n (CONFIRMED). Tráº¡ng thÃ¡i hiá»‡n táº¡i: {order.order_status}'}, 400

            # Äáº£m báº£o Ä‘Æ¡n nÃ y chÆ°a bá»‹ táº¡o trÃ¹ng váº­n Ä‘Æ¡n trÆ°á»›c Ä‘Ã³
            existing_shipment = Shipment.query.filter_by(order_id=order_id).first()
            if existing_shipment:
                return {'success': False, 'message': 'ÄÆ¡n hÃ ng nÃ y Ä‘Ã£ Ä‘Æ°á»£c táº¡o mÃ£ váº­n Ä‘Æ¡n rá»“i!'}, 400

            # 2. Gá»ŒI API BÃŠN THá»¨ 3 (GIAO HÃ€NG TIáº¾T KIá»†M - GHTK)
            # Há»‡ thá»‘ng sáº½ "nÃ³i chuyá»‡n" vá»›i GHTK Ä‘á»ƒ láº¥y mÃ£ tháº­t
            tracking_code = SellerOrderService._call_logistics_api(order)
            
            now = datetime.utcnow()

            # 3. GHI NHáº¬N THá»°C THá»‚ SHIPMENT Má»šI
            new_shipment = Shipment(
                order_id=order.order_id,
                tracking_code=tracking_code,
                shipment_status='PENDING_ASSIGNMENT', # Chá» phÃ¢n cÃ´ng tÃ i xáº¿
                shipping_note=order.customer_note,    # Chuyá»ƒn lá»i nháº¯n cá»§a khÃ¡ch sang cho Shipper Ä‘á»c
                created_at=now,
                updated_at=now
            )
            db.session.add(new_shipment)

            # 4. Tá»° Äá»˜NG CHUYá»‚N TRáº NG THÃI ÄÆ N HÃ€NG (Trigger)
            order.order_status = 'READY_TO_SHIP'
            order.updated_at = now

            # 5. GHI Lá»ŠCH Sá»¬ ÄÆ N HÃ€NG TRACEABILITY
            history = OrderStatusHistory(
                order_id=order.order_id,
                prev_status='CONFIRMED',
                new_status='READY_TO_SHIP',
                changed_by=seller_id,
                note=f"Đã đăng ký vận chuyển thành công. Mã vận đơn: {tracking_code}",
                created_at=now
            )
            db.session.add(history)

            # CHá»T GIAO Dá»ŠCH DATABASE
            db.session.commit()

            return {
                'success': True,
                'message': 'ÄÃ£ táº¡o mÃ£ váº­n Ä‘Æ¡n thÃ nh cÃ´ng.',
                'data': {
                    'order_id': order.order_id,
                    'tracking_code': tracking_code,
                    'order_status': order.order_status
                }
            }, 201  # HTTP 201: DÃ nh riÃªng cho viá»‡c Create (Táº¡o má»›i) thÃ nh cÃ´ng

        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def _call_logistics_api(order):
        """
        HÃ€M GIáº¢ Láº¬P Káº¾T Ná»I API Äá»I TÃC Váº¬N CHUYá»‚N (GHTK / GHN)
        Em hÃ£y trÃ¬nh bÃ y hÃ m nÃ y cho mentor xem Ä‘á»ƒ chá»©ng minh há»‡ thá»‘ng cá»§a em cÃ³ tÆ° duy thá»±c chiáº¿n.
        """
        import time
        import random
        import string
        
        # [THá»°C Táº¾ DOANH NGHIá»†P] - Em sáº½ dÃ¹ng thÆ° viá»‡n requests Ä‘á»ƒ káº¿t ná»‘i network:
        # import requests
        # payload = {
        #     "to_name": order.recipient_name,
        #     "to_phone": order.recipient_phone,
        #     "to_address": order.shipping_address_line,
        #     "weight": 500 # TÃ­nh báº±ng gram
        # }
        # headers = {'Token': 'API_TOKEN_GHTK'}
        # response = requests.post("https://services.ghtk.vn/services/shipment/order", json=payload, headers=headers)
        # return response.json()['order']['label']

        # [MÃ” PHá»ŽNG CHO Äá»’ ÃN MÃ”N Há»ŒC] 
        # Äá»ƒ trÃ¡nh viá»‡c lÃºc demo lÃªn lá»›p máº¡ng bá»‹ lag/cháº¿t, ta dÃ¹ng hÃ m time.sleep Ä‘á»ƒ mÃ´ phá»ng Ä‘á»™ trá»… máº¡ng
        time.sleep(0.5) 
        
        # Sinh mÃ£ giáº£ láº­p y há»‡t chuáº©n mÃ£ cá»§a Giao HÃ ng Tiáº¿t Kiá»‡m (GHTK): VD: GHTK-837492103
        random_code = ''.join(random.choices(string.digits, k=9))
        return f"GHTK-{random_code}"
    
@staticmethod
def update_item_qty(customer_id, cart_item_id, quantity):
    try:
        if quantity < 1:
            return {'success': False, 'message': 'Sá»‘ lÆ°á»£ng pháº£i >= 1'}, 400

        cart = db.session.query(Cart).filter(
            Cart.customer_id == customer_id,
            Cart.status == 'ACTIVE'
        ).first()

        if not cart:
            return {'success': False, 'message': 'Giá» hÃ ng khÃ´ng tá»“n táº¡i'}, 404

        item = db.session.query(CartItem).filter(
            CartItem.cart_item_id == cart_item_id,
            CartItem.cart_id == cart.cart_id
        ).first()

        if not item:
            return {'success': False, 'message': 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng'}, 404

        variant = db.session.query(ProductVariant).filter(
            ProductVariant.variant_id == item.variant_id
        ).first()

        if not variant or variant.stock_quantity < quantity:
            stock = variant.stock_quantity if variant else 0
            return {
                'success': False,
                'message': f'KhÃ´ng Ä‘á»§ hÃ ng trong kho. Tá»“n kho: {stock}'
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
                'quantity': item.quantity,
                'price_at_added': float(item.price_at_added),
            }
        }, 200

    except Exception as e:
        db.session.rollback()
        raise e
