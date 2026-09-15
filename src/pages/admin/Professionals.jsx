import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const specialtyLabels = {
  PSYCHOLOGIST: 'Psychologist',
  CLINICAL_PSYCHOLOGIST: 'Clinical Psychologist',
  PSYCHIATRIST: 'Psychiatrist',
}

export default function Professionals() {
  const [professionals, setProfessionals] = useState(null)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    api
      .adminListProfessionals()
      .then(setProfessionals)
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  const handleToggle = async (professional) => {
    setUpdatingId(professional.id)
    try {
      await api.adminSetProfessionalVerified(professional.id, !professional.verified)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Professional network"
        title="Manage professionals"
        subtitle="Verified professionals are visible in the patient-facing directory and can receive referrals. Unverified ones are hidden until reviewed."
      />

      <div className="p-8 space-y-3 max-w-4xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {professionals === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading professionals...
          </Card>
        )}

        {professionals?.map((p) => (
          <Card key={p.id} className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-navy-800">{p.fullName}</p>
                <Badge tone={p.verified ? 'teal' : 'neutral'}>
                  {p.verified ? 'Verified' : 'Pending review'}
                </Badge>
              </div>
              <p className="text-sm text-ink-500">{specialtyLabels[p.type] ?? p.type}</p>
              <p className="text-xs text-ink-400 mt-1">{p.email}</p>
            </div>
            <Button
              variant={p.verified ? 'secondary' : 'accent'}
              onClick={() => handleToggle(p)}
              disabled={updatingId === p.id}
            >
              {updatingId === p.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : p.verified ? (
                <>
                  <ShieldOff className="h-4 w-4" /> Unverify
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Verify
                </>
              )}
            </Button>
          </Card>
        ))}

        {professionals && professionals.length === 0 && (
          <Card className="text-center text-ink-400 py-12 text-sm">
            No professionals have registered yet.
          </Card>
        )}
      </div>
    </div>
  )
}