import { useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import LineChart from '../../components/LineChart.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { clientRecord } from '../../data/mockData.js'

const series = [
  { key: 'stress', name: 'Stress', color: '#d97757' },
  { key: 'mood', name: 'Mood', color: '#1f3868' },
  { key: 'sleep', name: 'Sleep', color: '#3fbea3' },
  { key: 'energy', name: 'Energy', color: '#7f9ac8' },
]

export default function ClientView() {
  const [notes, setNotes] = useState('')

  return (
    <div>
      <PageHeader
        eyebrow="Client"
        title={`Anonymous User #${clientRecord.id}`}
        subtitle={`Client since ${clientRecord.since}`}
      />

      <div className="p-8 grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4">Wellbeing history</h3>
            <LineChart data={clientRecord.wellbeingHistory} series={series} />
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Assessments</h3>
            <ul className="space-y-2">
              {clientRecord.assessments.map((a, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-ink-100 last:border-0 pb-2 last:pb-0">
                  <span className="text-ink-600">{a.date}</span>
                  <Badge tone={a.result.includes('Elevated') ? 'elevated' : 'low'}>{a.result}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Appointments</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500 mb-2">Upcoming</p>
                {clientRecord.appointments.upcoming.map((a, i) => (
                  <div key={i} className="text-sm text-navy-700 mb-1">{a.date} — {a.type}</div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500 mb-2">Past</p>
                {clientRecord.appointments.past.map((a, i) => (
                  <div key={i} className="text-sm text-ink-500 mb-1">{a.date} — {a.type}</div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Clinical notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Secure notes visible only to you and authorised clinical reviewers..."
              rows={5}
              className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none resize-none"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-xs text-ink-500 mb-1">Next scheduled check-in</p>
            <p className="font-semibold text-navy-800">{clientRecord.nextCheckIn}</p>
          </Card>
          <Disclaimer>
            Mindora screening does not replace professional clinical assessment.
          </Disclaimer>
        </div>
      </div>
    </div>
  )
}
