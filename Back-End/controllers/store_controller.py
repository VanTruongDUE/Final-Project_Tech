from flask import request, jsonify
from services.store_service import StoreService


class StoreController:

    @staticmethod
    def store_application(current_user):
        try:
            if 'CUSTOMER' not in current_user.get('roles', []):
                return jsonify({'success': False, 'message': 'Chỉ Customer mới có thể đăng ký bán hàng'}), 403

            if request.method == 'GET':
                result, status_code = StoreService.get_store_application(current_user['user_id'])
                return jsonify(result), status_code

            if 'SELLER' in current_user.get('roles', []):
                return jsonify({'success': False, 'message': 'Tài khoản đã có vai trò Seller'}), 409

            data = request.get_json() or {}
            allowed_fields = {
                'store_name': 150,
                'description': None,
                'logo_url': 500,
                'contact_email': 255,
                'contact_phone': 20,
                'address_line': 255,
                'ward': 100,
                'district': 100,
                'province': 100,
            }
            unknown_fields = sorted(set(data) - set(allowed_fields))
            if unknown_fields:
                return jsonify({
                    'success': False,
                    'message': f'Trường không được hỗ trợ: {", ".join(unknown_fields)}'
                }), 400

            for field, max_length in allowed_fields.items():
                if field not in data:
                    continue
                value = data[field]
                if value is not None and not isinstance(value, str):
                    return jsonify({'success': False, 'message': f'{field} phải là chuỗi'}), 400
                if isinstance(value, str):
                    data[field] = value.strip()
                    if max_length and len(data[field]) > max_length:
                        return jsonify({'success': False, 'message': f'{field} vượt quá {max_length} ký tự'}), 400

            if not data.get('store_name'):
                return jsonify({'success': False, 'message': 'store_name là bắt buộc'}), 400

            result, status_code = StoreService.create_store_application(
                user_id=current_user['user_id'],
                **{field: data.get(field) for field in allowed_fields}
            )
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    # API 25: GET /api/v1/stores/:id | Public
    @staticmethod
    def get_store_info(store_id):
        try:
            result, status_code = StoreService.get_store_info(store_id)
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    # API 26: GET /api/v1/seller/store | Seller
    @staticmethod
    def get_my_store(current_user):
        try:
            if 'SELLER' not in current_user.get('roles', []):
                return jsonify({'success': False, 'message': 'Chỉ người bán mới có thể truy cập'}), 403

            result, status_code = StoreService.get_my_store(
                user_id=current_user['user_id']
            )
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    # API 27: POST /api/v1/stores | Seller
    @staticmethod
    def create_store(current_user):
        try:
            if 'SELLER' not in current_user.get('roles', []):
                return jsonify({'success': False, 'message': 'Chỉ người bán mới có thể tạo cửa hàng'}), 403

            data = request.get_json() or {}

            if not data.get('store_name'):
                return jsonify({'success': False, 'message': 'store_name là bắt buộc'}), 400

            result, status_code = StoreService.create_store(
                user_id=current_user['user_id'],
                store_name=data['store_name'],
                description=data.get('description'),
                logo_url=data.get('logo_url'),
                contact_email=data.get('contact_email'),
                contact_phone=data.get('contact_phone'),
                address_line=data.get('address_line'),
                ward=data.get('ward'),
                district=data.get('district'),
                province=data.get('province'),
            )
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    # API 28: PATCH /api/v1/seller/store | Seller
    @staticmethod
    def update_store(current_user):
        try:
            if 'SELLER' not in current_user.get('roles', []):
                return jsonify({'success': False, 'message': 'Chỉ người bán mới có thể cập nhật cửa hàng'}), 403

            data = request.get_json() or {}

            allowed_fields = {
                'store_name': 150,
                'description': None,
                'logo_url': 500,
                'contact_email': 255,
                'contact_phone': 20,
                'address_line': 255,
                'ward': 100,
                'district': 100,
                'province': 100,
            }
            unknown_fields = sorted(set(data) - set(allowed_fields))
            if unknown_fields:
                return jsonify({
                    'success': False,
                    'message': f'Trường không được hỗ trợ: {", ".join(unknown_fields)}'
                }), 400
            if not data:
                return jsonify({'success': False, 'message': 'Cần ít nhất một trường để cập nhật'}), 400

            for field, max_length in allowed_fields.items():
                if field not in data:
                    continue
                value = data[field]
                if value is not None and not isinstance(value, str):
                    return jsonify({'success': False, 'message': f'{field} phải là chuỗi'}), 400
                if isinstance(value, str):
                    data[field] = value.strip()
                    if max_length and len(data[field]) > max_length:
                        return jsonify({'success': False, 'message': f'{field} vượt quá {max_length} ký tự'}), 400

            if 'store_name' in data and not data['store_name']:
                return jsonify({'success': False, 'message': 'store_name không được để trống'}), 400

            result, status_code = StoreService.update_store(
                user_id=current_user['user_id'],
                store_name=data.get('store_name'),
                description=data.get('description'),
                logo_url=data.get('logo_url'),
                contact_email=data.get('contact_email'),
                contact_phone=data.get('contact_phone'),
                address_line=data.get('address_line'),
                ward=data.get('ward'),
                district=data.get('district'),
                province=data.get('province'),
            )
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
