import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerOnboardingService } from '../../services/sellerOnboardingService'

const initialForm = {
  store_name: '',
  description: '',
  contact_email: '',
  contact_phone: '',
  address_line: '',
  ward: '',
  district: '',
  province: '',
  logo_url: '',
}

export default function SellerOnboardingPage() {
  const [form, setForm] = useState(initialForm)
  const [application, setApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    sellerOnboardingService
      .getApplication()
      .then(setApplication)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)
    try {
      const result = await sellerOnboardingService.submitApplication(form)
      setApplication(result.application)
      setMessage(result.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-3xl p-6 text-sm text-[#5b403b]">Đang tải hồ sơ người bán...</div>
  }

  return (
    <main className="min-h-screen bg-[#fbf9f9] px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-xl border border-[#e3beb6] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1b1c1c]">Đăng ký trở thành người bán</h1>
            <p className="mt-2 text-sm text-[#5b403b]">Hồ sơ sẽ ở trạng thái chờ duyệt. Vai trò Seller chỉ được cấp sau khi Admin duyệt cửa hàng.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#ee4d2d] hover:underline">Về sàn</Link>
        </div>

        {application ? (
          <div className="mt-6 rounded-lg border border-[#e3beb6] bg-[#fff4f1] p-5">
            <p className="text-sm font-semibold text-[#1b1c1c]">{application.store_name}</p>
            <p className="mt-2 text-sm text-[#5b403b]">Trạng thái: <strong>{application.status}</strong></p>
            {application.status === 'ACTIVE' ? (
              <p className="mt-3 text-sm text-green-700">Cửa hàng đã được duyệt. Đăng nhập lại để nhận JWT có vai trò Seller.</p>
            ) : null}
          </div>
        ) : (
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            {Object.entries(initialForm).map(([field]) => (
              <label key={field} className={field === 'description' || field === 'address_line' ? 'sm:col-span-2' : ''}>
                <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">{field === 'store_name' ? 'Tên cửa hàng *' : field.replaceAll('_', ' ')}</span>
                {field === 'description' ? (
                  <textarea name={field} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="min-h-24 w-full rounded-lg border border-[#e3beb6] px-3 py-2 text-sm outline-none focus:border-[#ee4d2d]" />
                ) : (
                  <input name={field} value={form[field]} required={field === 'store_name'} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="h-11 w-full rounded-lg border border-[#e3beb6] px-3 text-sm outline-none focus:border-[#ee4d2d]" />
                )}
              </label>
            ))}
            <button type="submit" disabled={isSubmitting} className="h-11 rounded-lg bg-[#ee4d2d] px-5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2">
              {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ chờ duyệt'}
            </button>
          </form>
        )}

        {message ? <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      </section>
    </main>
  )
}
