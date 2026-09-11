import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, TrendingDown, TrendingUp, Sparkles, Stethoscope, BookOpen } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'
import { api } from '../../data/api.js'

// Wellbeing "score" is the inverse of the risk ratio the backend computed:
// a lower answered-severity total means a higher score out of 100.
function toScore(checkIn) {
  if (!checkIn.maxScore) return null
  return Math.round(100 - (checkIn.totalScore / checkIn.maxScore) * 100)
}

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function Dashboard() {
  const { authUser } = useAppState()
  const firstName = authUser?.fullName?.split(' ')[0] ?? 'there'

  const [history, setHistory] = useState(null) // null = loading, [] = loaded but empty
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

  const latest = history && history.length > 0 ? history[history.length - 1] : null
  const previous = history && history.length > 1 ? history[history.length - 2] : null
  const currentScore = latest ? toScore(latest) : null
  const previousScore = previous ? toScore(previous) : null
  const scoreChange = currentScore !== null && previousScore !== null ? currentScore - previousScore : null

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={`Good morning, ${firstName}.`}
        subtitle="How are you feeling today?"
      />

      <div className="p-8 space-y-6 max-w-5xl">
        <div className="rounded-2xl bg-mindora-gradient text-white p-8 flex items-center justify-between shadow-lift">
          <div>
            <p className="text-teal-200 text-sm font-semibold mb-2">Today's check-in</p>
            <h2 className="text-2xl font-bold mb-2">Start today's wellbeing check-in</h2>
            <p className="text-navy-100 max-w-md text-sm">
              Two minutes, ten questions. Helps Mindora understand how you're really doing.
            </p>
          </div>
          <Button as="link" to="/app/check-in" variant="accent" className="shrink-0">
            Start check-in <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-navy-800 mb-3">Your wellbeing</h3>

          {error && (
            <Card className="text-sm text-red-600 mb-4">Couldn't load your check-in history: {error}</Card>
          )}

          {history !== null && history.length === 0 && !error && (
            <Card className="text-sm text-ink-500 mb-4">
              No check-ins yet — complete your first one to start tracking your wellbeing here.
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <p className="text-xs text-ink-500 mb-1">Current score</p>
              <p className="text-3xl font-bold text-navy-800">{currentScore ?? '—'}</p>
              <p className="text-xs text-ink-400 mt-1">out of 100</p>
            </Card>
            <Card>
              <p className="text-xs text-ink-500 mb-1">Recent change</p>
              {scoreChange === null ? (
                <p className="text-3xl font-bold text-ink-300">—</p>
              ) : (
                <p
                  className={`text-3xl font-bold flex items-center gap-1 ${
                    scoreChange >= 0 ? 'text-teal-600' : 'text-amber-600'
                  }`}
                >
                  {scoreChange >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  {Math.abs(scoreChange)}
                </p>
              )}
              <p className="text-xs text-ink-400 mt-1">vs. previous check-in</p>
            </Card>
            <Card>
              <p className="text-xs text-ink-500 mb-1">Last assessment</p>
              <p className="text-xl font-bold text-navy-800">
                {latest ? relativeTime(latest.completedAt) : '—'}
              </p>
            </Card>
            <Card>
              <p className="text-xs text-ink-500 mb-1">Check-ins completed</p>
              <p className="text-3xl font-bold text-navy-800 flex items-center gap-1">
                <Flame className="h-5 w-5 text-teal-500" /> {history?.length ?? '—'}
              </p>
              <p className="text-xs text-ink-400 mt-1">total, all time</p>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-navy-800 mb-3">Recommended for you</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="flex flex-col justify-between">
              <div>
                <p className="font-semibold text-navy-800 mb-1">Complete your weekly assessment</p>
                <p className="text-sm text-ink-500 mb-4">Stay on top of changes in your wellbeing.</p>
              </div>
              <Link to="/app/check-in" className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Start now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
            <Card className="flex flex-col justify-between">
              <div>
                <Stethoscope className="h-5 w-5 text-navy-600 mb-2" />
                <p className="font-semibold text-navy-800 mb-1">Speak with a professional</p>
                <p className="text-sm text-ink-500 mb-4">Browse psychologists and psychiatrists near you.</p>
              </div>
              <Link to="/app/find-a-professional" className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Find a professional <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
            <Card className="flex flex-col justify-between">
              <div>
                <BookOpen className="h-5 w-5 text-navy-600 mb-2" />
                <p className="font-semibold text-navy-800 mb-1">Explore stress-management resources</p>
                <p className="text-sm text-ink-500 mb-4">Short guides for managing everyday stress.</p>
              </div>
              <Link to="/app/resources" className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                Browse resources <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>
        </div>

        <Card className="flex items-start gap-4 bg-navy-50/50 border-navy-100">
          <div className="h-10 w-10 rounded-lg bg-navy-800 text-white flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-navy-800 mb-1">Mindora AI</p>
            <p className="text-sm text-ink-600 mb-1">
              "I can help you understand your wellbeing and guide you toward appropriate support."
            </p>
            <p className="text-xs text-ink-400 mb-3">
              AI support — not a replacement for professional care.
            </p>
            <Link to="/app/mindora-ai" className="text-teal-600 text-sm font-semibold">
              Talk to Mindora AI →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}