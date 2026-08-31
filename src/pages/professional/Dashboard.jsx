import { Link } from 'react-router-dom'
import { ArrowRight, Users, Inbox, CalendarClock, Repeat } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { referrals } from '../../data/mockData.js'

const stats = [
  { label: 'Active clients', value: 28, icon: Users },
  { label: 'New referrals', value: referrals.length, icon: Inbox },
  { label: 'Upcoming consultations', value: 6, icon: CalendarClock },
  { label: 'Follow-ups due', value: 4, icon: Repeat },
]

export default function ProfessionalDashboard() {
  return (
    <div>
      <PageHeader eyebrow="Dashboard" title="Good morning, Dr. Sarah." />

      <div className="p-8 space-y-6 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <s.icon className="h-4 w-4 text-navy-500 mb-2" />
              <p className="text-2xl font-bold text-navy-800">{s.value}</p>
              <p className="text-xs text-ink-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-bold text-navy-800 mb-3">Referral alerts</h3>
          <div className="space-y-3">
            {referrals.map((r) => (
              <Card key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-navy-800">New Mindora referral</p>
                    <Badge tone={r.riskLevel === 'High' ? 'high' : 'elevated'}>
                      {r.riskLevel.toUpperCase()} SCREENING RESULT
                    </Badge>
                  </div>
                  <p className="text-sm text-ink-500 mb-1">{r.label} • Referred for professional assessment</p>
                  <p className="text-xs text-ink-400">{r.reason}</p>
                </div>
                <Link
                  to={`/pro/referrals/${r.id}`}
                  className="inline-flex items-center gap-1 text-teal-600 text-sm font-semibold shrink-0"
                >
                  Review referral <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
