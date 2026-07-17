-- PHASE SKU-2 BACKEND FIX
-- Safe to run multiple times on SQL Server.

IF OBJECT_ID('dbo.product_variants', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.product_variants (
        variant_id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        store_id BIGINT NOT NULL,
        sku_code VARCHAR(50) NOT NULL,
        variant_name NVARCHAR(150) NOT NULL,
        option1_name NVARCHAR(50) NULL,
        option1_value NVARCHAR(50) NULL,
        option2_name NVARCHAR(50) NULL,
        option2_value NVARCHAR(50) NULL,
        price DECIMAL(18,2) NOT NULL,
        stock_quantity INT NOT NULL CONSTRAINT DF_product_variants_stock DEFAULT 0,
        status VARCHAR(20) NOT NULL CONSTRAINT DF_product_variants_status DEFAULT 'ACTIVE',
        is_default BIT NOT NULL CONSTRAINT DF_product_variants_is_default DEFAULT 0,
        created_at DATETIME2 NULL CONSTRAINT DF_product_variants_created DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NULL CONSTRAINT DF_product_variants_updated DEFAULT SYSUTCDATETIME()
    );
END;

IF COL_LENGTH('dbo.product_variants', 'store_id') IS NULL
    ALTER TABLE dbo.product_variants ADD store_id BIGINT NULL;

IF COL_LENGTH('dbo.product_variants', 'option1_name') IS NULL
    ALTER TABLE dbo.product_variants ADD option1_name NVARCHAR(50) NULL;

IF COL_LENGTH('dbo.product_variants', 'option1_value') IS NULL
    ALTER TABLE dbo.product_variants ADD option1_value NVARCHAR(50) NULL;

IF COL_LENGTH('dbo.product_variants', 'option2_name') IS NULL
    ALTER TABLE dbo.product_variants ADD option2_name NVARCHAR(50) NULL;

IF COL_LENGTH('dbo.product_variants', 'option2_value') IS NULL
    ALTER TABLE dbo.product_variants ADD option2_value NVARCHAR(50) NULL;

IF COL_LENGTH('dbo.product_variants', 'is_default') IS NULL
    ALTER TABLE dbo.product_variants ADD is_default BIT NOT NULL CONSTRAINT DF_product_variants_is_default_2 DEFAULT 0;

IF COL_LENGTH('dbo.cart_items', 'variant_id') IS NULL
    ALTER TABLE dbo.cart_items ADD variant_id BIGINT NULL;

IF COL_LENGTH('dbo.order_items', 'variant_id') IS NULL
    ALTER TABLE dbo.order_items ADD variant_id BIGINT NULL;

IF COL_LENGTH('dbo.order_items', 'sku_code_snapshot') IS NULL
    ALTER TABLE dbo.order_items ADD sku_code_snapshot VARCHAR(50) NULL;

IF COL_LENGTH('dbo.order_items', 'variant_name_snapshot') IS NULL
    ALTER TABLE dbo.order_items ADD variant_name_snapshot NVARCHAR(150) NULL;

IF COL_LENGTH('dbo.user_stores', 'deleted_at') IS NULL
    ALTER TABLE dbo.user_stores ADD deleted_at DATETIME2 NULL;

IF COL_LENGTH('dbo.orders', 'deleted_at') IS NULL
    ALTER TABLE dbo.orders ADD deleted_at DATETIME2 NULL;

IF COL_LENGTH('dbo.shipments', 'carrier') IS NULL
    ALTER TABLE dbo.shipments ADD carrier NVARCHAR(100) NULL;

IF COL_LENGTH('dbo.shipments', 'status') IS NULL
    ALTER TABLE dbo.shipments ADD status VARCHAR(30) NULL;

IF COL_LENGTH('dbo.shipments', 'shipped_at') IS NULL
    ALTER TABLE dbo.shipments ADD shipped_at DATETIME2 NULL;

UPDATE dbo.shipments
SET status = shipment_status
WHERE status IS NULL;

UPDATE dbo.shipments
SET shipped_at = picked_up_at
WHERE shipped_at IS NULL AND picked_up_at IS NOT NULL;

DECLARE @dropSql NVARCHAR(MAX) = N'';

SELECT @dropSql = @dropSql + N'ALTER TABLE dbo.cart_items DROP CONSTRAINT ' + QUOTENAME(kc.name) + N';'
FROM sys.key_constraints kc
JOIN sys.index_columns ic ON ic.object_id = kc.parent_object_id AND ic.index_id = kc.unique_index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE kc.parent_object_id = OBJECT_ID('dbo.cart_items')
  AND kc.[type] = 'UQ'
GROUP BY kc.name, kc.parent_object_id, kc.unique_index_id
HAVING SUM(CASE WHEN c.name IN ('cart_id', 'product_id') THEN 1 ELSE 0 END) = 2
   AND COUNT(*) = 2;

IF @dropSql <> N''
    EXEC sp_executesql @dropSql;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.cart_items')
      AND name = 'UX_cart_items_cart_variant'
)
BEGIN
    CREATE UNIQUE INDEX UX_cart_items_cart_variant
    ON dbo.cart_items(cart_id, variant_id)
    WHERE variant_id IS NOT NULL;
END;

UPDATE pv
SET store_id = p.store_id
FROM dbo.product_variants pv
JOIN dbo.products p ON p.product_id = pv.product_id
WHERE pv.store_id IS NULL;

INSERT INTO dbo.product_variants
    (product_id, store_id, sku_code, variant_name, price, stock_quantity, status, is_default, created_at, updated_at)
SELECT
    p.product_id,
    p.store_id,
    COALESCE(NULLIF(p.sku, ''), CONCAT('SKU-PROD-', p.product_id)),
    N'Mặc định',
    p.price,
    ISNULL(p.stock_quantity, 0),
    'ACTIVE',
    1,
    SYSUTCDATETIME(),
    SYSUTCDATETIME()
FROM dbo.products p
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.product_variants pv
    WHERE pv.product_id = p.product_id
);

;WITH ranked AS (
    SELECT
        variant_id,
        product_id,
        ROW_NUMBER() OVER (
            PARTITION BY product_id
            ORDER BY CASE WHEN is_default = 1 THEN 0 ELSE 1 END, variant_id
        ) AS rn
    FROM dbo.product_variants
    WHERE status = 'ACTIVE'
)
UPDATE pv
SET is_default = CASE WHEN ranked.rn = 1 THEN 1 ELSE 0 END
FROM dbo.product_variants pv
JOIN ranked ON ranked.variant_id = pv.variant_id;

UPDATE ci
SET variant_id = pv.variant_id,
    price_at_added = pv.price
FROM dbo.cart_items ci
JOIN dbo.product_variants pv
    ON pv.product_id = ci.product_id
   AND pv.is_default = 1
   AND pv.status = 'ACTIVE'
WHERE ci.variant_id IS NULL;

UPDATE oi
SET variant_id = pv.variant_id,
    sku_code_snapshot = COALESCE(oi.sku_code_snapshot, pv.sku_code),
    variant_name_snapshot = COALESCE(oi.variant_name_snapshot, pv.variant_name)
FROM dbo.order_items oi
JOIN dbo.product_variants pv
    ON pv.product_id = oi.product_id
   AND pv.is_default = 1
   AND pv.status = 'ACTIVE'
WHERE oi.variant_id IS NULL
   OR oi.sku_code_snapshot IS NULL
   OR oi.variant_name_snapshot IS NULL;
