import { useState } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

// The text below is a PLACEHOLDER structure, not binding legal language.
// A lawyer needs to review and finalize real terms before any real
// professional accepts this. What's real here is the mechanism: versioned
// acceptance, tracked with a timestamp, enforced on every professional
// route on the backend.
export default function AgreementAcceptance({ currentVersion, onAccepted }) {
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAccept = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await api.acceptAgreement()
      onAccepted()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mindora-soft p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-card p-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-6 w-6 text-teal-500" />
          <h1 className="text-xl font-bold text-navy-800">Mindora Professional Agreement</h1>
        </div>
        <p className="text-xs text-ink-400 mb-6">
          Version {currentVersion} — placeholder text pending legal review, not final terms.
        </p>

        <div className="max-h-80 overflow-y-auto rounded-xl border border-ink-200 p-4 text-sm text-ink-600 space-y-3 mb-6">
          <p>
            <strong>1. Scope of practice.</strong> You agree to provide services only within
            your verified qualifications and licensure, and to represent your credentials
            accurately at all times.
          </p>
          <p>
            <strong>2. Meetings on-platform only.</strong> All consultations with
            Mindora-referred patients must take place through Mindora's system-generated meeting
            links and within the scheduled time slot. Arranging meetings outside the platform, or
            outside the booked time, is a violation of this agreement.
          </p>
          <p>
            <strong>3. Confidentiality.</strong> You will keep all patient information,
            including screening results and clinical notes, confidential, and will not share
            patient contact information obtained through the platform for any purpose outside of
            scheduled care.
          </p>
          <p>
            <strong>4. Professional conduct.</strong> You will treat all patients with respect
            and provide care consistent with your profession's ethical standards.
          </p>
          <p>
            <strong>5. Consequences of violation.</strong> Mindora may suspend or revoke your
            verified status on the platform, removing you from the patient-facing directory, if
            you violate this agreement. Serious violations may be reported to the relevant
            licensing body.
          </p>
          <p>
            <strong>6. Updates to this agreement.</strong> Mindora may update these terms.
            Continued use of the platform after an update requires re-acceptance of the current
            version.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-ink-600">
            I have read and agree to the Mindora Professional Agreement, version {currentVersion}.
          </span>
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <Button variant="accent" onClick={handleAccept} disabled={!checked || submitting} className="w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept and continue'}
        </Button>
      </div>
    </div>
  )
}