"""Read-only final integrity audit for the configured TechTonic SQL Server."""

from sqlalchemy import text

from app import create_app
from extensions import db


CHECKS = {
    "fk_disabled_or_untrusted": """
        SELECT COUNT(*) FROM sys.foreign_keys
        WHERE is_disabled = 1 OR is_not_trusted = 1
    """,
    "product_missing_or_default_variant": """
        SELECT COUNT(*) FROM products p
        WHERE NOT EXISTS (
            SELECT 1 FROM product_variants v WHERE v.product_id = p.product_id
        ) OR (
            p.status = 'ACTIVE' AND p.deleted_at IS NULL AND NOT EXISTS (
                SELECT 1 FROM product_variants v
                WHERE v.product_id = p.product_id
                  AND v.status = 'ACTIVE' AND v.is_default = 1
            )
        ) OR 1 < (
            SELECT COUNT(*) FROM product_variants v
            WHERE v.product_id = p.product_id
              AND v.status = 'ACTIVE' AND v.is_default = 1
        )
    """,
    "duplicate_sku": """
        SELECT COUNT(*) FROM (
            SELECT store_id, sku_code FROM product_variants
            GROUP BY store_id, sku_code HAVING COUNT(*) > 1
        ) duplicates
    """,
    "negative_stock": """
        SELECT
          (SELECT COUNT(*) FROM products WHERE stock_quantity < 0) +
          (SELECT COUNT(*) FROM product_variants WHERE stock_quantity < 0)
    """,
    "product_stock_mismatch": """
        SELECT COUNT(*) FROM products p
        OUTER APPLY (
            SELECT COALESCE(SUM(v.stock_quantity), 0) AS variant_stock
            FROM product_variants v
            WHERE v.product_id = p.product_id AND v.status = 'ACTIVE'
        ) totals
        WHERE p.stock_quantity <> totals.variant_stock
    """,
    "cart_variant_mismatch": """
        SELECT COUNT(*) FROM cart_items ci
        LEFT JOIN product_variants v ON v.variant_id = ci.variant_id
        WHERE v.variant_id IS NULL OR ci.product_id <> v.product_id
    """,
    "order_item_snapshot_missing": """
        SELECT COUNT(*) FROM order_items
        WHERE variant_id IS NULL
           OR NULLIF(LTRIM(RTRIM(product_name_snapshot)), '') IS NULL
           OR NULLIF(LTRIM(RTRIM(sku_code_snapshot)), '') IS NULL
           OR NULLIF(LTRIM(RTRIM(variant_name_snapshot)), '') IS NULL
    """,
    "order_total_mismatch": """
        SELECT COUNT(*) FROM orders o
        OUTER APPLY (
            SELECT COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS line_sum
            FROM order_items oi WHERE oi.order_id = o.order_id
        ) totals
        WHERE ABS(o.subtotal_amount - totals.line_sum) > 0.01
           OR ABS(o.total_amount - (o.subtotal_amount - o.discount_amount + o.shipping_fee)) > 0.01
    """,
    "voucher_counter_mismatch": """
        SELECT COUNT(*) FROM vouchers v
        OUTER APPLY (
            SELECT COUNT(*) AS applied_count FROM order_vouchers ov
            WHERE ov.voucher_id = v.voucher_id AND ov.application_status = 'APPLIED'
        ) totals
        WHERE v.used_count <> totals.applied_count
    """,
    "voucher_snapshot_missing": """
        SELECT COUNT(*) FROM order_vouchers
        WHERE NULLIF(LTRIM(RTRIM(voucher_code_snapshot)), '') IS NULL
           OR NULLIF(LTRIM(RTRIM(discount_type_snapshot)), '') IS NULL
           OR discount_value_snapshot IS NULL OR discount_amount IS NULL
    """,
    "review_orphan_or_incomplete_order": """
        SELECT COUNT(*) FROM reviews r
        LEFT JOIN users u ON u.user_id = r.customer_id
        LEFT JOIN products p ON p.product_id = r.product_id
        LEFT JOIN order_items oi ON oi.order_item_id = r.order_item_id
        LEFT JOIN orders o ON o.order_id = oi.order_id
        WHERE u.user_id IS NULL OR p.product_id IS NULL OR oi.order_item_id IS NULL
           OR o.order_id IS NULL OR o.customer_id <> r.customer_id
           OR oi.product_id <> r.product_id OR o.order_status <> 'COMPLETED'
    """,
    "conversation_message_orphan": """
        SELECT
          (SELECT COUNT(*) FROM conversations c
           LEFT JOIN users u ON u.user_id = c.customer_id
           LEFT JOIN stores s ON s.store_id = c.store_id
           LEFT JOIN orders o ON o.order_id = c.order_id
           WHERE u.user_id IS NULL OR s.store_id IS NULL
              OR (c.order_id IS NOT NULL AND o.order_id IS NULL)) +
          (SELECT COUNT(*) FROM messages m
           LEFT JOIN conversations c ON c.conversation_id = m.conversation_id
           LEFT JOIN users u ON u.user_id = m.sender_user_id
           WHERE c.conversation_id IS NULL OR u.user_id IS NULL)
    """,
    "duplicate_user_role": """
        SELECT COUNT(*) FROM (
            SELECT user_id, role_id FROM user_roles
            GROUP BY user_id, role_id HAVING COUNT(*) > 1
        ) duplicates
    """,
    "store_owner_orphan": """
        SELECT COUNT(*) FROM user_stores us
        LEFT JOIN users u ON u.user_id = us.user_id
        LEFT JOIN stores s ON s.store_id = us.store_id
        WHERE us.store_member_role = 'OWNER'
          AND (u.user_id IS NULL OR s.store_id IS NULL)
    """,
    "active_store_without_owner": """
        SELECT COUNT(*) FROM stores s
        WHERE s.status = 'ACTIVE' AND s.deleted_at IS NULL
          AND NOT EXISTS (
              SELECT 1 FROM user_stores us
              WHERE us.store_id = s.store_id
                AND us.store_member_role = 'OWNER' AND us.is_active = 1
          )
    """,
    "seller_without_active_or_pending_store": """
        SELECT COUNT(*) FROM users u
        WHERE u.deleted_at IS NULL
          AND EXISTS (
              SELECT 1 FROM user_roles ur JOIN roles r ON r.role_id = ur.role_id
              WHERE ur.user_id = u.user_id AND ur.status = 'ACTIVE'
                AND r.role_code = 'SELLER'
          )
          AND NOT EXISTS (
              SELECT 1 FROM user_stores us JOIN stores s ON s.store_id = us.store_id
              WHERE us.user_id = u.user_id AND us.store_member_role = 'OWNER'
                AND us.is_active = 1 AND s.deleted_at IS NULL
                AND s.status IN ('ACTIVE', 'PENDING')
          )
    """,
}


