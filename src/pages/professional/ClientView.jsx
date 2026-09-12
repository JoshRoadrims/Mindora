import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import LineChart from '../../components/LineChart.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { api } from '../../data/api.js'

const series = [
  { key: 'stress', name: 'Stress', color: '#d97757' },
  { key: 'mood', name: 'Mood', color: '#1f3868' },
  { key: 'sleep', name: 'Sleep', color: '#3fbea3' },
  { key: 'energy', name: 'Energy', color: '#7f9ac8' },
]
const domainMap = { stress: 'anxiety', mood: 'mood', sleep: 'sleep', energy: 'energy' }

function domainScore(checkIn, domain) {
  const answers = checkIn.answers.filter((a) => a.domain === domain)
  if (answers.length === 0) return 0
  const avg = answers.reduce((sum, a) => sum + a.value, 0) / answers.length
  return Math.round(100 - (avg / 3) * 100)
}

function shortDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function riskTone(level) {
  if (level === 'HIGH') return 'high'
  if (level === 'ACUTE') return 'acute'
  if (level === 'ELEVATED') return 'elevated'
  return 'low'
}

export default function ClientView() {
  const { userId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const load = () => {
    api
      .getClient(userId)
      .then(setData)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleAddNote = async () => {
    if (!noteDraft.trim()) return
    setSavingNote(true)
    try {
      await api.addClientNote(userId, noteDraft.trim())
      setNoteDraft('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingNote(false)
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600 text-sm mb-2">{error}</p>
        <Link to="/pro/clients" className="text-teal-600 font-semibold text-sm">
          Back to clients
        </Link>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center gap-2 text-ink-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading client...
      </div>
    )
  }

  const chartData = data.checkIns.map((c) => ({
    label: shortDate(c.completedAt),
    stress: domainScore(c, domainMap.stress),
    mood: domainScore(c, domainMap.mood),
    sleep: domainScore(c, domainMap.sleep),
    energy: domainScore(c, domainMap.energy),
  }))

  return (
    <div>
      <PageHeader eyebrow="Client" title={`Anonymous User #${userId.slice(0, 8)}`} />

      <div className="p-8 grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4">Wellbeing history</h3>
            {chartData.length >= 2 ? (
              <LineChart data={chartData} series={series} />
            ) : (
              <p className="text-sm text-ink-400">Not enough check-ins yet to show a trend.</p>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Assessments</h3>
            {data.checkIns.length === 0 && <p className="text-sm text-ink-400">No assessments yet.</p>}
            <ul className="space-y-2">
              {[...data.checkIns].reverse().map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between items-center text-sm border-b border-ink-100 last:border-0 pb-2 last:pb-0"
                >
                  <span className="text-ink-600">{new Date(c.completedAt).toLocaleDateString()}</span>
                  <Badge tone={riskTone(c.riskLevel)}>{c.riskLevel}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Appointments</h3>
            {data.appointments.length === 0 && (
              <p className="text-sm text-ink-400">No appointments with this client yet.</p>
            )}
            <div className="space-y-2">
              {data.appointments.map((a) => (
                <div key={a.id} className="flex justify-between text-sm">
                  <span className="text-navy-700">{new Date(a.scheduledFor).toLocaleString()}</span>
                  <Badge tone={a.status === 'SCHEDULED' ? 'teal' : 'neutral'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Clinical notes</h3>
            <div className="space-y-3 mb-4">
              {data.notes.length === 0 && (
                <p className="text-sm text-ink-400">No notes yet.</p>
              )}
              {data.notes.map((n) => (
                <div key={n.id} className="rounded-lg bg-ink-50 px-4 py-3">
                  <p className="text-sm text-navy-700">{n.content}</p>
                  <p className="text-xs text-ink-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Add a note visible only to you..."
              rows={3}
              className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none resize-none mb-3"
            />
            <Button variant="accent" onClick={handleAddNote} disabled={savingNote || !noteDraft.trim()}>
              {savingNote ? 'Saving...' : 'Add note'}
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Disclaimer>
            Mindora screening does not replace professional clinical assessment.
          </Disclaimer>
        </div>
      </div>
    </div>
  )
}