import { useEffect, useState } from 'react'
import { Loader2, Video, MapPin } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const JOIN_WINDOW_BEFORE_MS = 10 * 60 * 1000
const JOIN_WINDOW_AFTER_MS = 60 * 60 * 1000

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function canJoin(a) {
  if (a.status !== 'SCHEDULED' || a.type !== 'ONLINE' || !a.meetingUrl) return false
  const start = new Date(a.scheduledFor).getTime()
  const now = Date.now()
  return now >= start - JOIN_WINDOW_BEFORE_MS && now <= start + JOIN_WINDOW_AFTER_MS
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getMyAppointments()
      .then((data) => !cancelled && setAppointments(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Appointments" title="Your appointments" />
      <div className="p-8 max-w-2xl space-y-4">
        {error && <Card className="text-sm text-red-600">Couldn't load appointments: {error}</Card>}

        {appointments === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your appointments...
          </Card>
        )}

        {appointments && appointments.length === 0 && (
          <Card className="text-center py-16 text-ink-500 text-sm">
            No appointments booked yet. Find a professional to get started.
          </Card>
        )}

        {appointments?.map((a) => (
          <Card key={a.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-navy-800">{a.professional.fullName}</p>
                <p className="text-sm text-ink-500 mt-1">{formatDateTime(a.scheduledFor)}</p>
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
            </div>

            {a.status === 'SCHEDULED' && a.type === 'ONLINE' && (
              <div className="pt-3 border-t border-ink-100">
                {canJoin(a) ? (
                  <Button as="a" href={a.meetingUrl} target="_blank" rel="noopener noreferrer" variant="accent">
                    <Video className="h-4 w-4" /> Join meeting
                  </Button>
                ) : (
                  <p className="text-xs text-ink-400">
                    Join link opens 10 minutes before your scheduled time.
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}