import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, Send, ShieldAlert, Flag, LogOut, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const THREAD_POLL_MS = 5000

const TOPIC_LABELS = {
  ANXIETY: 'Anxiety',
  DEPRESSION: 'Depression',
  GRIEF: 'Grief',
  STRESS: 'Stress',
  RELATIONSHIPS: 'Relationships',
  SUBSTANCE_USE: 'Substance use',
  OTHER: 'Other',
}

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function CrisisBar({ substanceUse }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-900 flex items-start gap-2">
      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
      <p>
        If you're in danger right now, call <strong>999</strong> or <strong>112</strong>. Befrienders
        Kenya: <strong>+254 722 178 177</strong>. Kenya Red Cross: <strong>1199</strong>.
        {substanceUse && (
          <>
            {' '}
            NACADA (alcohol/drug support): <strong>1192</strong>.
          </>
        )}
      </p>
    </div>
  )
}

function CrisisModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-navy-900/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-card p-6 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-3 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="font-semibold">You're not alone</h3>
        </div>
        <p className="text-sm text-ink-600 mb-4">
          What you shared matters, and real support is available right now.
        </p>
        <ul className="text-sm text-ink-700 space-y-1 mb-5">
          <li>Emergency: <strong>999</strong> or <strong>112</strong></li>
          <li>Befrienders Kenya: <strong>+254 722 178 177</strong></li>
          <li>Kenya Red Cross: <strong>1199</strong> (toll-free, anytime)</li>
        </ul>
        <Button variant="accent" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

