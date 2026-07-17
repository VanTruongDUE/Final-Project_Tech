SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dbo.stores')
      AND name = 'CK_stores_status'
)
BEGIN
    ALTER TABLE dbo.stores DROP CONSTRAINT CK_stores_status;
END;

ALTER TABLE dbo.stores WITH CHECK
ADD CONSTRAINT CK_stores_status
CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'));

ALTER TABLE dbo.stores CHECK CONSTRAINT CK_stores_status;

COMMIT TRANSACTION;
