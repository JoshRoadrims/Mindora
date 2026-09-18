import { useEffect, useState } from 'react'
import { Upload, Loader2, FileText, Eye } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { api } from '../../data/api.js'

const docTypes = [
  { value: 'LICENSE', label: 'Professional license' },
  { value: 'GOVERNMENT_ID', label: 'Government-issued ID' },
  { value: 'DEGREE_CERTIFICATE', label: 'Degree certificate' },
  { value: 'OTHER', label: 'Other supporting document' },
]

function statusTone(status) {
  if (status === 'APPROVED') return 'teal'
  if (status === 'REJECTED') return 'acute'
  return 'elevated' // PENDING
}

export default function Settings() {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('LICENSE')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [viewingId, setViewingId] = useState(null)

  const load = () => {
    api
      .getMyDocuments()
      .then(setDocuments)
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      await api.uploadDocument(selectedType, file)
      setFile(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleView = async (id) => {
    setViewingId(id)
    try {
      const blob = await api.getDocumentFileBlob(id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err.message)
    } finally {
      setViewingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Verification documents"
        subtitle="Upload your credentials for review. Approval is required before your profile is visible to patients."
      />

      <div className="p-8 max-w-2xl space-y-6">
        <Disclaimer>
          Files are limited to PDF, JPG, or PNG, up to 10 MB. Documents are reviewed by the
          Mindora platform team — approval can take a few business days.
        </Disclaimer>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-3">Upload a document</h3>
          <div className="space-y-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            >
              {docTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-ink-600 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy-700"
            />
            <Button variant="accent" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload
            </Button>
          </div>
        </Card>

        {error && <Card className="text-sm text-red-600">{error}</Card>}

        <Card>
          <h3 className="font-semibold text-navy-800 mb-3">Your documents</h3>

          {documents === null && !error && (
            <p className="text-sm text-ink-500 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </p>
          )}

          {documents && documents.length === 0 && (
            <p className="text-sm text-ink-400">No documents uploaded yet.</p>
          )}

          <div className="space-y-3">
            {documents?.map((d) => (
              <div key={d.id} className="flex items-center justify-between border-b border-ink-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-navy-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">
                      {docTypes.find((t) => t.value === d.type)?.label ?? d.type}
                    </p>
                    <p className="text-xs text-ink-400">{d.fileName}</p>
                    {d.status === 'REJECTED' && d.reviewNotes && (
                      <p className="text-xs text-red-600 mt-1">Reason: {d.reviewNotes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                  <button
                    onClick={() => handleView(d.id)}
                    disabled={viewingId === d.id}
                    className="text-teal-600 hover:text-teal-700"
                    aria-label="View document"
                  >
                    {viewingId === d.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}