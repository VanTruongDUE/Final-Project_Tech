import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, LogIn, Send, LockKeyhole, Info, CheckCircle2 } from "lucide-react";

const PRIMARY = "#ee4d2d";
const PRIMARY_DARK = "#b22204";
const BORDER = "#e3beb6";
const PRIMARY_FIXED = "#ffdad3";
const VARIANT = "#5b403b";

/* ================== SHELL ================== */
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-['Inter']"
      style={{
        color: "#1b1c1c",
        background: `
          radial-gradient(at 15% 20%, ${PRIMARY_FIXED} 0px, transparent 55%),
          radial-gradient(at 85% 15%, #ffe4d6 0px, transparent 50%),
          radial-gradient(at 75% 85%, #fff1ec 0px, transparent 55%),
          radial-gradient(at 20% 80%, #ffdad3 0px, transparent 50%),
          linear-gradient(135deg, #fff8f5 0%, #fbf9f9 100%)
        `,
      }}
    >
      {/* Soft dot grid overlay for ecommerce texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(#ee4d2d 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />

      <main
        className="w-full max-w-[480px] bg-white rounded-xl border p-6 sm:p-12 relative z-10"
        style={{ borderColor: BORDER, boxShadow: "0px 16px 40px rgba(238,77,45,0.08), 0px 4px 12px rgba(0,0,0,0.04)" }}
      >
        {children}
      </main>
    </div>
  );
}

function Brand({ size = "lg" }: { size?: "lg" | "md" }) {
  const cls = size === "lg" ? "text-[32px] leading-[1.25]" : "text-[24px] leading-[1.3]";
  return <h1 className={`${cls} font-bold tracking-tight`} style={{ color: PRIMARY }}>TechToShop</h1>;
}

function Field({ id, label, type = "text", placeholder, icon: Icon, rightSlot, defaultValue, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium leading-[1.2]" style={{ color: "#1b1c1c" }}>{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} style={{ color: VARIANT }} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={value === undefined ? defaultValue : undefined}
          value={value}
          onChange={onChange}
          className={`w-full h-12 ${Icon ? "pl-10" : "px-4"} ${rightSlot ? "pr-10" : "pr-4"} bg-white border rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2`}
          style={{ borderColor: BORDER, color: "#1b1c1c", ["--tw-ring-color" as any]: `${PRIMARY}33` }}
          onFocus={(e) => (e.currentTarget.style.borderColor = PRIMARY)}
          onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
        />
        {rightSlot && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightSlot}</div>}
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: PRIMARY, boxShadow: "0px 4px 12px rgba(238,77,45,0.2)" }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = PRIMARY_DARK)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = PRIMARY)}
    >
      {children}
    </button>
  );
}

function PwdToggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="hover:opacity-70 transition-opacity" style={{ color: VARIANT }} aria-label={on ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
      {on ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  );
}

function Divider({ label = "HOẶC" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
      <span className="text-[12px] font-medium uppercase tracking-widest" style={{ color: VARIANT }}>{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
    </div>
  );
}

function BackLink({ onClick, label = "Quay lại Đăng nhập" }: { onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-all" style={{ color: PRIMARY }}>
      <ArrowLeft size={16} /> {label}
    </button>
  );
}

/* ================== LOGIN ================== */
export function LoginPage({ onLogin, goRegister, goForgot }: { onLogin?: (email?: string) => void; goRegister?: () => void; goForgot?: () => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("customer@techtoshop.vn");
  const submit = () => onLogin?.(email);
  return (
    <AuthShell>
      <div className="text-center mb-12">
        <Brand />
        <p className="mt-2 text-sm" style={{ color: VARIANT }}>Quản trị hệ thống & Cửa hàng</p>
        <p className="mt-3 text-xs px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: "#fff3ee", color: PRIMARY }}>
          💡 Demo: <code>customer@</code> → KH · <code>shop@</code> → Seller · <code>admin@</code> → Admin · <code>shipper@</code> → Shipper
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field id="login_id" label="Email hoặc Số điện thoại" placeholder="Nhập email hoặc số điện thoại" icon={User} value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <Field id="login_pwd" label="Mật khẩu" type={showPwd ? "text" : "password"} placeholder="Nhập mật khẩu" icon={Lock} defaultValue="123456" rightSlot={<PwdToggle on={showPwd} toggle={() => setShowPwd(!showPwd)} />} />

        <div className="flex items-center justify-between -mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border accent-[#ee4d2d] cursor-pointer" style={{ borderColor: BORDER }} />
            <span className="text-sm select-none transition-colors group-hover:text-[#ee4d2d]" style={{ color: "#1b1c1c" }}>Ghi nhớ đăng nhập</span>
          </label>
          <button type="button" onClick={goForgot} className="text-[12px] font-medium hover:underline transition-all" style={{ color: PRIMARY }}>Quên mật khẩu?</button>
        </div>

        <PrimaryBtn onClick={submit}>Đăng nhập <LogIn size={16} /></PrimaryBtn>
      </form>

      <Divider />

      <div className="text-center text-sm" style={{ color: "#1b1c1c" }}>
        Chưa có tài khoản? <button onClick={goRegister} className="ml-1 font-medium hover:underline transition-all" style={{ color: PRIMARY }}>Đăng ký ngay</button>
      </div>
    </AuthShell>
  );
}

/* ================== REGISTER ================== */
export function RegisterPage({ onSubmit, goLogin }: { onSubmit?: () => void; goLogin?: () => void }) {
  return (
    <AuthShell>
      <div className="text-center mb-12">
        <Brand />
        <h2 className="mt-2 text-[20px] font-bold leading-[1.4]" style={{ color: "#1b1c1c" }}>Tạo tài khoản mới</h2>
        <p className="mt-1 text-sm" style={{ color: VARIANT }}>Điền thông tin bên dưới để bắt đầu</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}>
        <Field id="r_name" label="Họ tên" placeholder="Nhập họ và tên" />
        <Field id="r_email" label="Email" type="email" placeholder="Nhập địa chỉ email" />
        <Field id="r_phone" label="Số điện thoại" type="tel" placeholder="Nhập số điện thoại" />
        <Field id="r_pwd" label="Mật khẩu" type="password" placeholder="Tạo mật khẩu" />
        <Field id="r_pwd2" label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" />

        <label className="flex items-start gap-2 mt-2 cursor-pointer">
          <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border accent-[#ee4d2d] cursor-pointer" style={{ borderColor: BORDER }} />
          <span className="text-sm font-medium" style={{ color: VARIANT }}>
            Tôi đồng ý với <a className="font-medium hover:underline" style={{ color: PRIMARY }}>Điều khoản sử dụng</a> và <a className="font-medium hover:underline" style={{ color: PRIMARY }}>Chính sách bảo mật</a> của TechToShop.
          </span>
        </label>

        <div className="mt-2"><PrimaryBtn onClick={onSubmit}>Đăng ký</PrimaryBtn></div>
      </form>

      <div className="mt-6 pt-6 text-center text-sm border-t" style={{ borderColor: BORDER, color: VARIANT }}>
        Đã có tài khoản? <button onClick={goLogin} className="ml-1 font-bold hover:underline transition-colors" style={{ color: PRIMARY }}>Đăng nhập ngay</button>
      </div>
    </AuthShell>
  );
}

/* ================== FORGOT PASSWORD ================== */
export function ForgotPasswordPage({ onSent, goLogin }: { onSent?: () => void; goLogin?: () => void }) {
  return (
    <AuthShell>
      <div className="text-center mb-6">
        <Brand />
        <h2 className="mt-2 text-[20px] font-bold leading-[1.4]" style={{ color: "#1b1c1c" }}>Quên mật khẩu</h2>
        <p className="mt-2 text-sm" style={{ color: VARIANT }}>Nhập Email hoặc Số điện thoại của bạn để nhận mã OTP khôi phục mật khẩu.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSent?.(); }}>
        <Field id="fp_id" label="Email hoặc Số điện thoại" placeholder="VD: user@example.com hoặc 0987654321" icon={Mail} />
        <PrimaryBtn onClick={onSent}>Gửi mã OTP <Send size={16} /></PrimaryBtn>
      </form>

      <div className="mt-6 text-center"><BackLink onClick={goLogin} /></div>
    </AuthShell>
  );
}

