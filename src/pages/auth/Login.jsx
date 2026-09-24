import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Stethoscope, ShieldCheck, Loader2, Eye, EyeOff, Mail } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function Login() {
  const [audience, setAudience] = useState('user') // 'user' | 'professional' | 'admin'
  const [email, setEmail] = useState('kilwanda.josh@roadrimz.com')
  const [password, setPassword] = useState('demo-password')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const navigate = useNavigate()
  const { requestLogin, verifyOtp, cancelOtp, otpPending, authError } = useAppState()

  const handleAudienceChange = (next) => {
    setAudience(next)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await requestLogin(audience, email, password)
    setSubmitting(false)
    // On success, otpPending gets set by AppState and the OTP screen below
    // renders automatically — no navigation happens yet at this step.
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otpPending) return
    setVerifying(true)
    const role = otpPending.role
    const ok = await verifyOtp(otpCode)
    setVerifying(false)
    if (ok) {
      navigate(role === 'user' ? '/app' : role === 'professional' ? '/pro' : '/admin')
    }
  }

  // --- OTP entry screen ---
  if (otpPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mindora-soft p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-navy-800 mb-1 text-center">Check your email</h2>
          <p className="text-sm text-ink-500 mb-6 text-center">
            We sent a 6-digit code to <span className="font-medium text-navy-700">{otpPending.email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-ink-200 px-4 py-3 text-center text-2xl tracking-[0.5em] font-semibold focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
              autoFocus
            />
            {authError && <p className="text-sm text-red-600 text-center">{authError}</p>}
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={verifying || otpCode.length !== 6}
            >
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify and log in'}
            </Button>
          </form>

          <button
            onClick={() => {
              cancelOtp()
              setOtpCode('')
            }}
            className="w-full text-center text-sm text-ink-400 hover:text-navy-600 mt-6"
          >
            ← Back to login
          </button>

          <p className="text-xs text-ink-400 mt-4 text-center">
            Code expires in 10 minutes. Going back and logging in again will send a new one.
          </p>
        </div>
      </div>
    )
  }

  // --- Email/password screen ---
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between bg-mindora-gradient text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-navy-300 blur-3xl" />
        </div>
        <div className="relative flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-teal-400 flex items-center justify-center font-display font-bold text-navy-900">
            M
          </div>
          <span className="font-display font-bold text-xl">Mindora</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-display font-bold leading-tight mb-4">
            Mental health before crisis.
          </h1>
          <p className="text-navy-100 text-lg leading-relaxed">
            Understand your mental wellbeing. Identify potential risks early. Get connected to
            the right support.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-navy-200">
          <ShieldCheck className="h-4 w-4 text-teal-300" />
          Private, secure, and clinically responsible by design.
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="h-8 w-8 rounded-lg bg-teal-400 flex items-center justify-center font-display font-bold text-navy-900">
              M
            </div>
            <span className="font-display font-bold text-lg text-navy-800">Mindora</span>
          </div>

          <h2 className="text-2xl font-bold text-navy-800 mb-1">Welcome back</h2>
          <p className="text-ink-500 mb-6 text-sm">Log in to continue your wellbeing journey.</p>

          <div className="grid grid-cols-3 gap-1 rounded-xl border border-ink-200 p-1 mb-6 bg-ink-50">
            <button
              onClick={() => handleAudienceChange('user')}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                audience === 'user' ? 'bg-white shadow-soft text-navy-800' : 'text-ink-500'
              }`}
            >
              <User className="h-4 w-4" /> User
            </button>
            <button
              onClick={() => handleAudienceChange('professional')}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                audience === 'professional' ? 'bg-white shadow-soft text-navy-800' : 'text-ink-500'
              }`}
            >
              <Stethoscope className="h-4 w-4" /> Professional
            </button>
            <button
              onClick={() => handleAudienceChange('admin')}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                audience === 'admin' ? 'bg-white shadow-soft text-navy-800' : 'text-ink-500'
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-navy-700 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 px-4 py-3 pr-11 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log in'}
            </Button>
          </form>

          <p className="text-xs text-ink-400 mt-3">
            All demo accounts now use{' '}
            <span className="font-mono">kilwanda.josh@roadrimz.com</span> (except safety@/support@mindora.local) —
            password: <span className="font-mono">demo-password</span>. A login code will be emailed on submit.
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-ink-100 flex-1" />
            <span className="text-xs text-ink-400">or</span>
            <div className="h-px bg-ink-100 flex-1" />
          </div>

          <Button variant="secondary" className="w-full" onClick={() => navigate('/signup')}>
            Create account
          </Button>
        </div>
      </div>
    </div>
  )
}