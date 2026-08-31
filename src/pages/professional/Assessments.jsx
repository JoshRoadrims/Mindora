import { ClipboardList } from 'lucide-react'
import Placeholder from '../../components/Placeholder.jsx'

export default function Assessments() {
  return (
    <Placeholder
      eyebrow="Assessments"
      title="Client assessments"
      icon={ClipboardList}
      description="A consolidated view of assessment results across your caseload, filterable by concern level."
    />
  )
}