/* ================== VERIFY OTP ================== */
export function VerifyOtpPage({ onVerified, goBack }: { onVerified?: () => void; goBack?: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(43);

  const filled = otp.every(d => d !== "");

  const setDigit = (i: number, v: string) => {
    const n = [...otp];
    n[i] = v.replace(/\D/g, "").slice(0, 1);
    setOtp(n);
    setError(false);
    if (n[i] && i < 5) {
      const next = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const prev = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("") === "123456") { setError(true); setOtp(["", "", "", "", "", ""]); }
    else onVerified?.();
  };

  return (
    <AuthShell>
      <div className="flex flex-col items-center">
        <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: PRIMARY_FIXED }}>
          <LockKeyhole size={28} style={{ color: PRIMARY }} />
        </div>
        <h1 className="text-[20px] font-bold leading-[1.4] text-center" style={{ color: "#1b1c1c" }}>Xác thực OTP</h1>
        <p className="mt-2 text-sm text-center max-w-[320px]" style={{ color: VARIANT }}>
          Vui lòng nhập mã gồm 6 chữ số đã được gửi đến email <span className="font-medium" style={{ color: "#1b1c1c" }}>te***@gmail.com</span> và số điện thoại của bạn để hoàn tất xác thực.
        </p>
      </div>

      <form className="w-full flex flex-col gap-6 mt-12" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              autoFocus={i === 0}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-[20px] font-semibold bg-white border rounded-lg outline-none transition-all shadow-sm focus:ring-2"
              style={{ borderColor: error ? "#ba1a1a" : "#8f7069", color: "#1b1c1c", ["--tw-ring-color" as any]: error ? "#ba1a1a33" : `${PRIMARY}33` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = error ? "#ba1a1a" : PRIMARY)}
              onBlur={(e) => (e.currentTarget.style.borderColor = error ? "#ba1a1a" : "#8f7069")}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-[12px] font-medium -mt-2" style={{ color: "#dc2626" }}>Mã OTP không hợp lệ hoặc đã hết hạn</p>
        )}

        <PrimaryBtn onClick={undefined as any} disabled={!filled}>Xác nhận</PrimaryBtn>
      </form>

      <div className="mt-6 text-center text-sm" style={{ color: VARIANT }}>
        Chưa nhận được mã?{" "}
        {time > 0 ? (
          <span className="font-medium" style={{ color: PRIMARY }}>Gửi lại mã sau 00:{time.toString().padStart(2, "0")}</span>
        ) : (
          <button onClick={() => setTime(59)} className="font-medium hover:underline" style={{ color: PRIMARY }}>Gửi lại mã</button>
        )}
      </div>

      <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: "#8f7069" }}>
        <button onClick={goBack} className="inline-flex items-center gap-1 text-[12px] font-medium hover:opacity-70 transition" style={{ color: VARIANT }}>
          <ArrowLeft size={14} /> Quay lại màn hình đăng nhập
        </button>
      </div>
    </AuthShell>
  );
}

