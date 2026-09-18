import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react'
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

  switch (lastResult.riskLevel) {
    case 'ACUTE':
      return <AcuteRisk />
    case 'HIGH':
      return <HighRisk />
    case 'ELEVATED':
      return <ElevatedRisk />
    default:
      return <LowConcern />
  }
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
            Your responses suggest your wellbeing is currently in a good place.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-2">Recommended next step</h3>
          <p className="text-sm text-ink-600 mb-4">
            No action needed right now — regular check-ins help catch changes early.
          </p>
          <div className="flex flex-wrap gap-3">
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

        <Card>
          <h3 className="font-semibold text-navy-800 mb-2">Recommended next step</h3>
          <p className="text-sm text-ink-600 mb-4">
            A psychologist is generally the right starting point for this level of concern.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="link" to="/app/find-a-professional" variant="accent">
              Find a psychologist
            </Button>
            <Button as="link" to="/app/resources" variant="secondary">
              Learn more
            </Button>
          </div>
        </Card>

        <Disclaimer>
          This assessment is not a diagnosis. Mindora uses screening to help guide you toward
          appropriate, professional next steps.
        </Disclaimer>
      </div>
    </div>
  )
}

function HighRisk() {
  return (
    <div>
      <PageHeader eyebrow="Wellbeing check-in" title="Your results suggest you should speak with a professional soon." />
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-10 border-orange-200">
          <div className="mx-auto h-14 w-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <ShieldAlert className="h-7 w-7 text-orange-600" />
          </div>
          <Badge tone="high" className="mb-3">HIGH CONCERN</Badge>
          <p className="text-ink-600 text-sm max-w-md mx-auto">
            Your responses indicate a significant level of concern. A prompt clinical assessment
            is recommended.
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-2">Recommended next step</h3>
          <p className="text-sm text-ink-600 mb-4">
            Given the level of concern, a psychiatrist may be the more appropriate first step,
            particularly if medication or a fuller clinical evaluation may be needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="link" to="/app/find-a-professional" variant="accent">
              Find a psychiatrist
            </Button>
            <Button as="link" to="/app/resources" variant="secondary">
              View resources
            </Button>
          </div>
        </Card>

        <Disclaimer tone="urgent">
          If you are in immediate danger or believe you may harm yourself or someone else, please
          call Kenya's emergency line at 999 or 112, or go to the nearest hospital emergency
          department.
        </Disclaimer>

        <Disclaimer>
          This assessment is not a diagnosis. A member of the Mindora clinical safety team may
          also follow up given this result.
        </Disclaimer>
      </div>
    </div>
  )
}

function AcuteRisk() {
  return (
    <div>
      <PageHeader eyebrow="Wellbeing check-in" title="Please reach out for support right now." />
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-10 border-red-200 bg-red-50/40">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertOctagon className="h-7 w-7 text-red-600" />
          </div>
          <Badge tone="acute" className="mb-3">ACUTE CONCERN</Badge>
          <p className="text-ink-700 text-sm max-w-md mx-auto">
            Some of your responses suggest you may be going through something serious right now.
            You don't have to go through this alone.
          </p>
        </Card>

        <Disclaimer tone="urgent">
          If you are in immediate danger, please call Kenya's emergency line at 999 or 112, or go
          to the nearest hospital emergency department. For confidential suicide-prevention
          support, Befrienders Kenya can be reached by call, SMS, or WhatsApp at{' '}
          <a href="tel:+254722178177" className="underline font-semibold">
            +254 722 178 177
          </a>{' '}
          (Monday–Friday, 9am–5pm). Outside those hours, Kenya Red Cross's toll-free line,{' '}
          <a href="tel:1199" className="underline font-semibold">
            1199
          </a>
          , is available anytime.
        </Disclaimer>

        <Card>
          <h3 className="font-semibold text-navy-800 mb-2">Recommended next step</h3>
          <p className="text-sm text-ink-600 mb-4">
            A Mindora clinical safety reviewer has been notified of this result and may reach out
            directly. You can also connect with a professional right now.
          </p>
          <Button as="link" to="/app/find-a-professional" variant="accent">
            Find urgent support
          </Button>
        </Card>

        <Disclaimer>
          This assessment is not a diagnosis. It exists to connect you with real, qualified
          support as quickly as possible.
        </Disclaimer>
      </div>
    </div>
  )
}