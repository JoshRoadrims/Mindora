import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  LineChart,
  Search,
  CalendarDays,
  BookOpen,
  Sparkles,
  Settings,
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'

const items = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/check-in', label: 'Check-in', icon: ClipboardCheck },
  { to: '/app/wellbeing', label: 'My wellbeing', icon: LineChart },
  { to: '/app/find-a-professional', label: 'Find a professional', icon: Search },
  { to: '/app/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/app/resources', label: 'Resources', icon: BookOpen },
  { to: '/app/mindora-ai', label: 'Mindora AI', icon: Sparkles },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar items={items} roleLabel="Individual account" roleName="Joshua Otieno" />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
