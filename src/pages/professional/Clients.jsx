import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { api } from '../../data/api.js'

function riskTone(level) {
  if (level === 'HIGH') return 'high'
  if (level === 'ACUTE') return 'acute'
  if (level === 'ELEVATED') return 'elevated'
  if (level === 'LOW') return 'low'
  return 'neutral'
}

export default function Clients() {
  const [clients, setClients] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .listClients()
      .then((data) => !cancelled && setClients(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Caseload" title="Your clients" />
      <div className="p-8 space-y-3 max-w-3xl">
        {error && <Card className="text-sm text-red-600">Couldn't load clients: {error}</Card>}

        {clients === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your clients...
          </Card>
        )}

        {clients && clients.length === 0 && (
          <Card className="text-center text-ink-400 py-12 text-sm">
            No clients yet — accepted referrals and booked appointments will show up here.
          </Card>
        )}

        {clients?.map((c) => (
          <Card key={c.userId} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-navy-800">Anonymous User #{c.userId.slice(0, 8)}</p>
              <p className="text-sm text-ink-500">
                {c.lastCheckInAt
                  ? `Last check-in: ${new Date(c.lastCheckInAt).toLocaleDateString()}`
                  : 'No check-ins yet'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {c.latestRiskLevel && <Badge tone={riskTone(c.latestRiskLevel)}>{c.latestRiskLevel}</Badge>}
              <Link
                to={`/pro/clients/${c.userId}`}
                className="text-teal-600 text-sm font-semibold flex items-center gap-1"
              >
                View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}