function ReportBox({ messageId, onDone }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await api.reportGroupMessage(messageId, reason || undefined)
      onDone()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-1 bg-ink-50 rounded-lg p-2 space-y-1.5">
      <textarea
        placeholder="Optional: why are you reporting this?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-ink-200 px-2 py-1 text-xs focus:border-teal-400 focus:ring-1 focus:ring-teal-100 outline-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button variant="secondary" className="!text-xs !py-1" onClick={submit} disabled={submitting}>
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Submit report'}
        </Button>
        <button onClick={() => onDone(false)} className="text-xs text-ink-400 hover:text-ink-600">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function GroupDetail() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [joining, setJoining] = useState(false)
  const [messages, setMessages] = useState(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [showCrisisModal, setShowCrisisModal] = useState(false)
  const [reportingId, setReportingId] = useState(null)
  const [reportedIds, setReportedIds] = useState(new Set())
  const bottomRef = useRef(null)

  const loadGroup = useCallback(() => {
    api
      .getGroup(groupId)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [groupId])

  const loadMessages = useCallback(() => {
    api
      .getGroupMessages(groupId)
      .then(setMessages)
      .catch((err) => setError(err.message))
  }, [groupId])

  useEffect(() => {
    loadGroup()
  }, [loadGroup])

  const isActive = data?.myMembership?.status === 'ACTIVE'

  useEffect(() => {
    if (!isActive) return
    loadMessages()
    const interval = setInterval(loadMessages, THREAD_POLL_MS)
    return () => clearInterval(interval)
  }, [isActive, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (error && !data) {
    return <div className="p-4 md:p-8 text-sm text-red-600">{error}</div>
  }

  if (!data) {
    return (
      <div className="p-4 md:p-8 flex items-center gap-2 text-ink-500 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading group...
      </div>
    )
  }

  const { group, myMembership } = data

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!ageConfirmed || !consentAccepted) return
    setJoining(true)
    setError(null)
    try {
      await api.joinGroup(groupId, true, true)
      loadGroup()
    } catch (err) {
      setError(err.message)
    } finally {
      setJoining(false)
    }
  }

  const handleLeaveOrCancel = async () => {
    try {
      await api.leaveGroup(groupId)
      navigate('/app/groups')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setDraft('')
    try {
      const result = await api.sendGroupMessage(groupId, text)
      if (result.crisis) setShowCrisisModal(true)
      loadMessages()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Support groups" title={group.title} subtitle={`Facilitated by ${group.facilitatorName}`} />

      <div className="p-4 md:p-8 max-w-2xl space-y-4">
        {showCrisisModal && <CrisisModal onClose={() => setShowCrisisModal(false)} />}

        {error && <Card className="text-sm text-red-600">{error}</Card>}

        {/* --- Not a member: show join / consent screen --- */}
        {!myMembership && (
          <Card>
            <Badge tone="navy">{TOPIC_LABELS[group.topic] ?? group.topic}</Badge>
            <p className="text-sm text-ink-600 mt-3 mb-4">{group.description}</p>
            {group.rules && (
              <div className="bg-ink-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-navy-700 mb-1">Group guidelines</p>
                <p className="text-xs text-ink-600 whitespace-pre-line">{group.rules}</p>
              </div>
            )}
            <form onSubmit={handleJoin} className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-ink-600">I confirm that I am 18 years of age or older.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-ink-600">
                  I understand this group is not emergency care, that I'll be known here only by a
                  pseudonym, and that while the facilitator asks everyone to keep what's shared private,
                  Mindora cannot guarantee that other members will.
                </span>
              </label>
              <Button
                type="submit"
                variant="accent"
                className="w-full"
                disabled={!ageConfirmed || !consentAccepted || joining}
              >
                {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request to join'}
              </Button>
            </form>
          </Card>
        )}

        {/* --- Pending approval --- */}
        {myMembership?.status === 'PENDING' && (
          <Card className="text-center py-10">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3 text-teal-500" />
            <p className="text-sm text-navy-800 font-medium mb-1">Waiting for approval</p>
            <p className="text-xs text-ink-500 mb-4">
              Your group name will be <strong>{myMembership.pseudonym}</strong>. The facilitator will
              review your request.
            </p>
            <button onClick={handleLeaveOrCancel} className="text-xs text-ink-400 hover:text-red-600">
              Cancel request
            </button>
          </Card>
        )}

        {/* --- Active member: chat --- */}
        {isActive && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-500">
                You're posting as <strong>{myMembership.pseudonym}</strong>
              </p>
              <button
                onClick={handleLeaveOrCancel}
                className="text-xs text-ink-400 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" /> Leave group
              </button>
            </div>

            <CrisisBar substanceUse={group.topic === 'SUBSTANCE_USE'} />

            <Card className="p-0 flex flex-col h-[70vh] md:h-[480px] overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages === null && (
                  <div className="flex items-center gap-2 text-ink-400 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </div>
                )}
                {messages?.map((m) => (
                  <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] md:max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm ${
                          m.isFacilitator
                            ? 'bg-teal-600 text-white'
                            : m.mine
                            ? 'bg-navy-800 text-white'
                            : 'bg-ink-100 text-navy-800'
                        }`}
                      >
                        {!m.mine && (
                          <p className="text-[11px] opacity-80 mb-0.5 font-medium">{m.authorLabel}</p>
                        )}
                        {m.hidden ? (
                          <p className="italic opacity-70">Message removed by facilitator</p>
                        ) : (
                          m.content
                        )}
                        <p className="text-[10px] opacity-60 mt-1">{formatTime(m.createdAt)}</p>
                      </div>
                      {!m.mine && !m.hidden && (
                        <div className="mt-1">
                          {reportingId === m.id ? (
                            <ReportBox
                              messageId={m.id}
                              onDone={(reported = true) => {
                                setReportingId(null)
                                if (reported) setReportedIds((prev) => new Set(prev).add(m.id))
                              }}
                            />
                          ) : reportedIds.has(m.id) ? (
                            <p className="text-[11px] text-ink-300 mt-0.5">Reported</p>
                          ) : (
                            <button
                              onClick={() => setReportingId(m.id)}
                              className="text-[11px] text-ink-300 hover:text-red-500 flex items-center gap-1 mt-0.5"
                            >
                              <Flag className="h-3 w-3" /> Report
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
                  placeholder="Share with the group..."
                  className="flex-1 min-w-0 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
                />
                <Button type="submit" variant="accent" disabled={!draft.trim() || sending}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}