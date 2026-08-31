import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import { Disclaimer } from '../../components/Disclaimer.jsx'
import { useAppState } from '../../data/AppState.jsx'

export default function AssessmentResult() {
  const { lastResult } = useAppState()
  const navigate = useNavigate()

  useEffect(() => {
    if (!lastResult) navigate('/app/check-in')
  }, [lastResult, navigate])

  if (!lastResult) return null

  if (lastResult.level === 'elevated') return <ElevatedRisk />
  return <LowConcern />
}

function LowConcern() {
  return (
    <div>
      <PageHeader eyebrow="Wellbeing check-in" title="Your wellbeing assessment" />
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-10">
          <div className="mx-auto h-14 w-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-7 w-7 text-teal-600" />
          </div>
          <Badge tone="low" className="mb-3">LOW CONCERN</Badge>
          <p className="text-ink-500 text-sm max-w-sm mx-auto">
            Your responses suggest your wellbeing is currently in a good place, with a few areas
            worth keeping an eye on.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-3">What we noticed</h3>
          <ul className="space-y-2 text-sm text-ink-600">
            <li className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              Your stress appears elevated
            </li>
            <li className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              Your sleep has changed
            </li>
            <li className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              Your energy has decreased
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-2">Recommended next step</h3>
          <p className="text-sm text-ink-600 mb-4">
            Consider speaking with a mental-health professional.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="link" to="/app/find-a-professional" variant="accent">
              Find a professional
            </Button>
            <Button as="link" to="/app/resources" variant="secondary">
              View wellbeing resources
            </Button>
            <Button as="link" to="/app" variant="ghost">
              Continue monitoring
            </Button>
          </div>
        </Card>

        <Disclaimer>
          This assessment is not a diagnosis. Mindora uses screening to help guide appropriate
          next steps.
        </Disclaimer>
      </div>
    </div>
  )
}

function ElevatedRisk() {
  return (
    <div>
      <PageHeader eyebrow="Wellbeing check-in" title="Your results suggest additional support may help." />
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-10 border-amber-200">
          <div className="mx-auto h-14 w-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <Badge tone="elevated" className="mb-3">ELEVATED CONCERN</Badge>
          <p className="text-ink-600 text-sm max-w-md mx-auto">
            Some of your responses indicate that speaking with a qualified mental-health
            professional may be appropriate.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button as="link" to="/app/find-a-professional" variant="accent">
            Find professional support
          </Button>
          <Button as="link" to="/app/resources" variant="secondary">
            Learn more
          </Button>
        </div>

        <Disclaimer tone="urgent">
          If you are in immediate danger or believe you may harm yourself or someone else, seek
          emergency or urgent professional assistance immediately.
        </Disclaimer>

        <Disclaimer>
          This assessment is not a diagnosis. Mindora uses screening to help guide you toward
          appropriate, professional next steps.
        </Disclaimer>
      </div>
    </div>
  )
}
