import { useEffect, useState } from 'react'
import { Loader2, Building2, Plus } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const typeLabels = {
  EMPLOYER: 'Employer',
  UNIVERSITY: 'University',
  HEALTHCARE_PROVIDER: 'Healthcare provider',
  INSURER: 'Insurer',
  OTHER: 'Other',
}

function statusTone(status) {
  if (status === 'ACTIVE') return 'teal'
  if (status === 'INACTIVE') return 'neutral'
  return 'elevated' // PENDING
}

const emptyForm = { name: '', type: 'EMPLOYER', contactName: '', contactEmail: '', notes: '' }

export default function Institutions() {
  const [institutions, setInstitutions] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    api.adminListInstitutions().then(setInstitutions).catch((err) => setError(err.message))
  }

  useEffect(load, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form }
      if (!payload.contactEmail) delete payload.contactEmail
      if (!payload.contactName) delete payload.contactName
      if (!payload.notes) delete payload.notes
      await api.adminCreateInstitution(payload)
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await api.adminUpdateInstitution(id, { status })
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
        eyebrow="Institutions"
        title="Institutional partners"
        subtitle="Employers, universities, healthcare providers, and insurers. Currently a partner directory — no institution-linked user accounts exist yet, that's a product decision for once a real pilot is being designed."
      />

      <div className="p-8 space-y-6 max-w-4xl">
        <Card>
          <h3 className="font-semibold text-navy-800 mb-3">Add institution</h3>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Institution name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none md:col-span-2"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              placeholder="Contact name (optional)"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            />
            <input
              placeholder="Contact email (optional)"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            />
            <input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            />
            <Button type="submit" variant="accent" disabled={submitting} className="md:col-span-2 self-start">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add institution
            </Button>
          </form>
        </Card>

        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {institutions === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading institutions...
          </Card>
        )}

        <div className="space-y-3">
          {institutions?.map((inst) => (
            <Card key={inst.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-navy-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-navy-800">{inst.name}</p>
                    <Badge tone={statusTone(inst.status)}>{inst.status}</Badge>
                  </div>
                  <p className="text-sm text-ink-500">{typeLabels[inst.type] ?? inst.type}</p>
                  {(inst.contactName || inst.contactEmail) && (
                    <p className="text-xs text-ink-400 mt-1">
                      {[inst.contactName, inst.contactEmail].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {inst.status !== 'ACTIVE' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange(inst.id, 'ACTIVE')}
                    disabled={updatingId === inst.id}
                  >
                    Activate
                  </Button>
                )}
                {inst.status !== 'INACTIVE' && (
                  <Button
                    variant="ghost"
                    className="text-ink-500"
                    onClick={() => handleStatusChange(inst.id, 'INACTIVE')}
                    disabled={updatingId === inst.id}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {institutions && institutions.length === 0 && (
            <Card className="text-center text-ink-400 py-12 text-sm">
              No institutional partners yet.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}