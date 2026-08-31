import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import BarChart from '../../components/BarChart.jsx'
import { adminOverview } from '../../data/mockData.js'

const stats = [
  { label: 'Total users', value: adminOverview.totalUsers },
  { label: 'Active users', value: adminOverview.activeUsers },
  { label: 'Assessments completed', value: adminOverview.assessmentsCompleted },
  { label: 'Referrals made', value: adminOverview.referralsMade },
  { label: 'Professional network', value: adminOverview.professionalsOnNetwork },
  { label: 'Institutional users', value: adminOverview.institutionalUsers },
]

export default function Overview() {
  return (
    <div>
      <PageHeader eyebrow="Overview" title="Mindora Platform Overview" />

      <div className="p-8 space-y-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className="text-2xl font-bold text-navy-800">{s.value.toLocaleString()}</p>
              <p className="text-xs text-ink-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4 text-sm">User growth</h3>
            <BarChart data={adminOverview.userGrowth} color="#0f1e3d" />
          </Card>
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4 text-sm">Assessment completion (%)</h3>
            <BarChart data={adminOverview.assessmentCompletion} color="#3fbea3" />
          </Card>
          <Card>
            <h3 className="font-semibold text-navy-800 mb-4 text-sm">Referral conversion (%)</h3>
            <BarChart data={adminOverview.referralConversion} color="#4f70a9" />
          </Card>
        </div>
      </div>
    </div>
  )
}
