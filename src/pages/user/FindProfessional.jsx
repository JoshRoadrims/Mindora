import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { professionals } from '../../data/mockData.js'

const specialties = ['Any', 'Psychologist', 'Clinical Psychologist', 'Psychiatrist']
const concerns = ['Any', 'Stress', 'Anxiety', 'Depression', 'Relationships', 'Substance use']
const availabilities = ['Any time', 'Today', 'This week']

export default function FindProfessional() {
  const [specialty, setSpecialty] = useState('Any')
  const [concern, setConcern] = useState('Any')
  const [availability, setAvailability] = useState('Any time')

  const filtered = useMemo(() => {
    return professionals.filter((p) => {
      if (specialty !== 'Any' && p.type !== specialty) return false
      if (concern !== 'Any' && !p.tags.includes(concern)) return false
      if (availability === 'Today' && !p.availability.toLowerCase().includes('today')) return false
      if (availability === 'This week' && p.availability.toLowerCase().includes('this week') === false && p.availability.toLowerCase().includes('today') === false && p.availability.toLowerCase().includes('tomorrow') === false) return false
      return true
    })
  }, [specialty, concern, availability])

  return (
    <div>
      <PageHeader eyebrow="Support network" title="Find the right professional" />

      <div className="p-8 flex gap-8">
        {/* Filters */}
        <aside className="w-64 shrink-0 space-y-6">
          <FilterGroup label="Specialty" options={specialties} value={specialty} onChange={setSpecialty} />
          <FilterGroup label="Concern" options={concerns} value={concern} onChange={setConcern} />
          <FilterGroup label="Availability" options={availabilities} value={availability} onChange={setAvailability} />
        </aside>

        {/* Results */}
        <div className="flex-1 space-y-4">
          <p className="text-sm text-ink-500">{filtered.length} professionals found</p>
          {filtered.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-xl bg-navy-800 text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {p.name.split(' ').map((n) => n[0]).slice(-2).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-navy-800">{p.name}</p>
                    {p.verified && <Badge tone="teal">Verified</Badge>}
                  </div>
                  <p className="text-sm text-ink-500 mb-1">{p.type}</p>
                  <p className="text-xs text-ink-400 mb-2">{p.tags.join(' • ')}</p>
                  <div className="flex items-center gap-4 text-xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {p.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {p.availability}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-navy-800 mb-1">KES {p.fee.toLocaleString()} / session</p>
                <p className="text-xs text-ink-400 mb-3">{p.mode}</p>
                <Link
                  to={`/app/find-a-professional/${p.id}`}
                  className="inline-flex items-center gap-1 text-teal-600 text-sm font-semibold"
                >
                  View profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="text-center text-ink-400 py-12">
              No professionals match these filters yet — try widening your search.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">{label}</p>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              value === opt ? 'bg-navy-800 text-white font-semibold' : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
