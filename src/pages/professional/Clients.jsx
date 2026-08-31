import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'

const clients = [
  { id: 'MND-10482', label: 'Active client', status: 'low' },
  { id: 'MND-10203', label: 'Active client', status: 'low' },
  { id: 'MND-10099', label: 'Active client', status: 'elevated' },
]

export default function Clients() {
  return (
    <div>
      <PageHeader eyebrow="Caseload" title="Your clients" />
      <div className="p-8 space-y-3 max-w-3xl">
        {clients.map((c) => (
          <Card key={c.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-navy-800">Anonymous User #{c.id}</p>
              <p className="text-sm text-ink-500">{c.label}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge tone={c.status}>{c.status === 'low' ? 'Stable' : 'Elevated'}</Badge>
              <Link to="/pro/clients/view" className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
