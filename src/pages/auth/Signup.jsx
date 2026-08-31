import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Stethoscope, ArrowRight } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function Signup() {
  const [selected, setSelected] = useState('user')
  const navigate = useNavigate()
  const { setRole } = useAppState()

  const handleCreate = (e) => {
    e.preventDefault()
    setRole(selected)
    navigate(selected === 'user' ? '/app' : '/pro')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mindora-soft p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-teal-400 flex items-center justify-center font-display font-bold text-navy-900">
            M
          </div>
          <span className="font-display font-bold text-lg text-navy-800">Mindora</span>
        </div>

        <h1 className="text-2xl font-bold text-navy-800 mb-1">Create your account</h1>
        <p className="text-ink-500 text-sm mb-6">Tell us which kind of account you need.</p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelected('user')}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              selected === 'user'
                ? 'border-teal-400 bg-teal-50/60'
                : 'border-ink-200 hover:border-ink-300'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-navy-800 text-white flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-navy-800 text-sm">I'm a user</p>
              <p className="text-xs text-ink-500">Track my wellbeing and get support</p>
            </div>
          </button>

          <button
            onClick={() => setSelected('professional')}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              selected === 'professional'
                ? 'border-teal-400 bg-teal-50/60'
                : 'border-ink-200 hover:border-ink-300'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-navy-800 text-white flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-navy-800 text-sm">I'm a mental-health professional</p>
              <p className="text-xs text-ink-500">Receive referrals and manage clients</p>
            </div>
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            placeholder="Full name"
            defaultValue="Joshua Otieno"
            className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
          <input
            placeholder="Email"
            type="email"
            defaultValue="joshua@example.com"
            className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
          <Button type="submit" variant="accent" className="w-full">
            Create account <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-teal-600 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
