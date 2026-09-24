import { useEffect, useState } from 'react'
import { Loader2, UserX, Check, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

function statusTone(status) {
  if (status === 'COMPLETED') return 'neutral'
  if (status === 'REJECTED') return 'acute'
  return 'elevated' // PENDING
}

export default function DeletionRequests() {
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  const load = () => {
    api.adminListDeletionRequests().then(setRequests).catch((err) => setError(err.message))
  }

  useEffect(load, [])

  const handleProcess = async (id, action) => {
    if (action === 'DELETE') {
      const confirmed = window.confirm(
        'This will permanently delete this account and their check-ins, referrals, and appointments. This cannot be undone. Continue?'
      )
      if (!confirmed) return
    }
    setProcessingId(id)
    try {
      await api.adminProcessDeletionRequest(id, action)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const pending = requests?.filter((r) => r.status === 'PENDING') ?? []
  const resolved = requests?.filter((r) => r.status !== 'PENDING') ?? []

  return (
    <div>
      <PageHeader
        eyebrow="Data governance"
        title="Account deletion requests"
        subtitle="Review each request before deleting. A patient's own clinical notes authored by a professional are retained even after deletion — see the note in the codebase for why."
      />

      <div className="p-8 space-y-8 max-w-3xl">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        <div>
          <h3 className="font-semibold text-navy-800 mb-3">
            Pending review {requests !== null && `(${pending.length})`}
          </h3>

          {requests === null && !error && (
            <Card className="flex items-center gap-2 text-ink-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </Card>
          )}

          {requests !== null && pending.length === 0 && (
            <Card className="text-sm text-ink-400 text-center py-8">No pending requests.</Card>
          )}

          <div className="space-y-3">
            {pending.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserX className="h-4 w-4 text-navy-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{r.email}</p>
                    <p className="text-xs text-ink-500 capitalize">{r.role} account</p>
                    {r.reason && <p className="text-xs text-ink-400 mt-1">"{r.reason}"</p>}
                    <p className="text-xs text-ink-400 mt-1">
                      Requested {new Date(r.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => handleProcess(r.id, 'DELETE')}
                    disabled={processingId === r.id}
                  >
                    <Check className="h-4 w-4" /> Delete account
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleProcess(r.id, 'REJECT')}
                    disabled={processingId === r.id}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {resolved.length > 0 && (
          <div>
            <h3 className="font-semibold text-navy-800 mb-3">Resolved</h3>
            <div className="space-y-3">
              {resolved.map((r) => (
                <Card key={r.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{r.email}</p>
                    <p className="text-xs text-ink-500 capitalize">{r.role} account</p>
                  </div>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}