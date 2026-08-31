import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import { currentUser } from '../../data/mockData.js'

export default function Settings() {
  return (
    <div>
      <PageHeader eyebrow="Settings" title="Account settings" />
      <div className="p-8 max-w-xl space-y-4">
        <Card>
          <p className="text-xs text-ink-500 mb-1">Full name</p>
          <p className="font-medium text-navy-800 mb-4">{currentUser.fullName}</p>
          <p className="text-xs text-ink-500 mb-1">Privacy</p>
          <p className="text-sm text-ink-600">
            Your mental-health information is confidential and only shared with professionals you
            choose to consult.
          </p>
        </Card>
      </div>
    </div>
  )
}
