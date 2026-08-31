import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'

export default function Settings() {
  return (
    <div>
      <PageHeader eyebrow="Settings" title="Professional account settings" />
      <div className="p-8 max-w-xl">
        <Card>
          <p className="text-xs text-ink-500 mb-1">Verification status</p>
          <p className="font-medium text-navy-800 mb-4">Verified professional</p>
          <p className="text-xs text-ink-500 mb-1">Data handling</p>
          <p className="text-sm text-ink-600">
            Client information is confidential and access-controlled in line with clinical data
            governance standards.
          </p>
        </Card>
      </div>
    </div>
  )
}
