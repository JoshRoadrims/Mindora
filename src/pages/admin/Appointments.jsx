import { useEffect, useState } from 'react'
import { Loader2, Video, MapPin } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { api } from '../../data/api.js'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .adminListAppointments()
      .then((data) => !cancelled && setAppointments(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Appointments"
        title="Platform-wide appointments"
        subtitle="Most recent 100 appointments across the network."
      />

      <div className="p-8 space-y-3 max-w-4xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {appointments === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading appointments...
          </Card>
        )}

        {appointments?.map((a) => (
          <Card key={a.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-navy-800">{formatDateTime(a.scheduledFor)}</p>
              <p className="text-sm text-ink-500 mt-1">
                {a.userFullName} → {a.professionalFullName}
              </p>
              <p className="text-xs text-ink-400 flex items-center gap-1 mt-1">
                {a.type === 'ONLINE' ? (
                  <Video className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
                {a.type === 'ONLINE' ? 'Online' : 'In-person'} • KES {a.feeKes.toLocaleString()}
              </p>
            </div>
            <Badge tone={a.status === 'SCHEDULED' ? 'teal' : 'neutral'}>{a.status}</Badge>
          </Card>
        ))}

        {appointments && appointments.length === 0 && (
          <Card className="text-center text-ink-400 py-12 text-sm">No appointments yet.</Card>
        )}
      </div>
    </div>
  )
}