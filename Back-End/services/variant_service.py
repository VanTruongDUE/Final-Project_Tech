from datetime import datetime

from extensions import db
from models.product import Product
from models.product_variant import ProductVariant
from sqlalchemy import func


class VariantService:
    @staticmethod
    def sync_product_stock(product_ids):
        """Derive aggregate product stock from ACTIVE variants without committing."""
        if isinstance(product_ids, (int, str)):
            product_ids = [product_ids]

        normalized_ids = {int(product_id) for product_id in product_ids if product_id is not None}
        if not normalized_ids:
            return {}

        # Make pending variant changes visible to the aggregate query. The caller
        # still owns the transaction and can commit or roll it back atomically.
        db.session.flush()

        rows = (
            db.session.query(
                ProductVariant.product_id,
                func.coalesce(func.sum(ProductVariant.stock_quantity), 0)
            )
            .filter(
                ProductVariant.product_id.in_(normalized_ids),
                ProductVariant.status == 'ACTIVE'
            )
            .group_by(ProductVariant.product_id)
            .all()
        )
        stock_by_product = {product_id: int(stock or 0) for product_id, stock in rows}
        now = datetime.utcnow()

        products = db.session.query(Product).filter(Product.product_id.in_(normalized_ids)).all()
        for product in products:
            product.stock_quantity = stock_by_product.get(product.product_id, 0)
            product.updated_at = now

        return {product.product_id: product.stock_quantity for product in products}

    @staticmethod
    def serialize_variant(variant):
        if not variant:
            return None

        return {
            'variant_id': variant.variant_id,
            'sku_code': variant.sku_code,
            'variant_name': variant.variant_name,
            'option1_name': variant.option1_name,
            'option1_value': variant.option1_value,
            'option2_name': variant.option2_name,
            'option2_value': variant.option2_value,
            'price': float(variant.price),
            'stock_quantity': variant.stock_quantity or 0,
            'status': variant.status,
            'is_default': bool(variant.is_default),
        }

    @staticmethod
    def get_default_variant(product_id, active_only=True):
        query = db.session.query(ProductVariant).filter(
            ProductVariant.product_id == product_id,
            ProductVariant.is_default == True
        )

        if active_only:
            query = query.filter(ProductVariant.status == 'ACTIVE')

        return query.order_by(ProductVariant.variant_id.asc()).first()

    @staticmethod
    def get_or_create_default_variant(product):
        variant = VariantService.get_default_variant(product.product_id, active_only=True)
        if variant:
            return variant

        fallback_sku = product.sku or f'SKU-PROD-{product.product_id}'
        existing_sku = db.session.query(ProductVariant).filter(
            ProductVariant.store_id == product.store_id,
            ProductVariant.sku_code == fallback_sku
        ).first()

        if existing_sku and existing_sku.product_id != product.product_id:
            fallback_sku = f'SKU-PROD-{product.product_id}'

        now = datetime.utcnow()
        variant = ProductVariant(
            product_id=product.product_id,
            store_id=product.store_id,
            sku_code=fallback_sku,
            variant_name='Mặc định',
            price=product.price,
            stock_quantity=product.stock_quantity or 0,
            status='ACTIVE',
            is_default=True,
            created_at=now,
            updated_at=now
        )
        db.session.add(variant)
        db.session.flush()
        return variant

    @staticmethod
    def resolve_variant(product, variant_id=None):
        if variant_id:
            variant = db.session.query(ProductVariant).filter(
                ProductVariant.variant_id == variant_id,
                ProductVariant.product_id == product.product_id,
                ProductVariant.status == 'ACTIVE'
            ).first()

            if not variant:
                return None

            return variant

        return VariantService.get_or_create_default_variant(product)

    @staticmethod
    def normalize_default_variant(product_id):
        all_variants = db.session.query(ProductVariant).filter(
            ProductVariant.product_id == product_id
        ).order_by(ProductVariant.variant_id.asc()).all()
        variants = [variant for variant in all_variants if variant.status == 'ACTIVE']

        if not variants:
            for variant in all_variants:
                variant.is_default = False
            return None

        default_variants = [variant for variant in variants if variant.is_default]
        selected_default = default_variants[0] if default_variants else variants[0]

        # SQL Server enforces one default variant per product. Clear the old
        # default first so switching it cannot violate the filtered unique index
        # because of UPDATE ordering inside one flush.
        for variant in all_variants:
            variant.is_default = False
        db.session.flush()
        selected_default.is_default = True

        return selected_default
