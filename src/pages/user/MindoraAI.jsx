import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { api } from '../../data/api.js'

const initialMessages = [
  {
    role: 'assistant',
    content:
      "Hi, I'm Mindora AI. I'm here to help you reflect on how you're doing and point you toward the right support. What's on your mind today?",
  },
]

export default function MindoraAI() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || sending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setDraft('')
    setSending(true)
    setError(null)

    try {
      // Only user/assistant turns get sent — the system prompt lives
      // entirely on the backend, never exposed to or editable by the client.
      const { reply } = await api.sendAiMessage(
        nextMessages.map((m) => ({ role: m.role, content: m.content }))
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Mindora AI" title="Mindora AI" subtitle="Your wellbeing companion" />

      <div className="p-8 max-w-2xl mx-auto space-y-4">
        <Disclaimer>AI support — not a replacement for professional care.</Disclaimer>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 space-y-4 min-h-[280px] max-h-[480px] overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-navy-800 text-white rounded-br-sm'
                      : 'bg-ink-100 text-navy-800 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold mb-1">
                      <Sparkles className="h-3 w-3" /> Mindora AI
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-ink-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && <p className="px-6 pb-2 text-xs text-red-600">{error}</p>}

          <div className="border-t border-ink-100 p-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !sending && handleSend()}
              placeholder="Share what's on your mind..."
              disabled={sending}
              className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none disabled:opacity-60"
            />
            <Button variant="accent" onClick={handleSend} disabled={sending || !draft.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate('/app/check-in')}>
            Start check-in
          </Button>
          <Button variant="secondary" onClick={() => navigate('/app/find-a-professional')}>
            Find professional support
          </Button>
        </div>
      </div>
    </div>
  )
}