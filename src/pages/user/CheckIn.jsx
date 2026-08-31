import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { checkInQuestions, responseOptions } from '../../data/mockData.js'
import { useAppState } from '../../data/AppState.jsx'

export default function CheckIn() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const { submitCheckIn } = useAppState()

  const question = checkInQuestions[step]
  const progress = ((step + 1) / checkInQuestions.length) * 100
  const selected = answers[question.id]

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const handleContinue = () => {
    if (step < checkInQuestions.length - 1) {
      setStep(step + 1)
    } else {
      submitCheckIn(answers)
      navigate('/app/check-in/result')
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Wellbeing check-in" title="How have you been feeling lately?" />

      <div className="p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2 text-sm text-ink-500">
          <span>
            Progress: {step + 1} of {checkInQuestions.length}
          </span>
          <span className="font-semibold text-navy-700">{question.domain}</span>
        </div>
        <div className="h-2 rounded-full bg-ink-100 mb-8 overflow-hidden">
          <div
            className="h-full bg-teal-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="mb-6">
          <p className="text-lg font-semibold text-navy-800 mb-6">
            Over the last two weeks, how often has this applied to you?
          </p>
          <p className="text-navy-700 mb-6">{question.prompt}</p>

          <div className="space-y-3">
            {responseOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  selected === opt.value
                    ? 'border-teal-400 bg-teal-50 text-navy-800'
                    : 'border-ink-200 hover:border-ink-300 text-ink-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button variant="accent" onClick={handleContinue} disabled={selected === undefined}>
            {step === checkInQuestions.length - 1 ? 'See my results' : 'Continue'}
          </Button>
        </div>

        <p className="text-xs text-ink-400 mt-8 text-center">
          This check-in draws on validated screening concepts, but Mindora's screening itself is
          not a clinically validated diagnostic tool.
        </p>
      </div>
    </div>
  )
}
