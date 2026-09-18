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
  if (level === 'LOW') return 'low'
  return 'neutral'
}

export default function Users() {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .adminListUsers()
      .then((data) => !cancelled && setUsers(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Users"
        title="User management"
        subtitle="Names and emails are visible here for account administration. Clinical detail (screening answers, notes) stays restricted to the Safety and Referrals views."
      />

      <div className="p-8 space-y-3 max-w-4xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {users === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
          </Card>
        )}

        {users?.map((u) => (
          <Card key={u.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-navy-800">{u.fullName}</p>
              <p className="text-sm text-ink-500">{u.email}</p>
              <p className="text-xs text-ink-400 mt-1">
                {u.checkInCount} check-in{u.checkInCount === 1 ? '' : 's'} • Joined{' '}
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            {u.latestRiskLevel && <Badge tone={riskTone(u.latestRiskLevel)}>{u.latestRiskLevel}</Badge>}
          </Card>
        ))}

        {users && users.length === 0 && (
          <Card className="text-center text-ink-400 py-12 text-sm">No users yet.</Card>
        )}
      </div>
    </div>
  )
}