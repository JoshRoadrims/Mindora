import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Inbox,
  ShieldAlert,
  BarChart3,
  Building2,
  Settings,
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'

const items = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/professionals', label: 'Professionals', icon: Stethoscope },
  { to: '/admin/referrals', label: 'Referrals', icon: Inbox },
  { to: '/admin/safety', label: 'Safety', icon: ShieldAlert },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/institutions', label: 'Institutions', icon: Building2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar items={items} roleLabel="Mindora admin" roleName="Platform team" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
