import { useParams, useNavigate, Link } from 'react-router-dom'
import { Flag } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { referrals } from '../../data/mockData.js'

export default function ReferralDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const referral = referrals.find((r) => r.id === id)

  if (!referral) {
    return (
      <div className="p-8">
        <p className="text-ink-500">Referral not found.</p>
        <Link to="/pro" className="text-teal-600 font-semibold">Back to dashboard</Link>
      </div>
    )
  }

  const tone = referral.riskLevel === 'High' ? 'high' : referral.riskLevel === 'Acute' ? 'acute' : 'elevated'

  return (
    <div>
      <PageHeader eyebrow="Referral" title="Referral summary" subtitle={`User: Anonymous User #${referral.id}`} />

      <div className="p-8 grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-800">Screening summary</h3>
              <Badge tone={tone}>{referral.riskLevel.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(referral.summary).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-ink-50 px-4 py-3">
                  <p className="text-xs text-ink-500 capitalize mb-1">{k}</p>
                  <p className="text-sm font-semibold text-navy-800">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-2">Referral reason</h3>
            <p className="text-sm text-ink-600">{referral.reason}</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Assessment history</h3>
            <ul className="space-y-2">
              {referral.history.map((h, i) => (
                <li key={i} className="flex justify-between text-sm border-b border-ink-100 last:border-0 pb-2 last:pb-0">
                  <span className="text-ink-600">{h.note}</span>
                  <span className="text-ink-400 shrink-0 ml-4">{h.date}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
              <Flag className="h-4 w-4 text-amber-500" /> Risk flags
            </h3>
            <ul className="text-sm text-ink-600 space-y-1 list-disc list-inside">
              {referral.flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Card>

          <Disclaimer>
            Mindora screening does not replace professional clinical assessment. Only necessary
            information is shared to protect user privacy.
          </Disclaimer>
        </div>

        <div>
          <Card className="space-y-3">
            <Button
              variant="accent"
              className="w-full"
              onClick={() => navigate('/pro/clients')}
            >
              Accept referral
            </Button>
            <Button variant="secondary" className="w-full">
              Request more information
            </Button>
            <Button variant="ghost" className="w-full text-red-600">
              Escalate for clinical review
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
