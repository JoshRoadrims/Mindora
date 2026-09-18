import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { api } from '../../data/api.js'

function riskTone(level) {
  if (level === 'HIGH') return 'high'
  if (level === 'ACUTE') return 'acute'
  if (level === 'ELEVATED') return 'elevated'
  return 'low'
}

function statusTone(status) {
  if (status === 'ACCEPTED') return 'teal'
  if (status === 'ESCALATED') return 'high'
  if (status === 'CLOSED') return 'neutral'
  return 'elevated' // PENDING, MORE_INFO_REQUESTED
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.round(hrs / 24)} day(s) ago`
}

export default function Referrals() {
  const [referrals, setReferrals] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .adminListReferrals()
      .then((data) => !cancelled && setReferrals(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Referrals"
        title="Platform-wide referrals"
        subtitle="Most recent 100 referrals across the network. Kept pseudonymous, consistent with what professionals see."
      />

      <div className="p-8 space-y-3 max-w-4xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {referrals === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading referrals...
          </Card>
        )}

        {referrals?.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-navy-800">Anonymous User #{r.userId.slice(0, 8)}</p>
                <Badge tone={riskTone(r.riskLevel)}>{r.riskLevel}</Badge>
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </div>
              <p className="text-sm text-ink-500 mb-1">
                Assigned to: {r.professionalFullName}
                {r.flags.length > 0 && ` • ${r.flags.length} flag(s)`}
              </p>
              <p className="text-xs text-ink-400">{r.reason}</p>
            </div>
            <span className="text-xs text-ink-400 shrink-0">{timeAgo(r.createdAt)}</span>
          </Card>
        ))}

        {referrals && referrals.length === 0 && (
          <Card className="text-center text-ink-400 py-12 text-sm">No referrals yet.</Card>
        )}
      </div>
    </div>
  )
}