/* ================== RESET PASSWORD ================== */
export function ResetPasswordPage({ onSuccess, goLogin }: { onSuccess?: () => void; goLogin?: () => void }) {
  const [done, setDone] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  return (
    <AuthShell>
      <div className="text-center flex flex-col gap-2 mb-2">
        <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}1a` }}>
          <LockKeyhole size={22} style={{ color: PRIMARY }} />
        </div>
        <h1 className="text-[24px] font-bold leading-[1.3]" style={{ color: PRIMARY }}>Đặt lại mật khẩu</h1>
        <p className="text-sm" style={{ color: VARIANT }}>Vui lòng nhập mật khẩu mới cho tài khoản TechToShop của bạn.</p>
      </div>

      <form className="flex flex-col gap-4 mt-6" onSubmit={(e) => { e.preventDefault(); setDone(true); onSuccess?.(); }}>
        <Field id="np" label="Mật khẩu mới" type={show1 ? "text" : "password"} placeholder="••••••••" rightSlot={<PwdToggle on={show1} toggle={() => setShow1(!show1)} />} />
        <Field id="np2" label="Xác nhận mật khẩu" type={show2 ? "text" : "password"} placeholder="••••••••" rightSlot={<PwdToggle on={show2} toggle={() => setShow2(!show2)} />} />

        <div className="flex items-start gap-2 p-3 mt-1 rounded border" style={{ backgroundColor: "#fbf9f9", borderColor: BORDER }}>
          <Info size={18} style={{ color: PRIMARY }} className="mt-0.5 shrink-0" />
          <p className="text-[12px] font-medium" style={{ color: VARIANT }}>Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ cái và số.</p>
        </div>

        {done && (
          <div className="flex items-center gap-2 p-3 rounded border" style={{ backgroundColor: "#16a34a1a", borderColor: "#16a34a" }}>
            <CheckCircle2 size={18} style={{ color: "#16a34a" }} className="shrink-0" />
            <p className="text-[12px] font-medium" style={{ color: "#16a34a" }}>Mật khẩu đã được cập nhật thành công!</p>
          </div>
        )}

        <div className="mt-2"><PrimaryBtn onClick={() => { setDone(true); onSuccess?.(); }}>Cập nhật mật khẩu <ArrowRight size={16} /></PrimaryBtn></div>
      </form>

      <div className="text-center mt-6"><BackLink onClick={goLogin} label="Quay lại đăng nhập" /></div>
    </AuthShell>
  );
}
