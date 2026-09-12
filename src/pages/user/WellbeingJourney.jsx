import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LineChart from '../../components/LineChart.jsx'
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
  if (answers.length === 0) return null
  const avg = answers.reduce((sum, a) => sum + a.value, 0) / answers.length
  return Math.round(100 - (avg / 3) * 100)
}

function shortDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function WellbeingJourney() {
  const [history, setHistory] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getCheckInHistory()
      .then((data) => !cancelled && setHistory(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  const chartData =
    history?.map((c) => ({
      label: shortDate(c.completedAt),
      stress: domainScore(c, domainMap.stress) ?? 0,
      mood: domainScore(c, domainMap.mood) ?? 0,
      sleep: domainScore(c, domainMap.sleep) ?? 0,
      energy: domainScore(c, domainMap.energy) ?? 0,
    })) ?? []

  const recentChanges = []
  if (chartData.length >= 2) {
    const latest = chartData[chartData.length - 1]
    const previous = chartData[chartData.length - 2]
    series.forEach((s) => {
      const delta = latest[s.key] - previous[s.key]
      if (Math.abs(delta) < 5) {
        recentChanges.push({ key: s.key, text: `${s.name} remains an area to monitor`, tone: 'amber' })
      } else if (delta > 0) {
        recentChanges.push({ key: s.key, text: `${s.name} has improved`, tone: 'teal' })
      } else {
        recentChanges.push({ key: s.key, text: `${s.name} has declined`, tone: 'amber' })
      }
    })
  }

  return (
    <div>
      <PageHeader eyebrow="My wellbeing" title="Your wellbeing journey" />

      <div className="p-8 space-y-6 max-w-4xl">
        {error && <Card className="text-sm text-red-600">Couldn't load your history: {error}</Card>}

        {history === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your wellbeing history...
          </Card>
        )}

        {history !== null && history.length < 2 && !error && (
          <Card className="text-sm text-ink-500">
            Complete at least two check-ins to see trends over time. You have {history.length} so far.
          </Card>
        )}

        {chartData.length >= 2 && (
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4">
              Trends across your last {chartData.length} check-ins
            </h3>
            <LineChart data={chartData} series={series} />
          </Card>
        )}

        {chartData.length >= 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-navy-800 mb-3">Recent changes</h3>
              <ul className="space-y-2 text-sm">
                {recentChanges.map((c) => (
                  <li
                    key={c.key}
                    className={`flex items-center gap-2 ${
                      c.tone === 'teal' ? 'text-teal-700' : 'text-amber-700'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        c.tone === 'teal' ? 'bg-teal-500' : 'bg-amber-500'
                      }`}
                    />
                    {c.text}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-navy-800 mb-1">Keep the streak going</h3>
                <p className="text-sm text-ink-500 mb-4">
                  Regular check-ins are what make these trends meaningful.
                </p>
              </div>
              <Button as="link" to="/app/check-in" variant="accent" className="self-start">
                Complete check-in
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}