import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { buyerPrivacyService } from '../../services/buyerPrivacyService'

const privacyGroups = [
  {
    title: 'Bảo mật đơn hàng',
    options: [
      {
        key: 'requireCodForHighValue',
        title: 'Yêu cầu thanh toán khi nhận hàng (COD)',
        description:
          'Ưu tiên phương thức thanh toán khi nhận hàng đối với các đơn hàng giá trị cao để bạn kiểm tra trước khi thanh toán.',
      },
      {
        key: 'hidePhoneUntilShipping',
        title: 'Ẩn số điện thoại cho đến khi đơn bắt đầu giao',
        description:
          'Chỉ hiển thị số điện thoại cho đơn vị giao hàng hoặc shop khi đơn đã bước sang trạng thái vận chuyển.',
      },
      {
        key: 'requireConfirmForSensitiveChanges',
        title: 'Yêu cầu xác nhận khi đổi thông tin quan trọng',
        description:
          'Hiển thị bước xác nhận khi thay đổi mật khẩu, số điện thoại, địa chỉ mặc định hoặc tài khoản ngân hàng.',
      },
    ],
  },
  {
    title: 'Hiển thị hồ sơ',
    options: [
      {
        key: 'publicShoppingActivity',
        title: 'Công khai hoạt động mua sắm',
        description:
          'Cho phép người khác xem sản phẩm bạn đã đánh giá, yêu thích và các bộ sưu tập công khai của bạn.',
      },
      {
        key: 'allowFindByPhone',
        title: 'Cho phép tìm thấy tôi qua số điện thoại',
        description:
          'Giúp bạn bè trong danh bạ dễ tìm thấy tài khoản TechToShop của bạn thông qua số điện thoại đã đăng ký.',
      },
      {
        key: 'hideEmailFromSellers',
        title: 'Ẩn email với người bán',
        description:
          'Người bán chỉ nhìn thấy tên hiển thị và mã khách hàng, không nhìn thấy email đăng nhập của bạn.',
      },
    ],
  },
  {
    title: 'Tương tác và gợi ý',
    options: [
      {
        key: 'allowSellerMessagesAfterOrder',
        title: 'Cho phép shop nhắn tin sau đơn hàng',
        description:
          'Shop có thể gửi tin nhắn liên quan đến hỗ trợ, bảo hành hoặc phản hồi sau khi bạn đã mua hàng.',
      },
      {
        key: 'personalizedRecommendations',
        title: 'Nhận gợi ý sản phẩm cá nhân hóa',
        description:
          'TechToShop dùng lịch sử xem, tìm kiếm và mua hàng mock để gợi ý sản phẩm phù hợp hơn trong demo.',
      },
    ],
  },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-[#26aa99]' : 'bg-[#e3e2e2]'}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full border border-[#e8e8e8] bg-white transition ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

export default function BuyerPrivacyPage() {
  const { currentUser } = useAuth()
  const [settings, setSettings] = useState(buyerPrivacyService.getSettings(currentUser))
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setSettings(buyerPrivacyService.getSettings(currentUser))
  }, [currentUser])

  const handleToggle = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }))
    setFeedback('')
  }

  const handleSave = () => {
    setSettings(buyerPrivacyService.updateSettings(currentUser.id, settings))
    setFeedback('Thiết lập riêng tư đã được lưu trên localStorage.')
  }

  return (
    <section className="min-h-[600px] min-w-0 rounded border border-[#e8e8e8] bg-white p-6 shadow-sm md:p-8">
      <div className="border-b border-[#e8e8e8] pb-4">
        <h1 className="text-xl font-bold text-[#1b1c1c]">Thiết lập riêng tư</h1>
        <p className="mt-2 text-sm leading-6 text-[#5b403b]">
          Quản lý các tùy chọn bảo mật, hiển thị hồ sơ và tương tác cá nhân của bạn.
        </p>
      </div>

      {feedback ? <div className="mt-5 rounded border border-[#f0d6cf] bg-[#fff8f6] px-4 py-3 text-sm text-[#8f4e43]">{feedback}</div> : null}

      <div className="mt-6 space-y-8">
        {privacyGroups.map((group) => (
          <section key={group.title}>
            <h2 className="border-b border-[#e8e8e8] pb-3 text-base font-bold text-[#1b1c1c]">{group.title}</h2>
            <div>
              {group.options.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center justify-between gap-5 border-b border-[#e8e8e8] px-2 py-5 transition last:border-0 hover:bg-[#f5f3f3]"
                >
                  <div className="max-w-[80%]">
                    <p className="text-sm font-semibold text-[#1b1c1c]">{option.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#5b403b]">{option.description}</p>
                  </div>
                  <Toggle checked={Boolean(settings[option.key])} onChange={(value) => handleToggle(option.key, value)} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-end border-t border-[#e8e8e8] pt-6">
        <button type="button" onClick={handleSave} className="h-10 rounded bg-[#ee4d2d] px-6 text-sm font-semibold text-white transition hover:bg-[#d73211]">
          Lưu thay đổi
        </button>
      </div>
    </section>
  )
}
