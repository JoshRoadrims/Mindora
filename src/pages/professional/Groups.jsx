import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Plus, Users, Flag, UserPlus } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const TOPICS = [
  ['ANXIETY', 'Anxiety'],
  ['DEPRESSION', 'Depression'],
  ['GRIEF', 'Grief'],
  ['STRESS', 'Stress'],
  ['RELATIONSHIPS', 'Relationships'],
  ['SUBSTANCE_USE', 'Substance use'],
  ['OTHER', 'Other'],
]

function CreateGroupForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('ANXIETY')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [maxMembers, setMaxMembers] = useState(12)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const group = await api.createGroup({
        title,
        topic,
        description,
        rules: rules || undefined,
        maxMembers: Number(maxMembers),
      })
      onCreated(group)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <h3 className="font-semibold text-navy-800 mb-4">New support group</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-navy-700 mb-1 block">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={80}
            className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-700 mb-1 block">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          >
            {TOPICS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-700 mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            maxLength={600}
            rows={3}
            placeholder="What members can expect from this group"
            className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-700 mb-1 block">
            Group guidelines <span className="text-ink-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            maxLength={1000}
            rows={2}
            placeholder={
              topic === 'SUBSTANCE_USE'
                ? 'Leave blank to use the default substance-use guidelines'
                : 'Any ground rules for this group'
            }
            className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-700 mb-1 block">Member limit (5–20)</label>
          <input
            type="number"
            min={5}
            max={20}
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-32 rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="accent" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create group'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function Groups() {
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const load = () => {
    api
      .listMyGroups()
      .then(setGroups)
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  return (
    <div>
      <PageHeader eyebrow="Support groups" title="Your support groups" />

      <div className="p-8 max-w-3xl space-y-4">
        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {!showCreate && (
          <Button variant="accent" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New group
          </Button>
        )}

        {showCreate && (
          <CreateGroupForm
            onCreated={(group) => {
              setShowCreate(false)
              setGroups((prev) => [{ ...group, pendingCount: 0, flaggedCount: 0, openReports: 0 }, ...(prev || [])])
            }}
            onCancel={() => setShowCreate(false)}
          />
        )}

        {groups === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your groups...
          </Card>
        )}

        {groups && groups.length === 0 && !showCreate && (
          <Card className="text-center py-16 text-ink-500 text-sm">
            You're not running any support groups yet.
          </Card>
        )}

        {groups?.map((group) => (
          <Link key={group.id} to={`/pro/groups/${group.id}`}>
            <Card className="hover:border-teal-300 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-navy-800">{group.title}</p>
                <Badge tone={group.status === 'ACTIVE' ? 'teal' : 'neutral'}>{group.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {group.memberCount}/{group.maxMembers}
                </span>
                {group.pendingCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-700">
                    <UserPlus className="h-3.5 w-3.5" /> {group.pendingCount} pending
                  </span>
                )}
                {(group.flaggedCount > 0 || group.openReports > 0) && (
                  <span className="flex items-center gap-1 text-red-600">
                    <Flag className="h-3.5 w-3.5" /> {group.flaggedCount + group.openReports} needs review
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}