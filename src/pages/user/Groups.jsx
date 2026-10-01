import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Users, MessageCircleHeart } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { api } from '../../data/api.js'

const TOPIC_LABELS = {
  ANXIETY: 'Anxiety',
  DEPRESSION: 'Depression',
  GRIEF: 'Grief',
  STRESS: 'Stress',
  RELATIONSHIPS: 'Relationships',
  SUBSTANCE_USE: 'Substance use',
  OTHER: 'Other',
}

function statusBadge(status) {
  if (status === 'ACTIVE') return <Badge tone="teal">You're a member</Badge>
  if (status === 'PENDING') return <Badge tone="navy">Request pending</Badge>
  return null
}

export default function Groups() {
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .listGroups()
      .then((data) => !cancelled && setGroups(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Support groups"
        title="Support groups"
        subtitle="Facilitated by verified professionals. Members are identified by a pseudonym, never your name."
      />

      <div className="p-4 md:p-8 max-w-3xl space-y-4">
        {error && <Card className="text-sm text-red-600">Couldn't load groups: {error}</Card>}

        {groups === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading groups...
          </Card>
        )}

        {groups && groups.length === 0 && (
          <Card className="text-center py-16 text-ink-500 text-sm">
            No support groups are open right now. Check back soon.
          </Card>
        )}

        {groups?.map((group) => (
          <Link key={group.id} to={`/app/groups/${group.id}`}>
            <Card className="hover:border-teal-300 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-navy-800">{group.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Facilitated by {group.facilitatorName}
                  </p>
                </div>
                <Badge tone="navy">{TOPIC_LABELS[group.topic] ?? group.topic}</Badge>
              </div>
              <p className="text-sm text-ink-600 mb-3 line-clamp-2">{group.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-400 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {group.memberCount}/{group.maxMembers} members
                </p>
                {statusBadge(group.myStatus)}
              </div>
            </Card>
          </Link>
        ))}

        <Card className="flex items-start gap-3 bg-teal-50/60 border-teal-100">
          <MessageCircleHeart className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-xs text-ink-600">
            Groups are for peer support, not emergency care. If you're in danger right now, call{' '}
            <strong>999</strong> or <strong>112</strong>.
          </p>
        </Card>
      </div>
    </div>
  )
}