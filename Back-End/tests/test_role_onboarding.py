"""Live API regression for secure role onboarding and assignment."""

import unittest
from datetime import datetime, timedelta
from uuid import uuid4

import jwt
from sqlalchemy import text

from app import create_app
from extensions import db
from models.role import Role
from models.user import User


PREFIX = "ROLE-ONBOARDING-"


class RoleOnboardingTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config.update(TESTING=True)
        cls.context = cls.app.app_context()
        cls.context.push()
        cls.cleanup_complete = False
        cls.addClassCleanup(cls._cleanup_after_failure)
        cls._cleanup()
        cls.client = cls.app.test_client()

        admin = User.query.filter(User.roles.any(Role.role_code == 'ADMIN')).first()
        if not admin:
            raise AssertionError('Cần một Admin fixture để kiểm tra onboarding')
        cls.admin_id = admin.user_id
        cls.admin_headers = cls._headers(jwt.encode({
            'user_id': admin.user_id,
            'email': admin.email,
            'roles': ['ADMIN'],
            'exp': datetime.utcnow() + timedelta(minutes=30),
        }, cls.app.config['JWT_SECRET_KEY'], algorithm='HS256'))

    @classmethod
    def tearDownClass(cls):
        try:
            db.session.remove()
            cls._cleanup()
        finally:
            cls.cleanup_complete = True
            cls.context.pop()

    @classmethod
    def _cleanup_after_failure(cls):
        if cls.cleanup_complete:
            return
        try:
            db.session.remove()
            cls._cleanup()
        finally:
            cls.context.pop()

    @classmethod
    def _cleanup(cls):
        statements = (
            """DELETE us FROM user_stores us JOIN stores s ON s.store_id = us.store_id
                 WHERE s.store_name LIKE 'ROLE-ONBOARDING-%'""",
            "DELETE FROM stores WHERE store_name LIKE 'ROLE-ONBOARDING-%'",
            """DELETE rt FROM refresh_tokens rt JOIN users u ON u.user_id = rt.user_id
                 WHERE u.full_name LIKE 'ROLE-ONBOARDING-%'""",
            """DELETE ur FROM user_roles ur JOIN users u ON u.user_id = ur.user_id
                 WHERE u.full_name LIKE 'ROLE-ONBOARDING-%'""",
            """DELETE FROM users WHERE full_name LIKE 'ROLE-ONBOARDING-%'
                 AND email LIKE 'role-onboarding-%@example.invalid'""",
        )
        with db.engine.begin() as connection:
            for statement in statements:
                connection.execute(text(statement))

    @staticmethod
    def _headers(token):
        return {'Authorization': f'Bearer {token}'}

    def assert_status(self, response, expected):
        self.assertEqual(response.status_code, expected, response.get_data(as_text=True)[:500])
        self.assertNotEqual(response.status_code, 500)

    def register(self, label, **extra):
        suffix = uuid4().hex[:10]
        payload = {
            'email': f'role-onboarding-{label}-{suffix}@example.invalid',
            'phone': '07' + str(int(uuid4().hex[:8], 16)).zfill(10)[-8:],
            'password': uuid4().hex + 'Aa1!',
            'full_name': f'{PREFIX}{label}',
            **extra,
        }
        return payload, self.client.post('/api/v1/auth/register', json=payload)

    def login(self, payload):
        response = self.client.post('/api/v1/auth/login', json={
            'email': payload['email'], 'password': payload['password']
        })
        self.assert_status(response, 200)
        return response.get_json()['data']['access_token']

    def test_role_onboarding_end_to_end(self):
        owner, registered = self.register('OWNER')
        self.assert_status(registered, 201)
        self.assertEqual(registered.get_json()['data']['roles'], ['CUSTOMER'])

        for forbidden_role in ('ADMIN', 'SHIPPER', 'SELLER'):
            payload, response = self.register(f'FORBIDDEN-{forbidden_role}', role_code=forbidden_role)
            self.assert_status(response, 400)
            self.assertIsNone(User.query.filter_by(email=payload['email']).first())

        duplicate_email = {**owner, 'phone': '06' + str(int(uuid4().hex[:8], 16)).zfill(10)[-8:]}
        self.assert_status(self.client.post('/api/v1/auth/register', json=duplicate_email), 409)
        duplicate_phone = {**owner, 'email': f'role-onboarding-duplicate-{uuid4().hex[:8]}@example.invalid'}
        self.assert_status(self.client.post('/api/v1/auth/register', json=duplicate_phone), 409)

        owner_token = self.login(owner)
        owner_headers = self._headers(owner_token)
        owner_id = User.query.filter_by(email=owner['email']).one().user_id
        application_payload = {
            'store_name': f'{PREFIX}Store-{uuid4().hex[:6]}',
            'description': 'Seller application regression fixture',
            'contact_email': owner['email'],
            'contact_phone': owner['phone'],
            'address_line': '1 Test Street',
            'ward': 'Test Ward',
            'district': 'Test District',
            'province': 'Ho Chi Minh',
        }
        application = self.client.post(
            '/api/v1/me/store-application', headers=owner_headers, json=application_payload
        )
        self.assert_status(application, 201)
        self.assertEqual(application.get_json()['data']['status'], 'PENDING')
        store_id = application.get_json()['data']['store_id']

        self.assert_status(self.client.post(
            '/api/v1/me/store-application', headers=owner_headers, json=application_payload
        ), 409)

        pending = self.client.get('/api/v1/admin/stores?status=PENDING', headers=self.admin_headers)
        self.assert_status(pending, 200)
        self.assertIn(store_id, [store['store_id'] for store in pending.get_json()['data']['stores']])

        approve = self.client.patch(
            f'/api/v1/admin/stores/{store_id}/status',
            headers=self.admin_headers,
            json={'status': 'ACTIVE'},
        )
        self.assert_status(approve, 200)
        self.assertEqual(approve.get_json()['data']['owner_user_id'], owner_id)

        refreshed_owner_token = self.login(owner)
        refreshed_owner_headers = self._headers(refreshed_owner_token)
        profile = self.client.get('/api/v1/users/me', headers=refreshed_owner_headers)
        self.assert_status(profile, 200)
        self.assertIn('SELLER', profile.get_json()['data']['roles'])
        self.assert_status(self.client.get('/api/v1/seller/store', headers=refreshed_owner_headers), 200)

        other, other_registered = self.register('SHIPPER-CANDIDATE')
        self.assert_status(other_registered, 201)
        other_token = self.login(other)
        other_headers = self._headers(other_token)
        other_id = User.query.filter_by(email=other['email']).one().user_id
        self.assert_status(self.client.patch('/api/v1/seller/store', headers=other_headers, json={
            'store_name': 'Must not update'
        }), 403)

        assign_shipper = self.client.post(
            f'/api/v1/admin/users/{other_id}/roles',
            headers=self.admin_headers,
            json={'role_code': 'SHIPPER'},
        )
        self.assert_status(assign_shipper, 201)
        self.assert_status(self.client.post(
            f'/api/v1/admin/users/{other_id}/roles',
            headers=self.admin_headers,
            json={'role_code': 'SHIPPER'},
        ), 409)

        other_profile = self.client.get('/api/v1/users/me', headers=other_headers)
        self.assert_status(other_profile, 200)
        self.assertIn('SHIPPER', other_profile.get_json()['data']['roles'])

        self.assert_status(self.client.post(
            f'/api/v1/admin/users/{other_id}/roles',
            headers=other_headers,
            json={'role_code': 'ADMIN'},
        ), 403)
        self.assert_status(self.client.post(
            f'/api/v1/admin/users/{self.admin_id}/roles',
            headers=self.admin_headers,
            json={'role_code': 'SHIPPER'},
        ), 403)

        duplicate_roles = db.session.execute(text("""
            SELECT COUNT(*) FROM (
                SELECT user_id, role_id FROM user_roles
                GROUP BY user_id, role_id HAVING COUNT(*) > 1
            ) duplicates
        """)).scalar()
        self.assertEqual(duplicate_roles, 0)
        self.assert_status(self.client.get('/api/v1/admin/users', headers=self.admin_headers), 200)
        self.assert_status(self.client.get('/api/v1/admin/stores', headers=self.admin_headers), 200)


if __name__ == '__main__':
    unittest.main(verbosity=2)
