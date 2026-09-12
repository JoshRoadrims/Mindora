import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Video, MapPin, Loader2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'
import { api } from '../../data/api.js'

// Sensible default: tomorrow at 10:00, formatted for a datetime-local input.
function defaultDateTime() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(10, 0, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function BookConsultation() {
  const { selectedProfessional } = useAppState()
  const navigate = useNavigate()
  const [dateTime, setDateTime] = useState(defaultDateTime())
  const [type, setType] = useState('ONLINE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [confirmed, setConfirmed] = useState(null)

  if (!selectedProfessional) {
    navigate('/app/find-a-professional')
    return null
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const appointment = await api.bookAppointment({
        professionalId: selectedProfessional.id,
        scheduledFor: new Date(dateTime).toISOString(),
        type,
      })
      setConfirmed(appointment)
    } catch (err) {
      setError(err.message || 'Could not book this appointment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div>
        <PageHeader eyebrow="Booking confirmed" title="You're all set" />
        <div className="p-8 max-w-xl mx-auto">
          <Card className="text-center py-10">
            <div className="mx-auto h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-navy-800 mb-2">Consultation booked</h2>
            <p className="text-sm text-ink-500 mb-6">
              {selectedProfessional.fullName} •{' '}
              {new Date(confirmed.scheduledFor).toLocaleString()} • {confirmed.type}
            </p>
            <Button as="link" to="/app/appointments" variant="accent">
              View my appointments
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Booking" title="Book your consultation" />
      <div className="p-8 max-w-xl mx-auto space-y-6">
        <Card>
          <p className="text-xs text-ink-500 mb-1">Professional</p>
          <p className="font-semibold text-navy-800">{selectedProfessional.fullName}</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
            Date and time
          </p>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
            Consultation type
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('ONLINE')}
              disabled={!selectedProfessional.onlineAvailable}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                type === 'ONLINE' ? 'border-teal-400 bg-teal-50 text-navy-800' : 'border-ink-200 text-ink-600'
              }`}
            >
              <Video className="h-4 w-4" /> Online
            </button>
            <button
              onClick={() => setType('IN_PERSON')}
              disabled={!selectedProfessional.inPersonAvailable}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                type === 'IN_PERSON' ? 'border-teal-400 bg-teal-50 text-navy-800' : 'border-ink-200 text-ink-600'
              }`}
            >
              <MapPin className="h-4 w-4" /> In-person
            </button>
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-500">Consultation fee</p>
            <p className="text-xl font-bold text-navy-800">
              {selectedProfessional.feeKes ? `KES ${selectedProfessional.feeKes.toLocaleString()}` : 'Not listed'}
            </p>
          </div>
          <Button variant="accent" onClick={handleConfirm} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm booking'}
          </Button>
        </Card>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  )
}