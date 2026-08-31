import { CalendarDays } from 'lucide-react'
import Placeholder from '../../components/Placeholder.jsx'

export default function Appointments() {
  return (
    <Placeholder
      eyebrow="Appointments"
      title="Your schedule"
      icon={CalendarDays}
      description="A full calendar view of upcoming and past consultations will live here in the MVP build."
    />
  )
}
