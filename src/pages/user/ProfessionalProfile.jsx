import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Languages, Briefcase, MapPin } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { professionals } from '../../data/mockData.js'
import { useAppState } from '../../data/AppState.jsx'

export default function ProfessionalProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setSelectedProfessional } = useAppState()
  const professional = professionals.find((p) => p.id === id)

  if (!professional) {
    return (
      <div className="p-8">
        <p className="text-ink-500">Professional not found.</p>
        <Link to="/app/find-a-professional" className="text-teal-600 font-semibold">
          Back to directory
        </Link>
      </div>
    )
  }

  const handleBook = () => {
    setSelectedProfessional(professional)
    navigate('/app/book')
  }

  return (
    <div>
      <PageHeader eyebrow="Professional profile" title={professional.name} subtitle={professional.type} />

      <div className="p-8 grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Badge tone="teal">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified professional
              </Badge>
            </div>
            <h3 className="font-semibold text-navy-800 mb-2">Biography</h3>
            <p className="text-sm text-ink-600 mb-6 leading-relaxed">{professional.bio}</p>

            <h3 className="font-semibold text-navy-800 mb-2">Qualifications</h3>
            <ul className="text-sm text-ink-600 space-y-1 mb-6 list-disc list-inside">
              {professional.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>

            <h3 className="font-semibold text-navy-800 mb-2">Areas of focus</h3>
            <div className="flex flex-wrap gap-2">
              {professional.focus.map((f) => (
                <Badge key={f} tone="navy">{f}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-4">Available appointments</h3>
            <div className="grid grid-cols-2 gap-3">
              {professional.slots.map((slot) => (
                <div
                  key={slot}
                  className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-center text-navy-700"
                >
                  {slot}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2 text-ink-600">
                <Briefcase className="h-4 w-4 text-navy-500" /> {professional.experience} years experience
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <MapPin className="h-4 w-4 text-navy-500" /> {professional.location}
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Languages className="h-4 w-4 text-navy-500" /> {professional.languages.join(', ')}
              </div>
            </div>
            <div className="border-t border-ink-100 pt-4 mb-4">
              <p className="text-xs text-ink-500 mb-1">Consultation fee</p>
              <p className="text-2xl font-bold text-navy-800">
                KES {professional.fee.toLocaleString()}
              </p>
              <p className="text-xs text-ink-400">{professional.mode}</p>
            </div>
            <Button variant="accent" className="w-full" onClick={handleBook}>
              Book consultation
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
