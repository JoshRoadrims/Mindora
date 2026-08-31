import PageHeader from '../../components/PageHeader.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LineChart from '../../components/LineChart.jsx'
import { wellbeingTrend } from '../../data/mockData.js'

const series = [
  { key: 'stress', name: 'Stress', color: '#d97757' },
  { key: 'mood', name: 'Mood', color: '#1f3868' },
  { key: 'sleep', name: 'Sleep', color: '#3fbea3' },
  { key: 'energy', name: 'Energy', color: '#7f9ac8' },
]

export default function WellbeingJourney() {
  return (
    <div>
      <PageHeader eyebrow="My wellbeing" title="Your wellbeing journey" />

      <div className="p-8 space-y-6 max-w-4xl">
        <Card>
          <h3 className="font-semibold text-navy-800 mb-4">Trends over the last 6 weeks</h3>
          <LineChart data={wellbeingTrend} series={series} />
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-navy-800 mb-3">Recent changes</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-teal-700">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                Stress has improved
              </li>
              <li className="flex items-center gap-2 text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Sleep remains an area to monitor
              </li>
            </ul>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-navy-800 mb-1">Your next check-in</h3>
              <p className="text-sm text-ink-500 mb-4">Friday, 14 August</p>
            </div>
            <Button as="link" to="/app/check-in" variant="accent" className="self-start">
              Complete check-in
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
