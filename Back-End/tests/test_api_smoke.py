"""Core API smoke tests.

The suite runs against the configured SQL Server through Flask's test client.
Writes use a globally unique prefix and targeted cleanup runs before and after
the suite, including when class setup fails. Secrets and tokens are never
printed.
"""

import unittest
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import uuid4

import jwt
from sqlalchemy import text
from werkzeug.security import generate_password_hash

from app import create_app
from extensions import db
from models.order import Order
from models.order_item import OrderItem
from models.product import Product
from models.product_variant import ProductVariant
from models.review import Review
from models.role import Role
from models.shipment import Shipment
from models.store import Store
from models.user import User
from models.user_store import UserStore
from models.voucher import Voucher


PREFIX = "CORE-FREEZE-"
ROLES = ("CUSTOMER", "SELLER", "ADMIN", "SHIPPER")


class CoreApiSmokeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config.update(TESTING=True, PROPAGATE_EXCEPTIONS=True)
        cls.context = cls.app.app_context()
        cls.context.push()
        cls.teardown_complete = False
        cls.addClassCleanup(cls._cleanup_after_setup_failure)
        cls._cleanup_committed_fixtures()
        cls.client = cls.app.test_client()

        role_models = {role.role_code: role for role in Role.query.filter(Role.role_code.in_(ROLES)).all()}
        if set(role_models) != set(ROLES):
            raise AssertionError("Database must contain CUSTOMER, SELLER, ADMIN and SHIPPER roles")

        seller_link = (
            UserStore.query
            .filter_by(store_member_role="OWNER", is_active=1)
            .order_by(UserStore.user_store_id)
            .first()
        )
        shipper = (
            User.query.join(Shipment, Shipment.shipper_user_id == User.user_id)
            .filter(User.roles.any(Role.role_code == "SHIPPER"))
            .first()
            or User.query.filter(User.roles.any(Role.role_code == "SHIPPER")).first()
        )
        fixtures = {
            "CUSTOMER": User.query.filter(User.roles.any(Role.role_code == "CUSTOMER")).first(),
            "SELLER": User.query.filter_by(user_id=seller_link.user_id).first() if seller_link else None,
            "ADMIN": User.query.filter(User.roles.any(Role.role_code == "ADMIN")).first(),
            "SHIPPER": shipper,
        }
        if any(user is None for user in fixtures.values()):
            raise AssertionError("Missing an active data fixture for one or more core roles")

        cls.tokens = {}
        cls.users = {}
        for role, user in fixtures.items():
            cls.tokens[role] = jwt.encode(
                {
                    "user_id": user.user_id,
                    "email": user.email,
                    "roles": [role],
                    "exp": datetime.utcnow() + timedelta(minutes=30),
                },
                cls.app.config["JWT_SECRET_KEY"],
                algorithm="HS256",
            )
            cls.users[role] = {"user_id": user.user_id, "email": user.email}

        cls.login_tokens = {}
        smoke_password = uuid4().hex + "Aa1!"
        for role in ROLES:
            suffix = uuid4().hex[:10]
            login_user = User(
                email=f"core-freeze-{role.lower()}-{suffix}@example.invalid",
                phone="08" + str(int(uuid4().hex[:8], 16)).zfill(10)[-8:],
                password_hash=generate_password_hash(smoke_password),
                full_name=f"{PREFIX}{role} Login",
                status="ACTIVE",
            )
            login_user.roles.append(role_models[role])
            db.session.add(login_user)
            db.session.flush()
            response = cls.client.post(
                "/api/v1/auth/login",
                json={"email": login_user.email, "password": smoke_password},
            )
            if response.status_code != 200:
                raise AssertionError(f"Demo login failed for role {role}: HTTP {response.status_code}")
            cls.login_tokens[role] = response.get_json()["data"]["access_token"]
            me = cls.client.get(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {cls.login_tokens[role]}"},
            )
            if me.status_code != 200:
                raise AssertionError(f"Current-user fixture failed for role {role}")
            if role == "CUSTOMER":
                cls.temp_customer = login_user
                cls.temp_token = cls.login_tokens[role]

        variants = (
            db.session.query(ProductVariant)
            .join(Product, Product.product_id == ProductVariant.product_id)
            .filter(
                Product.status == "ACTIVE",
                Product.deleted_at.is_(None),
                ProductVariant.status == "ACTIVE",
                ProductVariant.stock_quantity >= 2,
            )
            .order_by(ProductVariant.product_id, ProductVariant.variant_id)
            .all()
        )
        by_product = {}
        for variant in variants:
            by_product.setdefault(variant.product_id, []).append(variant)
        pair = next((items[:2] for items in by_product.values() if len(items) >= 2), None)
        if not pair:
            raise AssertionError("No active product fixture with two in-stock variants was found")
        cls.variants = pair
        cls.product = Product.query.filter_by(product_id=pair[0].product_id).one()

    @classmethod
    def tearDownClass(cls):
        try:
            db.session.remove()
            cls._cleanup_committed_fixtures()
        finally:
            cls.teardown_complete = True
            cls.context.pop()

    @classmethod
    def _cleanup_after_setup_failure(cls):
        if cls.teardown_complete:
            return
        try:
            db.session.remove()
            cls._cleanup_committed_fixtures()
        finally:
            cls.context.pop()

    @classmethod
    def _cleanup_committed_fixtures(cls):
        """Remove only rows owned by this suite's globally unique prefix."""
        statements = (
            """UPDATE v SET v.used_count =
                   CASE WHEN v.used_count >= x.applied_count
                        THEN v.used_count - x.applied_count ELSE 0 END
                 FROM vouchers v
                 JOIN (SELECT ov.voucher_id, COUNT(*) AS applied_count
                       FROM order_vouchers ov JOIN orders o ON o.order_id = ov.order_id
                       WHERE o.customer_note = 'CORE-FREEZE-order smoke'
                         AND ov.application_status = 'APPLIED'
                       GROUP BY ov.voucher_id) x ON x.voucher_id = v.voucher_id""",
            """UPDATE pv SET pv.stock_quantity = pv.stock_quantity + x.quantity
                 FROM product_variants pv
                 JOIN (SELECT oi.variant_id, SUM(oi.quantity) AS quantity
                       FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
                       WHERE o.customer_note = 'CORE-FREEZE-order smoke'
                         AND o.order_status <> 'CANCELLED'
                       GROUP BY oi.variant_id) x ON x.variant_id = pv.variant_id""",
            """UPDATE p SET p.sold_quantity =
                   CASE WHEN p.sold_quantity >= x.quantity
                        THEN p.sold_quantity - x.quantity ELSE 0 END
                 FROM products p
                 JOIN (SELECT oi.product_id, SUM(oi.quantity) AS quantity
                       FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
                       WHERE o.customer_note = 'CORE-FREEZE-order smoke'
                         AND o.order_status <> 'CANCELLED'
                       GROUP BY oi.product_id) x ON x.product_id = p.product_id""",
            """UPDATE p SET p.stock_quantity = x.variant_stock
                 FROM products p
                 JOIN (SELECT product_id,
                              SUM(CASE WHEN status = 'ACTIVE' THEN stock_quantity ELSE 0 END) AS variant_stock
                       FROM product_variants GROUP BY product_id) x ON x.product_id = p.product_id
                 WHERE EXISTS (SELECT 1 FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
                               WHERE oi.product_id = p.product_id
                                 AND o.customer_note = 'CORE-FREEZE-order smoke')""",
            """DELETE m FROM messages m
                 JOIN conversations c ON c.conversation_id = m.conversation_id
                 JOIN users u ON u.user_id = c.customer_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'
                    OR m.message_content LIKE 'CORE-FREEZE-%'""",
            """DELETE c FROM conversations c JOIN users u ON u.user_id = c.customer_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE r FROM reviews r JOIN users u ON u.user_id = r.customer_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%' OR r.comment LIKE 'CORE-FREEZE-%'""",
            """DELETE ov FROM order_vouchers ov JOIN orders o ON o.order_id = ov.order_id
                 WHERE o.order_code LIKE 'CORE-FREEZE-%'
                    OR o.customer_note LIKE 'CORE-FREEZE-%'""",
            """DELETE h FROM order_status_histories h JOIN orders o ON o.order_id = h.order_id
                 WHERE o.order_code LIKE 'CORE-FREEZE-%'
                    OR o.customer_note LIKE 'CORE-FREEZE-%'""",
            """DELETE s FROM shipments s JOIN orders o ON o.order_id = s.order_id
                 WHERE o.order_code LIKE 'CORE-FREEZE-%'
                    OR o.customer_note LIKE 'CORE-FREEZE-%'""",
            """DELETE oi FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
                 WHERE o.order_code LIKE 'CORE-FREEZE-%'
                    OR o.customer_note LIKE 'CORE-FREEZE-%'""",
            """DELETE FROM orders WHERE order_code LIKE 'CORE-FREEZE-%'
                 OR customer_note LIKE 'CORE-FREEZE-%'""",
            """DELETE ci FROM cart_items ci JOIN carts c ON c.cart_id = ci.cart_id
                 JOIN users u ON u.user_id = c.customer_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE c FROM carts c JOIN users u ON u.user_id = c.customer_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE pr FROM password_reset_requests pr JOIN users u ON u.user_id = pr.user_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE rt FROM refresh_tokens rt JOIN users u ON u.user_id = rt.user_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE ur FROM user_roles ur JOIN users u ON u.user_id = ur.user_id
                 WHERE u.full_name LIKE 'CORE-FREEZE-%'""",
            """DELETE FROM users WHERE full_name LIKE 'CORE-FREEZE-%'
                 AND email LIKE 'core-freeze-%@example.invalid'""",
            """DELETE FROM vouchers WHERE voucher_code LIKE 'CORE-FREEZE-%'
                 AND voucher_name LIKE 'CORE-FREEZE-%'""",
        )
        with db.engine.begin() as connection:
            for statement in statements:
                connection.execute(text(statement))

    @classmethod
    def auth(cls, role=None, token=None):
        value = token or cls.tokens[role]
        return {"Authorization": f"Bearer {value}"}

    def assert_status(self, response, expected):
        self.assertEqual(response.status_code, expected, response.get_data(as_text=True)[:500])
        self.assertNotEqual(response.status_code, 500)

    def test_01_public_roles_categories_and_products(self):
        self.assert_status(self.client.get("/api/v1/roles"), 200)
        self.assert_status(self.client.get("/api/v1/categories"), 200)
        listing = self.client.get("/api/v1/products?limit=5")
        self.assert_status(listing, 200)
        self.assert_status(self.client.get(f"/api/v1/products/{self.product.product_id}"), 200)

    def test_02_auth_four_roles_current_user_and_bad_tokens(self):
        for role in ROLES:
            response = self.client.get(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {self.login_tokens[role]}"},
            )
            self.assert_status(response, 200)
        self.assert_status(self.client.get("/api/v1/users/me"), 401)
        self.assert_status(
            self.client.get("/api/v1/users/me", headers=self.auth(token="invalid-token")),
            401,
        )

    def test_03_customer_address_cart_order_voucher_review_and_message(self):
        headers = self.auth(token=self.temp_token)
        self.assert_status(self.client.get("/api/v1/me/addresses", headers=headers), 200)

        for variant in self.variants:
            response = self.client.post(
                "/api/v1/cart/items",
                headers=headers,
                json={
                    "product_id": self.product.product_id,
                    "variant_id": variant.variant_id,
                    "quantity": 1,
                },
            )
            self.assertIn(response.status_code, (200, 201))
        cart = self.client.get("/api/v1/cart", headers=headers)
        self.assert_status(cart, 200)
        cart_variants = {item["variant_id"] for item in cart.get_json()["data"]["items"]}
        self.assertTrue({item.variant_id for item in self.variants}.issubset(cart_variants))

        admin_id = self.users["ADMIN"]["user_id"]
        now = datetime.utcnow()
        voucher = Voucher(
            voucher_code=f"CORE-FREEZE-{uuid4().hex[:8]}".upper(),
            voucher_name=f"{PREFIX}Smoke Voucher",
            store_id=self.product.store_id,
            created_by_user_id=admin_id,
            discount_type="FIXED",
            discount_value=Decimal("1.00"),
            min_order_amount=Decimal("0.00"),
            usage_limit=10,
            used_count=0,
            usage_limit_per_customer=1,
            starts_at=now - timedelta(days=1),
            ends_at=now + timedelta(days=1),
            status="ACTIVE",
        )
        db.session.add(voucher)
        db.session.flush()
        amount = sum(Decimal(item.price) for item in self.variants)
        check = self.client.get(
            "/api/v1/vouchers/check",
            headers=headers,
            query_string={
                "code": voucher.voucher_code,
                "order_amount": str(amount),
                "store_id": self.product.store_id,
            },
        )
        self.assert_status(check, 200)

        order_response = self.client.post(
            "/api/v1/orders",
            headers=headers,
            json={
                "store_id": self.product.store_id,
                "items": [
                    {
                        "product_id": self.product.product_id,
                        "variant_id": variant.variant_id,
                        "quantity": 1,
                    }
                    for variant in self.variants
                ],
                "recipient_name": f"{PREFIX}Recipient",
                "recipient_phone": "0900000000",
                "shipping_address_line": f"{PREFIX}Address",
                "shipping_province": "Ho Chi Minh",
                "payment_method": "COD",
                "customer_note": f"{PREFIX}order smoke",
                "voucher_code": voucher.voucher_code,
            },
        )
        self.assert_status(order_response, 201)
        order_id = order_response.get_json()["data"]["order_id"]
        order = Order.query.filter_by(order_id=order_id).one()
        order.order_code = f"CORE-FREEZE-{uuid4().hex[:10]}".upper()
        db.session.flush()
        self.assert_status(self.client.get(f"/api/v1/orders/{order_id}", headers=headers), 200)
        self.assert_status(
            self.client.post(
                f"/api/v1/orders/{order_id}/cancel",
                headers=headers,
                json={"cancel_reason": f"{PREFIX}smoke rollback"},
            ),
            200,
        )

        review_order = Order(
            customer_id=self.temp_customer.user_id,
            store_id=self.product.store_id,
            order_code=f"CORE-FREEZE-{uuid4().hex[:10]}".upper(),
            order_status="COMPLETED",
            recipient_name=f"{PREFIX}Reviewer",
            recipient_phone="0900000000",
            shipping_address_line=f"{PREFIX}Address",
            shipping_province="Ho Chi Minh",
            payment_method="COD",
            payment_status="PAID",
            subtotal=Decimal(self.variants[0].price),
            discount_amount=Decimal("0"),
            shipping_fee=Decimal("0"),
            total_amount=Decimal(self.variants[0].price),
            customer_note=f"{PREFIX}review fixture",
            completed_at=now,
        )
        db.session.add(review_order)
        db.session.flush()
        review_item = OrderItem(
            order_id=review_order.order_id,
            product_id=self.product.product_id,
            variant_id=self.variants[0].variant_id,
            quantity=1,
            unit_price=self.variants[0].price,
            product_name_snapshot=self.product.product_name,
            sku_code_snapshot=self.variants[0].sku_code,
            variant_name_snapshot=self.variants[0].variant_name,
        )
        db.session.add(review_item)
        db.session.flush()
        review_response = self.client.post(
            "/api/v1/reviews",
            headers=headers,
            json={
                "order_item_id": review_item.order_item_id,
                "rating": 5,
                "comment": f"{PREFIX}review smoke",
            },
        )
        self.assert_status(review_response, 201)
        self.assertTrue(
            Review.query.filter(Review.comment.like(f"{PREFIX}%")).count() >= 1
        )

        store = Store.query.filter_by(store_id=self.product.store_id).one()
        conversation = self.client.post(
            "/api/v1/conversations",
            headers=headers,
            json={"store_id": store.store_id},
        )
        self.assert_status(conversation, 201)
        conversation_id = conversation.get_json()["data"]["conversation_id"]
        self.assert_status(
            self.client.post(
                f"/api/v1/conversations/{conversation_id}/messages",
                headers=headers,
                json={"message_content": f"{PREFIX}message smoke"},
            ),
            201,
        )
        self.assert_status(
            self.client.get(
                f"/api/v1/conversations/{conversation_id}/messages", headers=headers
            ),
            200,
        )

    def test_04_seller_products_order_detail_revenue_and_settings(self):
        headers = self.auth("SELLER")
        products = self.client.get("/api/v1/seller/products", headers=headers)
        self.assert_status(products, 200)
        orders = self.client.get("/api/v1/seller/orders?limit=5", headers=headers)
        self.assert_status(orders, 200)
        order_rows = orders.get_json()["data"]["orders"]
        self.assertTrue(order_rows, "Seller fixture has no order for detail smoke")
        self.assert_status(
            self.client.get(f"/api/v1/seller/orders/{order_rows[0]['order_id']}", headers=headers),
            200,
        )
        self.assert_status(
            self.client.get(
                "/api/v1/seller/revenue?from_date=2020-01-01&to_date=2030-12-31",
                headers=headers,
            ),
            200,
        )
        self.assert_status(self.client.get("/api/v1/seller/store", headers=headers), 200)

    def test_05_admin_users_stores_orders_reports_and_reviews(self):
        headers = self.auth("ADMIN")
        for path in (
            "/api/v1/admin/users?limit=5",
            "/api/v1/admin/stores?limit=5",
            "/api/v1/admin/orders?limit=5",
            "/api/v1/admin/reports?from_date=2020-01-01&to_date=2030-12-31&limit=5",
            "/api/v1/admin/reviews?limit=5",
        ):
            self.assert_status(self.client.get(path, headers=headers), 200)

    def test_06_shipper_list_ownership_and_status_validation(self):
        headers = self.auth("SHIPPER")
        response = self.client.get("/api/v1/shipper/shipments?limit=5", headers=headers)
        self.assert_status(response, 200)
        shipper_id = self.users["SHIPPER"]["user_id"]
        foreign = Shipment.query.filter(Shipment.shipper_user_id != shipper_id).first()
        if foreign:
            denial = self.client.patch(
                f"/api/v1/shipper/shipments/{foreign.shipment_id}/status",
                headers=headers,
                json={"new_status": "PICKED_UP"},
            )
            self.assert_status(denial, 403)
        own = Shipment.query.filter_by(shipper_user_id=shipper_id).first()
        if own:
            invalid = self.client.patch(
                f"/api/v1/shipper/shipments/{own.shipment_id}/status",
                headers=headers,
                json={"new_status": "NOT_A_STATUS"},
            )
            self.assert_status(invalid, 400)

    def test_07_negative_authorization_matrix(self):
        self.assert_status(
            self.client.get("/api/v1/admin/users", headers=self.auth("CUSTOMER")), 403
        )
        self.assert_status(self.client.get("/api/v1/cart", headers=self.auth("SELLER")), 403)
        self.assert_status(
            self.client.post(
                "/api/v1/products",
                headers=self.auth("SHIPPER"),
                json={"product_name": f"{PREFIX}must-not-create"},
            ),
            403,
        )
        self.assert_status(self.client.get("/api/v1/cart"), 401)


if __name__ == "__main__":
    unittest.main(verbosity=2)
