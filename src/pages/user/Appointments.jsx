import { useEffect, useState } from 'react'
import { Loader2, Video, MapPin, Star } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const JOIN_WINDOW_BEFORE_MS = 10 * 60 * 1000
const JOIN_WINDOW_AFTER_MS = 60 * 60 * 1000

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function canJoin(a) {
  if (a.status !== 'SCHEDULED' || a.type !== 'ONLINE' || !a.meetingUrl) return false
  const start = new Date(a.scheduledFor).getTime()
  const now = Date.now()
  return now >= start - JOIN_WINDOW_BEFORE_MS && now <= start + JOIN_WINDOW_AFTER_MS
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
          <Star className={`h-6 w-6 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`} />
        </button>
      ))}
    </div>
  )
}

function ReviewSection({ appointmentId }) {
  const [existingReview, setExistingReview] = useState(undefined) // undefined = loading
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getMyReviewForAppointment(appointmentId)
      .then(setExistingReview)
      .catch(() => setExistingReview(null))
  }, [appointmentId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const review = await api.submitReview(appointmentId, rating, comment || undefined)
      setExistingReview(review)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (existingReview === undefined) return null

  if (existingReview) {
    return (
      <div className="pt-3 border-t border-ink-100">
        <p className="text-xs text-ink-500 mb-1">Your review</p>
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-4 w-4 ${n <= existingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`}
            />
          ))}
        </div>
        {existingReview.comment && <p className="text-sm text-ink-600">{existingReview.comment}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="pt-3 border-t border-ink-100 space-y-2">
      <p className="text-xs text-ink-500">Leave a review (shown anonymously)</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" variant="secondary" disabled={rating === 0 || submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit review'}
      </Button>
    </form>
  )
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getMyAppointments()
      .then((data) => !cancelled && setAppointments(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Appointments" title="Your appointments" />
      <div className="p-8 max-w-2xl space-y-4">
        {error && <Card className="text-sm text-red-600">Couldn't load appointments: {error}</Card>}

        {appointments === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your appointments...
          </Card>
        )}

        {appointments && appointments.length === 0 && (
          <Card className="text-center py-16 text-ink-500 text-sm">
            No appointments booked yet. Find a professional to get started.
          </Card>
        )}

        {appointments?.map((a) => (
          <Card key={a.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-navy-800">{a.professional.fullName}</p>
                <p className="text-sm text-ink-500 mt-1">{formatDateTime(a.scheduledFor)}</p>
                <p className="text-xs text-ink-400 flex items-center gap-1 mt-1">
                  {a.type === 'ONLINE' ? (
                    <Video className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  {a.type === 'ONLINE' ? 'Online' : 'In-person'} • KES {a.feeKes.toLocaleString()}
                </p>
              </div>
              <Badge tone={a.status === 'SCHEDULED' ? 'teal' : 'neutral'}>{a.status}</Badge>
            </div>

            {a.status === 'SCHEDULED' && a.type === 'ONLINE' && (
              <div className="pt-3 border-t border-ink-100">
                {canJoin(a) ? (
                  <Button as="a" href={a.meetingUrl} target="_blank" rel="noopener noreferrer" variant="accent">
                    <Video className="h-4 w-4" /> Join meeting
                  </Button>
                ) : (
                  <p className="text-xs text-ink-400">
                    Join link opens 10 minutes before your scheduled time.
                  </p>
                )}
              </div>
            )}

            {a.status === 'COMPLETED' && <ReviewSection appointmentId={a.id} />}
          </Card>
        ))}
      </div>
    </div>
  )
}