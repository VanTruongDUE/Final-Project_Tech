from datetime import datetime

from extensions import db
from models.address import Address


class AddressService:
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    @staticmethod
    def _active_query(user_id):
        return Address.query.filter(
            Address.user_id == user_id,
            Address.status == AddressService.ACTIVE,
            Address.deleted_at.is_(None)
        )

    @staticmethod
    def _clear_default(user_id, except_address_id=None):
        query = AddressService._active_query(user_id).filter(Address.is_default == True)
        if except_address_id is not None:
            query = query.filter(Address.address_id != except_address_id)
        query.update({'is_default': False}, synchronize_session='fetch')

    @staticmethod
    def add_address(user_id, data):
        try:
            is_default = bool(data.get('is_default', False))
            if is_default:
                AddressService._clear_default(user_id)

            new_address = Address(
                user_id=user_id,
                recipient_name=data.get('recipient_name'),
                recipient_phone=data.get('recipient_phone'),
                address_line=data.get('address_line'),
                ward=data.get('ward'),
                district=data.get('district'),
                province=data.get('province'),
                country=data.get('country', 'Việt Nam'),
                is_default=is_default,
                status=AddressService.ACTIVE
            )
            db.session.add(new_address)
            db.session.commit()
            return {
                'status': 'success',
                'message': 'Thêm địa chỉ mới thành công!',
                'data': {'address_id': new_address.address_id}
            }, 201
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def get_my_addresses(user_id):
        addresses = (
            AddressService._active_query(user_id)
            .order_by(Address.is_default.desc(), Address.created_at.desc())
            .all()
        )

        address_list = [{
            'address_id': address.address_id,
            'recipient_name': address.recipient_name,
            'recipient_phone': address.recipient_phone,
            'address_line': address.address_line,
            'ward': address.ward,
            'district': address.district,
            'province': address.province,
            'country': address.country,
            'is_default': address.is_default
        } for address in addresses]

        return {
            'status': 'success',
            'message': 'Lấy danh sách địa chỉ thành công!' if addresses else 'Bạn chưa có địa chỉ nào.',
            'data': address_list
        }, 200

    @staticmethod
    def update_address(user_id, address_id, data):
        try:
            address = AddressService._active_query(user_id).filter(
                Address.address_id == address_id
            ).first()
            if not address:
                return {
                    'status': 'error',
                    'message': 'Không tìm thấy địa chỉ hoặc bạn không có quyền sửa!'
                }, 404

            is_default = data.get('is_default', address.is_default)
            if bool(is_default) and not address.is_default:
                AddressService._clear_default(user_id, except_address_id=address.address_id)

            address.recipient_name = data.get('recipient_name', address.recipient_name)
            address.recipient_phone = data.get('recipient_phone', address.recipient_phone)
            address.address_line = data.get('address_line', address.address_line)
            address.ward = data.get('ward', address.ward)
            address.district = data.get('district', address.district)
            address.province = data.get('province', address.province)
            address.country = data.get('country', address.country)
            address.is_default = bool(is_default)
            address.updated_at = datetime.utcnow()

            db.session.commit()
            return {'status': 'success', 'message': 'Cập nhật địa chỉ thành công!'}, 200
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def delete_address(user_id, address_id):
        try:
            address = AddressService._active_query(user_id).filter(
                Address.address_id == address_id
            ).first()
            if not address:
                return {
                    'status': 'error',
                    'message': 'Không tìm thấy địa chỉ hoặc địa chỉ đã bị xóa!'
                }, 404

            was_default = bool(address.is_default)
            now = datetime.utcnow()
            address.is_default = False
            address.status = AddressService.INACTIVE
            address.deleted_at = now
            address.updated_at = now

            if was_default:
                # Flush the old default first to satisfy the filtered unique index.
                db.session.flush()
                replacement = (
                    AddressService._active_query(user_id)
                    .filter(Address.address_id != address.address_id)
                    .order_by(Address.created_at.desc(), Address.address_id.desc())
                    .first()
                )
                if replacement:
                    AddressService._clear_default(user_id, except_address_id=replacement.address_id)
                    replacement.is_default = True
                    replacement.updated_at = now

            db.session.commit()
            return {'status': 'success', 'message': 'Xóa địa chỉ thành công!'}, 200
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def set_default_address(user_id, address_id):
        try:
            address = AddressService._active_query(user_id).filter(
                Address.address_id == address_id
            ).first()
            if not address:
                return {'status': 'error', 'message': 'Không tìm thấy địa chỉ!'}, 404

            if address.is_default:
                return {'status': 'success', 'message': 'Địa chỉ này đang là mặc định rồi!'}, 200

            AddressService._clear_default(user_id, except_address_id=address.address_id)
            address.is_default = True
            address.updated_at = datetime.utcnow()
            db.session.commit()
            return {
                'status': 'success',
                'message': 'Đã thiết lập địa chỉ mặc định thành công!'
            }, 200
        except Exception:
            db.session.rollback()
            raise
