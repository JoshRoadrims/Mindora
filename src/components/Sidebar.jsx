import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAppState } from '../data/AppState.jsx'

export default function Sidebar({ items, roleLabel, roleName }) {
  const navigate = useNavigate()
  const { setRole } = useAppState()

  const handleSwitch = () => {
    setRole(null)
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-navy-800 text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-400 flex items-center justify-center font-display font-bold text-navy-900">
            M
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Mindora</span>
        </div>
        <p className="text-[11px] text-navy-200 mt-1 uppercase tracking-wide">{roleLabel}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-navy-100 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 pb-3">
          <p className="text-sm font-semibold">{roleName}</p>
          <p className="text-xs text-navy-300">Mindora demo account</p>
        </div>
        <button
          onClick={handleSwitch}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-navy-200 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Switch role / log out
        </button>
      </div>
    </aside>
  )
}
