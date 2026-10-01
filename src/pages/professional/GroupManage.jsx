import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, Send, Check, X, UserMinus, EyeOff, Eye, ShieldCheck, Flag } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const THREAD_POLL_MS = 5000

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function RosterTab({ groupId }) {
  const [roster, setRoster] = useState(null)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    api
      .getGroupRoster(groupId)
      .then(setRoster)
      .catch((err) => setError(err.message))
  }, [groupId])

  useEffect(load, [load])

  const act = async (membershipId, action) => {
    setBusyId(membershipId)
    try {
      if (action === 'approve') await api.approveGroupMember(groupId, membershipId)
      if (action === 'decline') await api.declineGroupMember(groupId, membershipId)
      if (action === 'remove') await api.removeGroupMember(groupId, membershipId)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!roster) {
    return (
      <div className="flex items-center gap-2 text-ink-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading roster...
      </div>
    )
  }

  const pending = roster.filter((m) => m.status === 'PENDING')
  const active = roster.filter((m) => m.status === 'ACTIVE')

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-navy-800 mb-2">Pending requests</h3>
          <div className="space-y-2">
            {pending.map((m) => (
              <Card key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-navy-800">{m.realName}</p>
                  <p className="text-xs text-ink-400">will appear as "{m.pseudonym}"</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => act(m.id, 'approve')}
                    disabled={busyId === m.id}
                    className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => act(m.id, 'decline')}
                    disabled={busyId === m.id}
                    className="p-2 rounded-lg bg-ink-50 text-ink-500 hover:bg-ink-100"
                    aria-label="Decline"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-navy-800 mb-2">Members ({active.length})</h3>
        {active.length === 0 && <p className="text-xs text-ink-400">No active members yet.</p>}
        <div className="space-y-2">
          {active.map((m) => (
            <Card key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-navy-800">
                  {m.realName} <span className="text-ink-400 font-normal">· {m.pseudonym}</span>
                </p>
                <p className="text-xs text-ink-400">Joined {formatTime(m.joinedAt)}</p>
              </div>
              <button
                onClick={() => act(m.id, 'remove')}
                disabled={busyId === m.id}
                className="p-2 rounded-lg bg-ink-50 text-ink-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove"
              >
                <UserMinus className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatTab({ groupId }) {
  const [messages, setMessages] = useState(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  const load = useCallback(() => {
    api
      .getGroupMessages(groupId)
      .then(setMessages)
      .catch((err) => setError(err.message))
  }, [groupId])

  useEffect(() => {
    load()
    const interval = setInterval(load, THREAD_POLL_MS)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setDraft('')
    try {
      await api.sendGroupMessage(groupId, text)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const toggleHide = async (message) => {
    try {
      if (message.hidden) await api.unhideGroupMessage(groupId, message.id)
      else await api.hideGroupMessage(groupId, message.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const clearFlag = async (message) => {
    try {
      await api.clearGroupMessageFlag(groupId, message.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Card className="p-0 flex flex-col h-[520px] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {messages === null && (
          <div className="flex items-center gap-2 text-ink-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        )}
        {messages?.map((m) => (
          <div key={m.id} className={`flex ${m.isFacilitator ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]">
              <div
                className={`rounded-2xl px-4 py-2 text-sm ${
                  m.isFacilitator ? 'bg-teal-600 text-white' : 'bg-ink-100 text-navy-800'
                } ${m.flagged ? 'ring-2 ring-red-300' : ''}`}
              >
                {!m.isFacilitator && (
                  <p className="text-[11px] opacity-70 mb-0.5 font-medium">
                    {m.authorRealName} · {m.authorLabel}
                  </p>
                )}
                {m.hidden ? <p className="italic opacity-70">Hidden</p> : m.content}
                <p className="text-[10px] opacity-60 mt-1">{formatTime(m.createdAt)}</p>
              </div>
              {!m.isFacilitator && (
                <div className="flex items-center gap-3 mt-1">
                  {m.flagged && (
                    <span className="text-[11px] text-red-600 flex items-center gap-1">
                      <Flag className="h-3 w-3" /> Flagged
                    </span>
                  )}
                  {m.openReports > 0 && (
                    <span className="text-[11px] text-amber-700">{m.openReports} report(s)</span>
                  )}
                  <button
                    onClick={() => toggleHide(m)}
                    className="text-[11px] text-ink-400 hover:text-navy-700 flex items-center gap-1"
                  >
                    {m.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {m.hidden ? 'Unhide' : 'Hide'}
                  </button>
                  {m.flagged && (
                    <button
                      onClick={() => clearFlag(m)}
                      className="text-[11px] text-ink-400 hover:text-teal-700 flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3 w-3" /> Clear flag
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-ink-100 p-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Post as facilitator..."
          className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
        />
        <Button type="submit" variant="accent" disabled={!draft.trim() || sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  )
}

function ReportsTab({ groupId }) {
  const [reports, setReports] = useState(null)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    api
      .getGroupReports(groupId)
      .then(setReports)
      .catch((err) => setError(err.message))
  }, [groupId])

  useEffect(load, [load])

  const resolve = async (reportId) => {
    setBusyId(reportId)
    try {
      await api.resolveGroupReport(reportId)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const hide = async (report) => {
    setBusyId(report.id)
    try {
      await api.hideGroupMessage(groupId, report.message.id)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!reports) {
    return (
      <div className="flex items-center gap-2 text-ink-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading reports...
      </div>
    )
  }
  if (reports.length === 0) {
    return <p className="text-sm text-ink-400">No open reports.</p>
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <Card key={r.id}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-ink-400">
              Reported by {r.reporterPseudonym} · {formatTime(r.createdAt)}
            </p>
            <Badge tone="navy">{r.message.authorRealName}</Badge>
          </div>
          {r.reason && <p className="text-xs text-ink-600 mb-2 italic">"{r.reason}"</p>}
          <div className="bg-ink-50 rounded-lg p-3 text-sm text-navy-800 mb-3">
            {r.message.hidden ? <span className="italic text-ink-400">Already hidden</span> : r.message.content}
          </div>
          <div className="flex gap-2">
            {!r.message.hidden && (
              <Button variant="secondary" className="!text-xs !py-1.5" onClick={() => hide(r)} disabled={busyId === r.id}>
                Hide message
              </Button>
            )}
            <Button variant="secondary" className="!text-xs !py-1.5" onClick={() => resolve(r.id)} disabled={busyId === r.id}>
              {busyId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Mark resolved'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function GroupManage() {
  const { groupId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('roster')
  const [togglingStatus, setTogglingStatus] = useState(false)

  const loadGroup = useCallback(() => {
    api
      .getGroup(groupId)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [groupId])

  useEffect(loadGroup, [loadGroup])

  const toggleStatus = async () => {
    if (!data) return
    const nextStatus = data.group.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    setTogglingStatus(true)
    try {
      await api.updateGroup(groupId, { status: nextStatus })
      loadGroup()
    } catch (err) {
      setError(err.message)
    } finally {
      setTogglingStatus(false)
    }
  }

  if (error && !data) return <div className="p-8 text-sm text-red-600">{error}</div>
  if (!data) {
    return (
      <div className="p-8 flex items-center gap-2 text-ink-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading group...
      </div>
    )
  }

  const { group } = data

  return (
    <div>
      <PageHeader eyebrow="Support groups" title={group.title} subtitle={group.description} />

      <div className="p-8 max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/pro/groups" className="text-xs text-teal-600 font-semibold">
            ← All groups
          </Link>
          <div className="flex items-center gap-3">
            <Badge tone={group.status === 'ACTIVE' ? 'teal' : 'neutral'}>{group.status}</Badge>
            {group.status !== 'ARCHIVED' && (
              <button
                onClick={toggleStatus}
                disabled={togglingStatus}
                className="text-xs text-ink-500 hover:text-navy-700 underline"
              >
                {group.status === 'ACTIVE' ? 'Pause group' : 'Resume group'}
              </button>
            )}
          </div>
        </div>

        {error && <Card className="text-sm text-red-600">{error}</Card>}

        <div className="flex gap-1 rounded-xl border border-ink-200 p-1 bg-ink-50 w-fit">
          {[
            ['roster', 'Roster'],
            ['chat', 'Chat'],
            ['reports', 'Reports'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                tab === key ? 'bg-white shadow-soft text-navy-800' : 'text-ink-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'roster' && <RosterTab groupId={groupId} />}
        {tab === 'chat' && <ChatTab groupId={groupId} />}
        {tab === 'reports' && <ReportsTab groupId={groupId} />}
      </div>
    </div>
  )
}