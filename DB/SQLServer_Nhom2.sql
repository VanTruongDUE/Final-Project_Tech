
/*
  Project: Nhóm 2 - Sàn thương mại điện tử đa ngành
  Database: SQL Server
  Version: V3 Final Baseline
  Decisions:
  - 4 roles: CUSTOMER, SELLER, ADMIN, SHIPPER
  - JWT access token + refresh token
  - Forgot password: Email OTP mock/demo
  - Keep stores.total_products, products.sold_quantity as cache/stat columns
  - Keep reviews.product_id, reviews.customer_id with backend validation
  - Keep conversations.order_id nullable
  - Keep shipments for SHIPPER role
  - Drop voucher_usages; merge into order_vouchers
*/

IF DB_ID(N'TechTonicEcommerce_Nhom2') IS NULL
BEGIN
    CREATE DATABASE TechTonicEcommerce_Nhom2;
END;
GO

USE TechTonicEcommerce_Nhom2;
GO

/* Drop tables in reverse dependency order for re-run during development */
DROP TABLE IF EXISTS order_vouchers;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_status_histories;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS user_stores;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS password_reset_requests;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
GO

CREATE TABLE users (
    user_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_users PRIMARY KEY,
    email NVARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(150) NOT NULL,
    avatar_url NVARCHAR(500) NULL,
    gender VARCHAR(10) NULL,
    birth_date DATE NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_users_status DEFAULT 'ACTIVE',
    google_id NVARCHAR(255) NULL,
    facebook_id NVARCHAR(255) NULL,
    last_login_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_users_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT CK_users_login_identifier CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT CK_users_gender CHECK (gender IS NULL OR gender IN ('MALE','FEMALE','OTHER')),
    CONSTRAINT CK_users_status CHECK (status IN ('ACTIVE','SUSPENDED'))
);
GO
CREATE UNIQUE INDEX UX_users_email_not_null ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX UX_users_phone_not_null ON users(phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX UX_users_google_id_not_null ON users(google_id) WHERE google_id IS NOT NULL;
CREATE UNIQUE INDEX UX_users_facebook_id_not_null ON users(facebook_id) WHERE facebook_id IS NOT NULL;
GO

CREATE TABLE roles (
    role_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_roles PRIMARY KEY,
    role_code VARCHAR(30) NOT NULL,
    role_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NULL,
    is_system_role BIT NOT NULL CONSTRAINT DF_roles_is_system_role DEFAULT 1,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_roles_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_roles_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_roles_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UX_roles_role_code UNIQUE (role_code),
    CONSTRAINT CK_roles_status CHECK (status IN ('ACTIVE','SUSPENDED'))
);
GO

CREATE TABLE permissions (
    permission_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_permissions PRIMARY KEY,
    permission_code VARCHAR(80) NOT NULL,
    permission_name NVARCHAR(150) NOT NULL,
    module_code VARCHAR(30) NOT NULL,
    action_code VARCHAR(30) NOT NULL,
    requirement_id TINYINT NULL,
    is_core BIT NOT NULL CONSTRAINT DF_permissions_is_core DEFAULT 1,
    description NVARCHAR(500) NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_permissions_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_permissions_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_permissions_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UX_permissions_permission_code UNIQUE (permission_code),
    CONSTRAINT CK_permissions_requirement_id CHECK (requirement_id IS NULL OR requirement_id BETWEEN 1 AND 38),
    CONSTRAINT CK_permissions_status CHECK (status IN ('ACTIVE','INACTIVE'))
);
GO
CREATE INDEX IX_permissions_module ON permissions(module_code);
CREATE INDEX IX_permissions_requirement ON permissions(requirement_id);
GO

CREATE TABLE user_roles (
    user_role_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_user_roles PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_user_roles_status DEFAULT 'ACTIVE',
    assigned_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_roles_assigned_at DEFAULT SYSUTCDATETIME(),
    revoked_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_roles_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_roles_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_user_roles_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_user_roles_roles FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT FK_user_roles_assigned_by FOREIGN KEY (assigned_by_user_id) REFERENCES users(user_id),
    CONSTRAINT UX_user_roles_user_role UNIQUE (user_id, role_id),
    CONSTRAINT CK_user_roles_status CHECK (status IN ('ACTIVE','REVOKED'))
);
GO

CREATE TABLE role_permissions (
    role_permission_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_role_permissions PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    access_scope VARCHAR(30) NOT NULL,
    is_allowed BIT NOT NULL CONSTRAINT DF_role_permissions_is_allowed DEFAULT 1,
    granted_by_user_id BIGINT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_role_permissions_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_role_permissions_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_role_permissions_roles FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT FK_role_permissions_permissions FOREIGN KEY (permission_id) REFERENCES permissions(permission_id),
    CONSTRAINT FK_role_permissions_granted_by FOREIGN KEY (granted_by_user_id) REFERENCES users(user_id),
    CONSTRAINT UX_role_permissions_role_permission UNIQUE (role_id, permission_id),
    CONSTRAINT CK_role_permissions_scope CHECK (access_scope IN ('ALL','SELF','OWN_STORE','PUBLIC','ASSIGNED_ORDER','CONDITION'))
);
GO

CREATE TABLE password_reset_requests (
    reset_request_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_password_reset_requests PRIMARY KEY,
    user_id BIGINT NOT NULL,
    destination_masked NVARCHAR(255) NOT NULL,
    otp_hash NVARCHAR(255) NOT NULL,
    expires_at DATETIME2(0) NOT NULL,
    verified_at DATETIME2(0) NULL,
    used_at DATETIME2(0) NULL,
    attempt_count INT NOT NULL CONSTRAINT DF_password_reset_attempt_count DEFAULT 0,
    max_attempts TINYINT NOT NULL CONSTRAINT DF_password_reset_max_attempts DEFAULT 5,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_password_reset_status DEFAULT 'PENDING',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_password_reset_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_password_reset_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_password_reset_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT CK_password_reset_attempts CHECK (attempt_count >= 0 AND max_attempts > 0 AND attempt_count <= max_attempts),
    CONSTRAINT CK_password_reset_status CHECK (status IN ('PENDING','VERIFIED','USED','EXPIRED','LOCKED','CANCELLED'))
);
GO
CREATE INDEX IX_password_reset_user_status_expires ON password_reset_requests(user_id, status, expires_at);
GO

CREATE TABLE refresh_tokens (
    refresh_token_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_refresh_tokens PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash NVARCHAR(255) NOT NULL,
    device_info NVARCHAR(500) NULL,
    ip_address VARCHAR(45) NULL,
    last_used_at DATETIME2(0) NULL,
    expires_at DATETIME2(0) NOT NULL,
    revoked_at DATETIME2(0) NULL,
    revocation_reason NVARCHAR(255) NULL,
    replaced_by_token_id BIGINT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_refresh_tokens_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_refresh_tokens_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_refresh_tokens_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_refresh_tokens_replaced_by FOREIGN KEY (replaced_by_token_id) REFERENCES refresh_tokens(refresh_token_id),
    CONSTRAINT UX_refresh_tokens_token_hash UNIQUE (token_hash)
);
GO
CREATE INDEX IX_refresh_tokens_user_active ON refresh_tokens(user_id, revoked_at, expires_at);
GO

CREATE TABLE user_addresses (
    address_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_user_addresses PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipient_name NVARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    address_line NVARCHAR(255) NOT NULL,
    ward NVARCHAR(100) NULL,
    district NVARCHAR(100) NULL,
    province NVARCHAR(100) NOT NULL,
    country NVARCHAR(100) NOT NULL CONSTRAINT DF_user_addresses_country DEFAULT N'Việt Nam',
    is_default BIT NOT NULL CONSTRAINT DF_user_addresses_is_default DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_user_addresses_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_addresses_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_addresses_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT FK_user_addresses_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT CK_user_addresses_status CHECK (status IN ('ACTIVE','INACTIVE'))
);
GO
CREATE UNIQUE INDEX UX_user_default_address ON user_addresses(user_id) WHERE is_default = 1 AND status = 'ACTIVE';
GO

CREATE TABLE stores (
    store_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_stores PRIMARY KEY,
    store_code VARCHAR(30) NOT NULL,
    store_name NVARCHAR(150) NOT NULL,
    slug NVARCHAR(191) NOT NULL,
    description NVARCHAR(MAX) NULL,
    logo_url NVARCHAR(500) NULL,
    contact_email NVARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    address_line NVARCHAR(255) NULL,
    ward NVARCHAR(100) NULL,
    district NVARCHAR(100) NULL,
    province NVARCHAR(100) NULL,
    total_products INT NOT NULL CONSTRAINT DF_stores_total_products DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_stores_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_stores_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_stores_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT UX_stores_store_code UNIQUE (store_code),
    CONSTRAINT UX_stores_slug UNIQUE (slug),
    CONSTRAINT CK_stores_total_products CHECK (total_products >= 0),
    CONSTRAINT CK_stores_status CHECK (status IN ('ACTIVE','INACTIVE','SUSPENDED'))
);
GO

CREATE TABLE user_stores (
    user_store_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_user_stores PRIMARY KEY,
    user_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    store_member_role VARCHAR(20) NOT NULL CONSTRAINT DF_user_stores_member_role DEFAULT 'OWNER',
    is_active BIT NOT NULL CONSTRAINT DF_user_stores_is_active DEFAULT 1,
    assigned_by_user_id BIGINT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_stores_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_stores_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_user_stores_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_user_stores_stores FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT FK_user_stores_assigned_by FOREIGN KEY (assigned_by_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_user_stores_member_role CHECK (store_member_role IN ('OWNER','STAFF'))
);
GO
CREATE UNIQUE INDEX UX_one_active_owner_per_user ON user_stores(user_id) WHERE store_member_role = 'OWNER' AND is_active = 1;
CREATE UNIQUE INDEX UX_one_active_owner_per_store ON user_stores(store_id) WHERE store_member_role = 'OWNER' AND is_active = 1;
GO

CREATE TABLE categories (
    category_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_categories PRIMARY KEY,
    parent_category_id BIGINT NULL,
    category_name NVARCHAR(150) NOT NULL,
    slug NVARCHAR(191) NOT NULL,
    description NVARCHAR(500) NULL,
    icon_url NVARCHAR(500) NULL,
    display_order INT NOT NULL CONSTRAINT DF_categories_display_order DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_categories_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_categories_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_categories_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT FK_categories_parent FOREIGN KEY (parent_category_id) REFERENCES categories(category_id),
    CONSTRAINT UX_categories_slug UNIQUE (slug),
    CONSTRAINT CK_categories_display_order CHECK (display_order >= 0),
    CONSTRAINT CK_categories_status CHECK (status IN ('ACTIVE','INACTIVE'))
);
GO

CREATE TABLE products (
    product_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_products PRIMARY KEY,
    store_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    sku NVARCHAR(50) NOT NULL,
    product_name NVARCHAR(200) NOT NULL,
    slug NVARCHAR(191) NOT NULL,
    description NVARCHAR(MAX) NULL,
    price DECIMAL(18,2) NOT NULL,
    stock_quantity INT NOT NULL CONSTRAINT DF_products_stock_quantity DEFAULT 0,
    sold_quantity INT NOT NULL CONSTRAINT DF_products_sold_quantity DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_products_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_products_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_products_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT FK_products_stores FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT UX_products_store_sku UNIQUE (store_id, sku),
    CONSTRAINT UX_products_slug UNIQUE (slug),
    CONSTRAINT CK_products_price CHECK (price > 0),
    CONSTRAINT CK_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT CK_products_sold_quantity CHECK (sold_quantity >= 0),
    CONSTRAINT CK_products_status CHECK (status IN ('ACTIVE','INACTIVE','SUSPENDED'))
);
GO
CREATE INDEX IX_products_store ON products(store_id);
CREATE INDEX IX_products_category ON products(category_id);
CREATE INDEX IX_products_status ON products(status);
GO

CREATE TABLE product_images (
    product_image_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_product_images PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url NVARCHAR(500) NOT NULL,
    alt_text NVARCHAR(255) NULL,
    display_order INT NOT NULL CONSTRAINT DF_product_images_display_order DEFAULT 0,
    is_primary BIT NOT NULL CONSTRAINT DF_product_images_is_primary DEFAULT 0,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_product_images_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_product_images_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_product_images_products FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT CK_product_images_display_order CHECK (display_order >= 0)
);
GO
CREATE UNIQUE INDEX UX_product_primary_image ON product_images(product_id) WHERE is_primary = 1;
GO

CREATE TABLE carts (
    cart_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_carts PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_carts_status DEFAULT 'ACTIVE',
    checked_out_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_carts_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_carts_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_carts_users FOREIGN KEY (customer_id) REFERENCES users(user_id),
    CONSTRAINT CK_carts_status CHECK (status IN ('ACTIVE','CHECKED_OUT','ABANDONED'))
);
GO
CREATE UNIQUE INDEX UX_customer_active_cart ON carts(customer_id) WHERE status = 'ACTIVE';
GO

CREATE TABLE cart_items (
    cart_item_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_cart_items PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_added DECIMAL(18,2) NOT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_cart_items_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_cart_items_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_cart_items_carts FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    CONSTRAINT FK_cart_items_products FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT UX_cart_items_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT CK_cart_items_quantity CHECK (quantity > 0),
    CONSTRAINT CK_cart_items_price_at_added CHECK (price_at_added > 0)
);
GO

CREATE TABLE orders (
    order_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_orders PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL,
    customer_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    source_address_id BIGINT NULL,
    recipient_name NVARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address_line NVARCHAR(255) NOT NULL,
    shipping_ward NVARCHAR(100) NULL,
    shipping_district NVARCHAR(100) NULL,
    shipping_province NVARCHAR(100) NOT NULL,
    order_status VARCHAR(30) NOT NULL CONSTRAINT DF_orders_status DEFAULT 'PENDING',
    payment_method VARCHAR(30) NOT NULL CONSTRAINT DF_orders_payment_method DEFAULT 'COD',
    payment_status VARCHAR(20) NOT NULL CONSTRAINT DF_orders_payment_status DEFAULT 'UNPAID',
    subtotal_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_orders_subtotal DEFAULT 0,
    discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_orders_discount DEFAULT 0,
    shipping_fee DECIMAL(18,2) NOT NULL CONSTRAINT DF_orders_shipping_fee DEFAULT 0,
    total_amount DECIMAL(18,2) NOT NULL,
    customer_note NVARCHAR(500) NULL,
    cancelled_by_user_id BIGINT NULL,
    cancel_reason NVARCHAR(500) NULL,
    cancelled_at DATETIME2(0) NULL,
    completed_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_orders_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_orders_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UX_orders_order_code UNIQUE (order_code),
    CONSTRAINT FK_orders_users FOREIGN KEY (customer_id) REFERENCES users(user_id),
    CONSTRAINT FK_orders_stores FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT FK_orders_user_addresses FOREIGN KEY (source_address_id) REFERENCES user_addresses(address_id),
    CONSTRAINT FK_orders_cancelled_by FOREIGN KEY (cancelled_by_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_orders_status CHECK (order_status IN ('PENDING','CONFIRMED','PROCESSING','READY_TO_SHIP','SHIPPING','COMPLETED','CANCELLED','DELIVERY_FAILED')),
    CONSTRAINT CK_orders_payment_method CHECK (payment_method IN ('COD','BANK_TRANSFER')),
    CONSTRAINT CK_orders_payment_status CHECK (payment_status IN ('UNPAID','PAID','FAILED','REFUNDED')),
    CONSTRAINT CK_orders_amounts_non_negative CHECK (subtotal_amount >= 0 AND discount_amount >= 0 AND shipping_fee >= 0 AND total_amount >= 0),
    CONSTRAINT CK_orders_total_amount CHECK (total_amount = subtotal_amount - discount_amount + shipping_fee)
);
GO
CREATE INDEX IX_orders_customer ON orders(customer_id);
CREATE INDEX IX_orders_store ON orders(store_id);
CREATE INDEX IX_orders_status ON orders(order_status);
CREATE INDEX IX_orders_created_at ON orders(created_at);
GO

CREATE TABLE order_items (
    order_item_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_order_items PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name_snapshot NVARCHAR(200) NOT NULL,
    product_image_url_snapshot NVARCHAR(500) NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    quantity INT NOT NULL,
    line_total AS (CONVERT(DECIMAL(18,2), unit_price * quantity)) PERSISTED,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_items_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_items_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_items_products FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT UX_order_items_order_product UNIQUE (order_id, product_id),
    CONSTRAINT CK_order_items_unit_price CHECK (unit_price > 0),
    CONSTRAINT CK_order_items_quantity CHECK (quantity > 0)
);
GO
CREATE INDEX IX_order_items_order ON order_items(order_id);
CREATE INDEX IX_order_items_product ON order_items(product_id);
GO

CREATE TABLE order_status_histories (
    order_status_history_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_order_status_histories PRIMARY KEY,
    order_id BIGINT NOT NULL,
    previous_status VARCHAR(30) NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_by_user_id BIGINT NULL,
    change_note NVARCHAR(500) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_status_histories_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_order_status_histories_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_status_histories_users FOREIGN KEY (changed_by_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_order_status_history_previous CHECK (previous_status IS NULL OR previous_status IN ('PENDING','CONFIRMED','PROCESSING','READY_TO_SHIP','SHIPPING','COMPLETED','CANCELLED','DELIVERY_FAILED')),
    CONSTRAINT CK_order_status_history_new CHECK (new_status IN ('PENDING','CONFIRMED','PROCESSING','READY_TO_SHIP','SHIPPING','COMPLETED','CANCELLED','DELIVERY_FAILED'))
);
GO
CREATE INDEX IX_order_status_histories_order ON order_status_histories(order_id);
CREATE INDEX IX_order_status_histories_new_status ON order_status_histories(new_status);
GO

CREATE TABLE reviews (
    review_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_reviews PRIMARY KEY,
    order_item_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating TINYINT NOT NULL,
    comment NVARCHAR(1000) NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_reviews_status DEFAULT 'VISIBLE',
    hidden_by_user_id BIGINT NULL,
    hidden_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_reviews_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_reviews_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_reviews_order_items FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT FK_reviews_products FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT FK_reviews_users FOREIGN KEY (customer_id) REFERENCES users(user_id),
    CONSTRAINT FK_reviews_hidden_by FOREIGN KEY (hidden_by_user_id) REFERENCES users(user_id),
    CONSTRAINT UX_reviews_order_item UNIQUE (order_item_id),
    CONSTRAINT CK_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT CK_reviews_status CHECK (status IN ('VISIBLE','HIDDEN'))
);
GO
CREATE INDEX IX_reviews_product ON reviews(product_id);
CREATE INDEX IX_reviews_customer ON reviews(customer_id);
GO

CREATE TABLE conversations (
    conversation_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_conversations PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_conversations_status DEFAULT 'OPEN',
    last_message_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_conversations_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_conversations_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_conversations_users FOREIGN KEY (customer_id) REFERENCES users(user_id),
    CONSTRAINT FK_conversations_stores FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT FK_conversations_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT CK_conversations_status CHECK (status IN ('OPEN','CLOSED'))
);
GO
CREATE UNIQUE INDEX UX_conversation_pre_order ON conversations(customer_id, store_id) WHERE order_id IS NULL;
CREATE UNIQUE INDEX UX_conversation_order ON conversations(customer_id, store_id, order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IX_conversations_last_message ON conversations(last_message_at);
GO

CREATE TABLE messages (
    message_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_messages PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    message_content NVARCHAR(MAX) NOT NULL,
    is_read BIT NOT NULL CONSTRAINT DF_messages_is_read DEFAULT 0,
    read_at DATETIME2(0) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_messages_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_messages_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_messages_conversations FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    CONSTRAINT FK_messages_users FOREIGN KEY (sender_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_messages_content_not_empty CHECK (LEN(LTRIM(RTRIM(message_content))) > 0),
    CONSTRAINT CK_messages_read_at CHECK ((is_read = 0 AND read_at IS NULL) OR (is_read = 1 AND read_at IS NOT NULL))
);
GO
CREATE INDEX IX_messages_conversation ON messages(conversation_id);
CREATE INDEX IX_messages_sender ON messages(sender_user_id);
CREATE INDEX IX_messages_created_at ON messages(created_at);
GO

CREATE TABLE shipments (
    shipment_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_shipments PRIMARY KEY,
    order_id BIGINT NOT NULL,
    shipper_user_id BIGINT NULL,
    tracking_code VARCHAR(50) NULL,
    shipment_status VARCHAR(30) NOT NULL CONSTRAINT DF_shipments_status DEFAULT 'PENDING_ASSIGNMENT',
    assigned_at DATETIME2(0) NULL,
    picked_up_at DATETIME2(0) NULL,
    delivered_at DATETIME2(0) NULL,
    failed_reason NVARCHAR(500) NULL,
    shipping_note NVARCHAR(500) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_shipments_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_shipments_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_shipments_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_shipments_users FOREIGN KEY (shipper_user_id) REFERENCES users(user_id),
    CONSTRAINT UX_shipments_order UNIQUE (order_id),
    CONSTRAINT CK_shipments_status CHECK (shipment_status IN ('PENDING_ASSIGNMENT','ASSIGNED','PICKED_UP','SHIPPING','DELIVERED','DELIVERY_FAILED'))
);
GO
CREATE UNIQUE INDEX UX_shipments_tracking_code ON shipments(tracking_code) WHERE tracking_code IS NOT NULL;
CREATE INDEX IX_shipments_shipper ON shipments(shipper_user_id);
CREATE INDEX IX_shipments_status ON shipments(shipment_status);
GO

CREATE TABLE user_permissions (
    user_permission_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_user_permissions PRIMARY KEY,
    user_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    permission_effect VARCHAR(10) NOT NULL,
    access_scope VARCHAR(30) NOT NULL,
    reason NVARCHAR(500) NULL,
    granted_by_user_id BIGINT NOT NULL,
    starts_at DATETIME2(0) NULL,
    expires_at DATETIME2(0) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_user_permissions_is_active DEFAULT 1,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_permissions_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_user_permissions_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_user_permissions_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_user_permissions_permissions FOREIGN KEY (permission_id) REFERENCES permissions(permission_id),
    CONSTRAINT FK_user_permissions_granted_by FOREIGN KEY (granted_by_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_user_permissions_effect CHECK (permission_effect IN ('ALLOW','DENY')),
    CONSTRAINT CK_user_permissions_scope CHECK (access_scope IN ('ALL','SELF','OWN_STORE','PUBLIC','ASSIGNED_ORDER','CONDITION'))
);
GO
CREATE INDEX IX_user_permissions_user ON user_permissions(user_id);
CREATE INDEX IX_user_permissions_permission ON user_permissions(permission_id);
GO

CREATE TABLE vouchers (
    voucher_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_vouchers PRIMARY KEY,
    voucher_code VARCHAR(30) NOT NULL,
    store_id BIGINT NULL,
    created_by_user_id BIGINT NOT NULL,
    voucher_name NVARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(18,2) NOT NULL,
    max_discount_amount DECIMAL(18,2) NULL,
    min_order_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_vouchers_min_order_amount DEFAULT 0,
    usage_limit INT NULL,
    used_count INT NOT NULL CONSTRAINT DF_vouchers_used_count DEFAULT 0,
    usage_limit_per_customer INT NOT NULL CONSTRAINT DF_vouchers_usage_per_customer DEFAULT 1,
    starts_at DATETIME2(0) NOT NULL,
    ends_at DATETIME2(0) NOT NULL,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_vouchers_status DEFAULT 'ACTIVE',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_vouchers_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_vouchers_updated_at DEFAULT SYSUTCDATETIME(),
    deleted_at DATETIME2(0) NULL,
    CONSTRAINT UX_vouchers_code UNIQUE (voucher_code),
    CONSTRAINT FK_vouchers_stores FOREIGN KEY (store_id) REFERENCES stores(store_id),
    CONSTRAINT FK_vouchers_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(user_id),
    CONSTRAINT CK_vouchers_discount_type CHECK (discount_type IN ('PERCENT','FIXED')),
    CONSTRAINT CK_vouchers_discount_value CHECK (discount_value > 0 AND (discount_type <> 'PERCENT' OR discount_value <= 100)),
    CONSTRAINT CK_vouchers_amounts CHECK ((max_discount_amount IS NULL OR max_discount_amount >= 0) AND min_order_amount >= 0 AND used_count >= 0),
    CONSTRAINT CK_vouchers_usage_limit CHECK ((usage_limit IS NULL OR usage_limit > 0) AND usage_limit_per_customer > 0),
    CONSTRAINT CK_vouchers_date_range CHECK (ends_at > starts_at),
    CONSTRAINT CK_vouchers_status CHECK (status IN ('ACTIVE','INACTIVE','EXPIRED','SUSPENDED'))
);
GO
CREATE INDEX IX_vouchers_store ON vouchers(store_id);
CREATE INDEX IX_vouchers_status ON vouchers(status);
GO

CREATE TABLE order_vouchers (
    order_voucher_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_order_vouchers PRIMARY KEY,
    order_id BIGINT NOT NULL,
    voucher_id BIGINT NOT NULL,
    voucher_code_snapshot VARCHAR(30) NOT NULL,
    discount_type_snapshot VARCHAR(20) NOT NULL,
    discount_value_snapshot DECIMAL(18,2) NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL,
    application_status VARCHAR(20) NOT NULL CONSTRAINT DF_order_vouchers_application_status DEFAULT 'APPLIED',
    applied_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_vouchers_applied_at DEFAULT SYSUTCDATETIME(),
    reversed_at DATETIME2(0) NULL,
    reversed_reason NVARCHAR(500) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_vouchers_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_order_vouchers_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_order_vouchers_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_vouchers_vouchers FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id),
    CONSTRAINT UX_order_vouchers_order_voucher UNIQUE (order_id, voucher_id),
    CONSTRAINT CK_order_vouchers_discount_type CHECK (discount_type_snapshot IN ('PERCENT','FIXED')),
    CONSTRAINT CK_order_vouchers_discount_value CHECK (discount_value_snapshot > 0),
    CONSTRAINT CK_order_vouchers_discount_amount CHECK (discount_amount >= 0),
    CONSTRAINT CK_order_vouchers_application_status CHECK (application_status IN ('APPLIED','REVERSED')),
    CONSTRAINT CK_order_vouchers_reversed_at CHECK ((application_status = 'APPLIED' AND reversed_at IS NULL) OR (application_status = 'REVERSED' AND reversed_at IS NOT NULL))
);
GO

/* Seed 4 system roles only. Do not create 1,000 fake roles. */
INSERT INTO roles (role_code, role_name, description, is_system_role, status)
VALUES
('CUSTOMER', N'Người mua', N'Người dùng mua hàng, quản lý tài khoản cá nhân, đơn hàng, đánh giá và nhắn tin cửa hàng.', 1, 'ACTIVE'),
('SELLER', N'Người bán', N'Người dùng quản lý cửa hàng, sản phẩm, đơn hàng và doanh thu cửa hàng mình.', 1, 'ACTIVE'),
('ADMIN', N'Admin', N'Quản trị nghiệp vụ toàn hệ thống.', 1, 'ACTIVE'),
('SHIPPER', N'Vận chuyển', N'Role phụ xử lý giao nhận đơn được phân công.', 1, 'ACTIVE');
GO

/*
  Backend rules not enforceable by simple SQL constraints:
  1. Seller only manages own store/products/orders.
  2. Customer only views/cancels own orders.
  3. Customer cancels order only when PENDING.
  4. Review product_id/customer_id must match order_item/order.
  5. conversations.order_id, if not NULL, must match conversation customer_id and store_id.
  6. sold_quantity and total_products must be updated through transactions.
  7. Shipper must have SHIPPER role and only update assigned shipments.
  8. Refresh token is valid only when not expired and not revoked.
*/
