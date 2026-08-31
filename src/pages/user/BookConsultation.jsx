import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Video, MapPin } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function BookConsultation() {
  const { selectedProfessional, setBooking } = useAppState()
  const [slot, setSlot] = useState(selectedProfessional?.slots?.[0] ?? '')
  const [type, setType] = useState('Online')
  const [confirmed, setConfirmed] = useState(false)
  const navigate = useNavigate()

  if (!selectedProfessional) {
    navigate('/app/find-a-professional')
    return null
  }

  const handleConfirm = () => {
    setBooking({ professional: selectedProfessional, slot, type })
    setConfirmed(true)
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
              {selectedProfessional.name} • {slot} • {type}
            </p>
            <Button as="link" to="/app/wellbeing" variant="accent">
              Go to my wellbeing journey
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
          <p className="font-semibold text-navy-800">{selectedProfessional.name}</p>
          <p className="text-sm text-ink-500">{selectedProfessional.type}</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
            Available time slots
          </p>
          <div className="grid grid-cols-2 gap-3">
            {selectedProfessional.slots.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  slot === s
                    ? 'border-teal-400 bg-teal-50 text-navy-800 font-semibold'
                    : 'border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
            Consultation type
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('Online')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                type === 'Online'
                  ? 'border-teal-400 bg-teal-50 text-navy-800'
                  : 'border-ink-200 text-ink-600'
              }`}
            >
              <Video className="h-4 w-4" /> Online
            </button>
            <button
              onClick={() => setType('In-person')}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                type === 'In-person'
                  ? 'border-teal-400 bg-teal-50 text-navy-800'
                  : 'border-ink-200 text-ink-600'
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
              KES {selectedProfessional.fee.toLocaleString()}
            </p>
          </div>
          <Button variant="accent" onClick={handleConfirm}>
            Confirm booking
          </Button>
        </Card>
      </div>
    </div>
  )
}
