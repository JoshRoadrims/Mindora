import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import { api } from '../../data/api.js'

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getAdminOverview()
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Mindora Platform Overview" />

      <div className="p-8 space-y-6 max-w-6xl">
        {error && (
          <Card className="text-sm text-red-600">
            Couldn't load platform stats: {error}
          </Card>
        )}

        {!data && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading platform stats...
          </Card>
        )}

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <p className="text-2xl font-bold text-navy-800">{data.totalUsers}</p>
              <p className="text-xs text-ink-500 mt-1">Total users</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-navy-800">{data.assessmentsCompleted}</p>
              <p className="text-xs text-ink-500 mt-1">Assessments completed</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-navy-800">{data.referralsMade}</p>
              <p className="text-xs text-ink-500 mt-1">Referrals made</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-navy-800">{data.professionalsOnNetwork}</p>
              <p className="text-xs text-ink-500 mt-1">Professional network</p>
            </Card>
          </div>
        )}

        <Card className="text-xs text-ink-400">
          Growth/trend charts (user growth, assessment completion over time, referral
          conversion) need time-series queries not yet built — these are the real,
          current totals only. Ask me to add the trend endpoints when you want history.
        </Card>
      </div>
    </div>
  )
}