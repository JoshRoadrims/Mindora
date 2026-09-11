import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Stethoscope, ShieldCheck, Loader2 } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function Login() {
  const [audience, setAudience] = useState('user') // 'user' | 'professional'
  const [email, setEmail] = useState('joshua@example.com')
  const [password, setPassword] = useState('demo-password')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { loginUser, loginProfessional, loginAdmin, authError } = useAppState()

  const handleAudienceChange = (next) => {
    setAudience(next)
    setEmail(next === 'user' ? 'joshua@example.com' : 'sarah.mwangi@example.com')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const ok =
      audience === 'user'
        ? await loginUser(email, password)
        : await loginProfessional(email, password)
    setSubmitting(false)
    if (ok) navigate(audience === 'user' ? '/app' : '/pro')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left: brand panel */}
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

      {/* Right: auth form */}
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

          <div className="flex rounded-xl border border-ink-200 p-1 mb-6 bg-ink-50">
            <button
              onClick={() => handleAudienceChange('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                audience === 'user' ? 'bg-white shadow-soft text-navy-800' : 'text-ink-500'
              }`}
            >
              <User className="h-4 w-4" /> I'm a user
            </button>
            <button
              onClick={() => handleAudienceChange('professional')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                audience === 'professional'
                  ? 'bg-white shadow-soft text-navy-800'
                  : 'text-ink-500'
              }`}
            >
              <Stethoscope className="h-4 w-4" /> Professional
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log in'}
            </Button>
          </form>

          <p className="text-xs text-ink-400 mt-3">
            Demo accounts (after running the backend seed script):
            joshua@example.com / sarah.mwangi@example.com — password:{' '}
            <span className="font-mono">demo-password</span>
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-ink-100 flex-1" />
            <span className="text-xs text-ink-400">or</span>
            <div className="h-px bg-ink-100 flex-1" />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Create account
          </Button>

          <button
            onClick={async () => {
              setSubmitting(true)
              const ok = await loginAdmin('admin@mindora.local', 'demo-password')
              setSubmitting(false)
              if (ok) navigate('/admin')
            }}
            className="w-full text-center text-xs text-ink-400 hover:text-navy-600 mt-8"
            disabled={submitting}
          >
            Mindora team member? Enter admin console →
          </button>
        </div>
      </div>
    </div>
  )
}