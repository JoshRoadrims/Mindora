import { useEffect, useState } from 'react'
import { CalendarDays, Loader2, Video, MapPin } from 'lucide-react'
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
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getProfessionalAppointments()
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Appointments" title="Your schedule" />

      <div className="p-8 max-w-3xl space-y-6">
        {error && <Card className="text-sm text-red-600">Couldn't load appointments: {error}</Card>}

        {data === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your schedule...
          </Card>
        )}

        {data && (
          <>
            <div>
              <h3 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Upcoming ({data.upcoming.length})
              </h3>
              {data.upcoming.length === 0 && (
                <Card className="text-sm text-ink-400 text-center py-8">
                  No upcoming consultations booked yet.
                </Card>
              )}
              <div className="space-y-3">
                {data.upcoming.map((a) => (
                  <Card key={a.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy-800">{formatDateTime(a.scheduledFor)}</p>
                      <p className="text-sm text-ink-500 flex items-center gap-1 mt-1">
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
              </div>
            </div>

            {data.past.length > 0 && (
              <div>
                <h3 className="font-semibold text-navy-800 mb-3">Past ({data.past.length})</h3>
                <div className="space-y-3">
                  {data.past.map((a) => (
                    <Card key={a.id} className="flex items-center justify-between opacity-70">
                      <div>
                        <p className="font-semibold text-navy-800">{formatDateTime(a.scheduledFor)}</p>
                        <p className="text-sm text-ink-500 mt-1">
                          {a.type === 'ONLINE' ? 'Online' : 'In-person'}
                        </p>
                      </div>
                      <Badge tone="neutral">{a.status}</Badge>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}