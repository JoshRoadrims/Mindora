import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import BarChart from '../../components/BarChart.jsx'
import { api } from '../../data/api.js'

function riskTone(level) {
  if (level === 'HIGH') return 'high'
  if (level === 'ACUTE') return 'acute'
  if (level === 'ELEVATED') return 'elevated'
  return 'low'
}

function shortDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const tierLabels = {
  standard: 'Standard (self-pay)',
  student: 'Student discount',
  corporate: 'Corporate (EAP)',
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getAdminAnalytics()
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Platform analytics"
        subtitle="Built from current data. Trend charts will become more meaningful as real usage grows — nothing here is projected or estimated."
      />

      <div className="p-8 space-y-6 max-w-5xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {data === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics...
          </Card>
        )}

        {data && (
          <>
            <Card>
              <h3 className="font-semibold text-navy-800 mb-4 text-sm">
                Check-ins per day, last 14 days
              </h3>
              <BarChart
                data={data.checkInsByDay.map((d) => ({ label: shortDate(d.date), value: d.count }))}
                color="#3fbea3"
              />
            </Card>

            {data.tierBreakdown && (
              <Card>
                <h3 className="font-semibold text-navy-800 mb-4 text-sm">
                  Bookings and patient-paid revenue by pricing tier
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(data.tierBreakdown).map(([tier, stats]) => (
                    <div key={tier} className="rounded-xl border border-ink-100 p-4">
                      <p className="text-xs text-ink-500 mb-1">{tierLabels[tier] ?? tier}</p>
                      <p className="text-2xl font-bold text-navy-800">{stats.count}</p>
                      <p className="text-xs text-ink-400">bookings</p>
                      <p className="text-sm font-semibold text-teal-700 mt-2">
                        KES {stats.revenueKes.toLocaleString()}
                      </p>
                      <p className="text-xs text-ink-400">paid by patients</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-3">
                  "Paid by patients" excludes whatever an institution covered — corporate/EAP
                  bookings show near-zero here even when the professional's full fee was earned,
                  since the employer covers that portion.
                </p>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-navy-800 mb-4 text-sm">Risk level breakdown</h3>
                <div className="space-y-2">
                  {data.riskLevelBreakdown.length === 0 && (
                    <p className="text-sm text-ink-400">No check-ins yet.</p>
                  )}
                  {data.riskLevelBreakdown.map((r) => (
                    <div key={r.level} className="flex items-center justify-between">
                      <Badge tone={riskTone(r.level)}>{r.level}</Badge>
                      <span className="text-sm font-semibold text-navy-800">{r.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-navy-800 mb-4 text-sm">Professional network</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-ink-600">Verified</span>
                  <span className="text-sm font-semibold text-navy-800">{data.professionals.verified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-600">Total registered</span>
                  <span className="text-sm font-semibold text-navy-800">{data.professionals.total}</span>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-navy-800 mb-4 text-sm">Referral status</h3>
                <div className="space-y-2">
                  {data.referralStatusBreakdown.length === 0 && (
                    <p className="text-sm text-ink-400">No referrals yet.</p>
                  )}
                  {data.referralStatusBreakdown.map((r) => (
                    <div key={r.status} className="flex items-center justify-between">
                      <span className="text-sm text-ink-600">{r.status}</span>
                      <span className="text-sm font-semibold text-navy-800">{r.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-navy-800 mb-4 text-sm">Appointment status</h3>
                <div className="space-y-2">
                  {data.appointmentStatusBreakdown.length === 0 && (
                    <p className="text-sm text-ink-400">No appointments yet.</p>
                  )}
                  {data.appointmentStatusBreakdown.map((r) => (
                    <div key={r.status} className="flex items-center justify-between">
                      <span className="text-sm text-ink-600">{r.status}</span>
                      <span className="text-sm font-semibold text-navy-800">{r.count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}