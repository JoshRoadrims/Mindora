import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function Appointments() {
  const { booking } = useAppState()

  return (
    <div>
      <PageHeader eyebrow="Appointments" title="Your appointments" />
      <div className="p-8 max-w-2xl space-y-4">
        {booking ? (
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-navy-800">{booking.professional.name}</p>
              <p className="text-sm text-ink-500">{booking.slot} • {booking.type}</p>
            </div>
            <Badge tone="teal">Upcoming</Badge>
          </Card>
        ) : (
          <Card className="text-center py-16 text-ink-500 text-sm">
            No appointments booked yet. Find a professional to get started.
          </Card>
        )}
      </div>
    </div>
  )
}
