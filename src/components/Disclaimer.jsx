import { ShieldAlert, Info } from 'lucide-react'

export function Disclaimer({ children, tone = 'info' }) {
  const isUrgent = tone === 'urgent'
  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 text-sm ${
        isUrgent
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-navy-50 border-navy-100 text-navy-700'
      }`}
    >
      {isUrgent ? (
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
      ) : (
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
      )}
      <p>{children}</p>
    </div>
  )
}
