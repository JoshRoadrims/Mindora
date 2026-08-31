import { BookOpen } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'

const resources = [
  { title: 'Managing everyday stress', tag: 'Stress', minutes: 4 },
  { title: 'Building a wind-down routine for better sleep', tag: 'Sleep', minutes: 6 },
  { title: 'Recognising burnout early', tag: 'Burnout', minutes: 5 },
  { title: 'Talking to someone you trust about how you feel', tag: 'Social connection', minutes: 3 },
]

export default function Resources() {
  return (
    <div>
      <PageHeader eyebrow="Resources" title="Stress-management resources" />
      <div className="p-8 grid md:grid-cols-2 gap-4 max-w-4xl">
        {resources.map((r) => (
          <Card key={r.title} className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-navy-800 text-sm mb-1">{r.title}</p>
              <p className="text-xs text-ink-400">{r.tag} • {r.minutes} min read</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
