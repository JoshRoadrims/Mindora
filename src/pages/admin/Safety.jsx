import { ShieldAlert, Clock } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { safetyQueue } from '../../data/mockData.js'

const categories = [
  {
    key: 'lowConcern',
    title: 'LOW CONCERN',
    subtitle: 'Self-guided support',
    tone: 'low',
    count: safetyQueue.lowConcern,
  },
  {
    key: 'elevated',
    title: 'ELEVATED',
    subtitle: 'Professional referral',
    tone: 'elevated',
    count: safetyQueue.elevated,
  },
  {
    key: 'high',
    title: 'HIGH',
    subtitle: 'Prompt clinical assessment',
    tone: 'high',
    count: safetyQueue.high,
  },
  {
    key: 'acute',
    title: 'ACUTE',
    subtitle: 'Urgent / emergency pathway',
    tone: 'acute',
    count: safetyQueue.acute,
  },
]

export default function Safety() {
  return (
    <div>
      <PageHeader
        eyebrow="Clinical safety"
        title="Safety & escalation monitoring"
        subtitle="Restricted access. All entries are pseudonymised and reviewed by qualified clinical staff."
      />

      <div className="p-8 space-y-6 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Card key={c.key} className="border-l-4" style={{}}>
              <Badge tone={c.tone} className="mb-3">{c.title}</Badge>
              <p className="text-3xl font-bold text-navy-800">{c.count}</p>
              <p className="text-xs text-ink-500 mt-1">{c.subtitle}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" /> Alerts requiring professional review
          </h3>
          <div className="divide-y divide-ink-100">
            {safetyQueue.alerts.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      tone={
                        a.level === 'Acute' ? 'acute' : a.level === 'High' ? 'high' : 'elevated'
                      }
                    >
                      {a.level.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-semibold text-navy-800">#{a.id}</span>
                  </div>
                  <p className="text-sm text-ink-600">{a.note}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-400 shrink-0">
                  <Clock className="h-3.5 w-3.5" /> {a.time}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Disclaimer tone="urgent">
          This dashboard supports human clinical review and escalation — it does not perform
          autonomous diagnosis. All acute-pathway cases require sign-off from a qualified
          professional before action is taken.
        </Disclaimer>
      </div>
    </div>
  )
}
