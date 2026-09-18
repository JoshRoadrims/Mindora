import { useEffect, useState } from 'react'
import { ShieldAlert, Clock, Loader2, Check } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { api } from '../../data/api.js'

const categoryMeta = {
  LOW: { title: 'LOW CONCERN', subtitle: 'Self-guided support', tone: 'low' },
  ELEVATED: { title: 'ELEVATED', subtitle: 'Professional referral', tone: 'elevated' },
  HIGH: { title: 'HIGH', subtitle: 'Prompt clinical assessment', tone: 'high' },
  ACUTE: { title: 'ACUTE', subtitle: 'Urgent / emergency pathway', tone: 'acute' },
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.round(hrs / 24)} day(s) ago`
}

export default function Safety() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)

  const load = () => {
    api
      .getAdminSafety()
      .then(setData)
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  const handleResolve = async (id) => {
    setResolvingId(id)
    try {
      await api.resolveSafetyAlert(id)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setResolvingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Clinical safety"
        title="Safety & escalation monitoring"
        subtitle="Restricted access. All entries are pseudonymised and reviewed by qualified clinical staff."
      />

      <div className="p-8 space-y-6 max-w-5xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {!data && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading safety queue...
          </Card>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryMeta).map(([key, meta]) => (
                <Card key={key}>
                  <Badge tone={meta.tone} className="mb-3">{meta.title}</Badge>
                  <p className="text-3xl font-bold text-navy-800">{data.counts[key] ?? 0}</p>
                  <p className="text-xs text-ink-500 mt-1">{meta.subtitle}</p>
                </Card>
              ))}
            </div>

            <Card>
              <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" /> Alerts requiring professional review
              </h3>

              {data.alerts.length === 0 && (
                <p className="text-sm text-ink-400 py-6 text-center">
                  No open alerts right now.
                </p>
              )}

              <div className="divide-y divide-ink-100">
                {data.alerts.map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge tone={categoryMeta[a.level]?.tone ?? 'elevated'}>{a.level}</Badge>
                        <span className="text-sm font-semibold text-navy-800">
                          User #{a.userId.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-ink-600">{a.note}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-ink-400">
                        <Clock className="h-3.5 w-3.5" /> {timeAgo(a.createdAt)}
                      </span>
                      <Button
                        variant="secondary"
                        onClick={() => handleResolve(a.id)}
                        disabled={resolvingId === a.id}
                      >
                        {resolvingId === a.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" /> Resolve
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        <Disclaimer tone="urgent">
          This dashboard supports human clinical review and escalation — it does not perform
          autonomous diagnosis. All acute-pathway cases require sign-off from a qualified
          professional before action is taken.
        </Disclaimer>
      </div>
    </div>
  )
}