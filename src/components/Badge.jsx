const tones = {
  low: 'bg-teal-50 text-teal-700 border-teal-200',
  elevated: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  acute: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-ink-100 text-ink-600 border-ink-200',
  navy: 'bg-navy-50 text-navy-700 border-navy-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
