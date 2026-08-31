import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'

const initialMessages = [
  {
    from: 'user',
    text: "I've been feeling overwhelmed lately and I don't know why.",
  },
  {
    from: 'ai',
    text: "I'm sorry you're feeling overwhelmed. I can help you reflect on what may be affecting your wellbeing. Would you like to complete a short wellbeing check-in?",
  },
]

export default function MindoraAI() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const navigate = useNavigate()

  const handleSend = () => {
    if (!draft.trim()) return
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: draft },
      {
        from: 'ai',
        text: "Thank you for sharing that. I'm not able to give clinical advice, but I can help you check in on how you're doing, or connect you with a mental-health professional.",
      },
    ])
    setDraft('')
  }

  return (
    <div>
      <PageHeader eyebrow="Mindora AI" title="Mindora AI" subtitle="Your wellbeing companion" />

      <div className="p-8 max-w-2xl mx-auto space-y-4">
        <Disclaimer>AI support — not a replacement for professional care.</Disclaimer>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 space-y-4 min-h-[280px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.from === 'user'
                      ? 'bg-navy-800 text-white rounded-br-sm'
                      : 'bg-ink-100 text-navy-800 rounded-bl-sm'
                  }`}
                >
                  {m.from === 'ai' && (
                    <div className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold mb-1">
                      <Sparkles className="h-3 w-3" /> Mindora AI
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-ink-100 p-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share what's on your mind..."
              className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            />
            <Button variant="accent" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate('/app/check-in')}>
            Start check-in
          </Button>
          <Button variant="secondary" onClick={() => setDraft('I want to talk about how I\'m feeling.')}>
            Talk about how I'm feeling
          </Button>
          <Button variant="secondary" onClick={() => navigate('/app/find-a-professional')}>
            Find professional support
          </Button>
        </div>
      </div>
    </div>
  )
}
