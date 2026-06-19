import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { buyerBankService } from '../../services/buyerBankService'

const emptyCardForm = {
  id: '',
  cardName: '',
  cardNumber: '',
  brand: 'VISA',
  isPrimary: false,
}

const emptyBankForm = {
  id: '',
  bankName: '',
  accountNumber: '',
  accountHolder: '',
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-5 9 5" />
      <path d="M5 10h14" />
      <path d="M6 10v7" />
      <path d="M10 10v7" />
      <path d="M14 10v7" />
      <path d="M18 10v7" />
      <path d="M4 19h16" />
    </svg>
  )
}

function PaymentSectionHeader({ title, buttonLabel, onClick }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e8e8e8] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base font-bold text-[#1b1c1c]">{title}</h2>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#d73211]"
      >
        <PlusIcon />
        {buttonLabel}
      </button>
    </div>
  )
}

function CardForm({ form, onChange, onCancel, onSubmit }) {
  return (
    <form className="mt-4 rounded border border-[#e8e8e8] bg-[#fffaf7] p-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Tên thẻ</span>
          <input
            type="text"
            value={form.cardName}
            onChange={(event) => onChange({ ...form, cardName: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">4 số cuối</span>
          <input
            type="text"
            value={form.cardNumber}
            maxLength={4}
            onChange={(event) => onChange({ ...form, cardNumber: event.target.value.replace(/\D/g, '') })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Loại thẻ</span>
          <select
            value={form.brand}
            onChange={(event) => onChange({ ...form, brand: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          >
            <option value="VISA">VISA</option>
            <option value="MC">Mastercard</option>
            <option value="JCB">JCB</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-[#5b403b]">
          <input
            type="checkbox"
            checked={form.isPrimary}
            onChange={(event) => onChange({ ...form, isPrimary: event.target.checked })}
            className="h-4 w-4 rounded border-[#e8e8e8] text-[#ee4d2d] focus:ring-[#ee4d2d]"
          />
          Đặt làm thẻ chính
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="h-10 rounded border border-[#e8e8e8] bg-white px-4 text-sm text-[#5b403b]">
            Hủy
          </button>
          <button type="submit" className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white">
            Lưu thẻ
          </button>
        </div>
      </div>
    </form>
  )
}

function BankForm({ form, onChange, onCancel, onSubmit }) {
  return (
    <form className="mt-4 rounded border border-[#e8e8e8] bg-[#fffaf7] p-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Tên ngân hàng</span>
          <input
            type="text"
            value={form.bankName}
            onChange={(event) => onChange({ ...form, bankName: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">4 số cuối tài khoản</span>
          <input
            type="text"
            value={form.accountNumber}
            maxLength={4}
            onChange={(event) => onChange({ ...form, accountNumber: event.target.value.replace(/\D/g, '') })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Chủ tài khoản</span>
          <input
            type="text"
            value={form.accountHolder}
            onChange={(event) => onChange({ ...form, accountHolder: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-10 rounded border border-[#e8e8e8] bg-white px-4 text-sm text-[#5b403b]">
          Hủy
        </button>
        <button type="submit" className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white">
          Lưu tài khoản
        </button>
      </div>
    </form>
  )
}

export default function BuyerBankPage() {
  const { currentUser } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState({ cards: [], banks: [] })
  const [cardForm, setCardForm] = useState(emptyCardForm)
  const [bankForm, setBankForm] = useState(emptyBankForm)
  const [editingCard, setEditingCard] = useState(false)
  const [editingBank, setEditingBank] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setPaymentMethods(buyerBankService.getPaymentMethods(currentUser))
  }, [currentUser])

  const handleSaveCard = (event) => {
    event.preventDefault()

    if (!cardForm.cardName.trim() || cardForm.cardNumber.length !== 4) {
      setFeedback('Vui lòng nhập tên thẻ và đúng 4 số cuối của thẻ.')
      return
    }

    setPaymentMethods(buyerBankService.saveCard(currentUser.id, cardForm))
    setCardForm(emptyCardForm)
    setEditingCard(false)
    setFeedback('Thẻ đã được lưu trên localStorage.')
  }

  const handleSaveBank = (event) => {
    event.preventDefault()

    if (!bankForm.bankName.trim() || bankForm.accountNumber.length !== 4 || !bankForm.accountHolder.trim()) {
      setFeedback('Vui lòng nhập đầy đủ ngân hàng, 4 số cuối và chủ tài khoản.')
      return
    }

    setPaymentMethods(buyerBankService.saveBank(currentUser.id, bankForm))
    setBankForm(emptyBankForm)
    setEditingBank(false)
    setFeedback('Tài khoản ngân hàng đã được lưu trên localStorage.')
  }

  const handleEditCard = (card) => {
    setCardForm(card)
    setEditingCard(true)
    setFeedback('')
  }

  const handleEditBank = (bank) => {
    setBankForm(bank)
    setEditingBank(true)
    setFeedback('')
  }

  const handleDeleteCard = (cardId) => {
    setPaymentMethods(buyerBankService.deleteCard(currentUser.id, cardId))
    setFeedback('Đã xóa thẻ khỏi localStorage.')
  }

  const handleDeleteBank = (bankId) => {
    setPaymentMethods(buyerBankService.deleteBank(currentUser.id, bankId))
    setFeedback('Đã xóa tài khoản ngân hàng khỏi localStorage.')
  }

  return (
    <section className="min-h-[600px] min-w-0 rounded border border-[#e8e8e8] bg-white p-6 shadow-sm md:p-8">
      {feedback ? <div className="mb-5 rounded border border-[#f0d6cf] bg-[#fff8f6] px-4 py-3 text-sm text-[#8f4e43]">{feedback}</div> : null}

      <div>
        <PaymentSectionHeader
          title="Thẻ Tín Dụng / Ghi Nợ"
          buttonLabel="Thêm thẻ mới"
          onClick={() => {
            setCardForm(emptyCardForm)
            setEditingCard(true)
            setFeedback('')
          }}
        />

        {editingCard ? (
          <CardForm form={cardForm} onChange={setCardForm} onCancel={() => setEditingCard(false)} onSubmit={handleSaveCard} />
        ) : null}

        <div className="mt-6 space-y-3">
          {paymentMethods.cards.length ? (
            paymentMethods.cards.map((card) => (
              <article
                key={card.id}
                className="group flex flex-col gap-4 rounded border border-[#e8e8e8] p-4 transition hover:border-[#ee4d2d] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-12 items-center justify-center rounded border border-blue-200 bg-blue-100 text-xs font-bold italic text-blue-600">
                    {card.brand}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#1b1c1c]">{card.cardName}</span>
                      {card.isPrimary ? <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Chính</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-[#5b403b]">**** **** **** {card.cardNumber}</p>
                  </div>
                </div>
                <div className="flex gap-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                  <button type="button" onClick={() => handleEditCard(card)} className="text-sm text-[#5b403b] underline hover:text-[#ee4d2d]">
                    Sửa
                  </button>
                  <button type="button" onClick={() => handleDeleteCard(card.id)} className="text-sm text-[#5b403b] underline hover:text-[#ee4d2d]">
                    Xóa
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded border border-dashed border-[#e8e8e8] p-4 text-sm text-[#5b403b]">Bạn chưa thêm thẻ thanh toán nào.</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <PaymentSectionHeader
          title="Tài Khoản Ngân Hàng"
          buttonLabel="Thêm tài khoản ngân hàng"
          onClick={() => {
            setBankForm({
              ...emptyBankForm,
              accountHolder: currentUser?.fullName || '',
            })
            setEditingBank(true)
            setFeedback('')
          }}
        />

        {editingBank ? (
          <BankForm form={bankForm} onChange={setBankForm} onCancel={() => setEditingBank(false)} onSubmit={handleSaveBank} />
        ) : null}

        <div className="mt-6 space-y-3">
          {paymentMethods.banks.length ? (
            paymentMethods.banks.map((bank) => (
              <article
                key={bank.id}
                className="group flex flex-col gap-4 rounded border border-[#e8e8e8] p-4 transition hover:border-[#ee4d2d] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-green-200 bg-green-50 text-green-600">
                    <BankIcon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1b1c1c]">{bank.bankName}</p>
                    <p className="mt-1 text-sm text-[#5b403b]">*******{bank.accountNumber}</p>
                    <p className="mt-0.5 text-xs text-[#8f7069]">{bank.accountHolder}</p>
                  </div>
                </div>
                <div className="flex gap-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                  <button type="button" onClick={() => handleEditBank(bank)} className="text-sm text-[#5b403b] underline hover:text-[#ee4d2d]">
                    Sửa
                  </button>
                  <button type="button" onClick={() => handleDeleteBank(bank.id)} className="text-sm text-[#5b403b] underline hover:text-[#ee4d2d]">
                    Xóa
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded border border-dashed border-[#e8e8e8] p-4 text-sm text-[#5b403b]">Bạn chưa thêm tài khoản ngân hàng nào.</p>
          )}
        </div>
      </div>
    </section>
  )
}
