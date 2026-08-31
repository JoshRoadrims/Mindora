import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'

export default function Settings() {
  return (
    <div>
      <PageHeader eyebrow="Settings" title="Platform settings" />
      <div className="p-8 max-w-xl">
        <Card>
          <p className="text-xs text-ink-500 mb-1">Access level</p>
          <p className="font-medium text-navy-800 mb-4">Mindora internal team</p>
          <p className="text-xs text-ink-500 mb-1">Data governance</p>
          <p className="text-sm text-ink-600">
            All access to identifiable mental-health data is logged and restricted to authorised,
            role-based personnel.
          </p>
        </Card>
      </div>
    </div>
  )
}