def count_fk_orphans():
    rows = db.session.execute(text("""
        SELECT fk.name AS fk_name,
               OBJECT_SCHEMA_NAME(fk.parent_object_id) AS child_schema,
               OBJECT_NAME(fk.parent_object_id) AS child_table,
               OBJECT_SCHEMA_NAME(fk.referenced_object_id) AS parent_schema,
               OBJECT_NAME(fk.referenced_object_id) AS parent_table,
               pc.name AS child_column,
               rc.name AS parent_column
        FROM sys.foreign_keys fk
        JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
        JOIN sys.columns pc ON pc.object_id = fk.parent_object_id
                           AND pc.column_id = fkc.parent_column_id
        JOIN sys.columns rc ON rc.object_id = fk.referenced_object_id
                           AND rc.column_id = fkc.referenced_column_id
        ORDER BY fk.name, fkc.constraint_column_id
    """)).mappings().all()
    groups = {}
    for row in rows:
        groups.setdefault(row["fk_name"], []).append(row)
    total = 0
    for columns in groups.values():
        first = columns[0]
        join = " AND ".join(
            f"child.[{column['child_column']}] = parent.[{column['parent_column']}]"
            for column in columns
        )
        not_null = " AND ".join(
            f"child.[{column['child_column']}] IS NOT NULL" for column in columns
        )
        parent_missing = f"parent.[{columns[0]['parent_column']}] IS NULL"
        query = text(
            f"SELECT COUNT(*) FROM [{first['child_schema']}].[{first['child_table']}] child "
            f"LEFT JOIN [{first['parent_schema']}].[{first['parent_table']}] parent ON {join} "
            f"WHERE {not_null} AND {parent_missing}"
        )
        total += int(db.session.execute(query).scalar() or 0)
    return total


def main():
    app = create_app()
    failures = 0
    with app.app_context():
        results = {"fk_orphan": count_fk_orphans()}
        for name, query in CHECKS.items():
            results[name] = int(db.session.execute(text(query)).scalar() or 0)
        for name, count in results.items():
            print(f"{name}: {count}")
            failures += count
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
