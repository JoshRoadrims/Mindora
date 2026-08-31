import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Users,
  CalendarDays,
  ClipboardList,
  Repeat,
  BarChart3,
  Settings,
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'

const items = [
  { to: '/pro', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/pro/referrals', label: 'Referrals', icon: Inbox },
  { to: '/pro/clients', label: 'Clients', icon: Users },
  { to: '/pro/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/pro/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/pro/follow-ups', label: 'Follow-ups', icon: Repeat },
  { to: '/pro/reports', label: 'Reports', icon: BarChart3 },
  { to: '/pro/settings', label: 'Settings', icon: Settings },
]

export default function ProfessionalLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar items={items} roleLabel="Professional account" roleName="Dr. Sarah Mwangi" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
