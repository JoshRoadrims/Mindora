import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2, Send, MessageCircle } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { api } from '../../data/api.js'

const THREAD_POLL_MS = 5000
const CONVERSATIONS_POLL_MS = 8000

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Messages() {
  const [conversations, setConversations] = useState(null)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const loadConversations = useCallback(() => {
    api
      .getConversations()
      .then(setConversations)
      .catch((err) => setError(err.message))
  }, [])

  const loadThread = useCallback((userId) => {
    api
      .getMessageThread(userId)
      .then(setMessages)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, CONVERSATIONS_POLL_MS)
    return () => clearInterval(interval)
  }, [loadConversations])

  useEffect(() => {
    if (!selectedId) return
    loadThread(selectedId)
    const interval = setInterval(() => loadThread(selectedId), THREAD_POLL_MS)
    return () => clearInterval(interval)
  }, [selectedId, loadThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !selectedId || sending) return
    setSending(true)
    setDraft('')
    try {
      await api.sendMessage(selectedId, text)
      loadThread(selectedId)
      loadConversations()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const selectedConversation = conversations?.find((c) => c.userId === selectedId)

  return (
    <div>
      <PageHeader
        eyebrow="Messages"
        title="Messages"
        subtitle="Message patients you have a booked appointment with, directly and privately."
      />

      <div className="p-8 max-w-5xl">
        {error && <Card className="text-sm text-red-600 mb-4">{error}</Card>}

        {conversations === null && !error && (
          <Card className="flex items-center gap-2 text-ink-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading conversations...
          </Card>
        )}

        {conversations && conversations.length === 0 && (
          <Card className="text-center py-16 text-ink-500 text-sm">
            No conversations yet — once a patient books with you, you can message them here.
          </Card>
        )}

        {conversations && conversations.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 h-[560px]">
            <Card className="p-0 overflow-y-auto md:col-span-1">
              {conversations.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => setSelectedId(c.userId)}
                  className={`w-full text-left px-4 py-3 border-b border-ink-100 last:border-0 transition-colors ${
                    selectedId === c.userId ? 'bg-teal-50' : 'hover:bg-ink-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-navy-800 text-sm">{c.userName}</p>
                    {c.unreadCount > 0 && (
                      <span className="bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 truncate mt-0.5">
                    {c.lastMessage || 'No messages yet'}
                  </p>
                </button>
              ))}
            </Card>

            <Card className="p-0 flex flex-col md:col-span-2 overflow-hidden">
              {!selectedId && (
                <div className="flex-1 flex items-center justify-center text-ink-400 text-sm gap-2">
                  <MessageCircle className="h-5 w-5" /> Select a conversation
                </div>
              )}

              {selectedId && (
                <>
                  <div className="px-4 py-3 border-b border-ink-100">
                    <p className="font-semibold text-navy-800 text-sm">
                      {selectedConversation?.userName}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {messages === null && (
                      <div className="flex items-center gap-2 text-ink-400 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                      </div>
                    )}
                    {messages?.map((m) => (
                      <div key={m.id} className={`flex ${m.senderRole === 'professional' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            m.senderRole === 'professional'
                              ? 'bg-navy-800 text-white rounded-br-sm'
                              : 'bg-ink-100 text-navy-800 rounded-bl-sm'
                          }`}
                        >
                          {m.content}
                          <p className={`text-[10px] mt-1 ${m.senderRole === 'professional' ? 'text-navy-200' : 'text-ink-400'}`}>
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  <form onSubmit={handleSend} className="border-t border-ink-100 p-3 flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
                    />
                    <Button type="submit" variant="accent" disabled={!draft.trim() || sending}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
