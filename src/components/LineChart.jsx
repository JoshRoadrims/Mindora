// Minimal, dependency-free line chart built with plain SVG.
// Accepts: data = [{ label, ...seriesValues }], series = [{ key, color, name }]
export default function LineChart({ data, series, height = 220 }) {
  const width = 100 // percentage-based viewBox, scales responsively
  const padding = 8
  const allValues = data.flatMap((d) => series.map((s) => d[s.key]))
  const max = Math.max(...allValues, 1)
  const min = Math.min(...allValues, 0)
  const range = max - min || 1

  const xStep = (width - padding * 2) / (data.length - 1 || 1)

  const toPoints = (key) =>
    data
      .map((d, i) => {
        const x = padding + i * xStep
        const y = padding + (1 - (d[key] - min) / range) * (height - padding * 2)
        return `${x},${y}`
      })
      .join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padding}
            x2={width - padding}
            y1={padding + f * (height - padding * 2)}
            y2={padding + f * (height - padding * 2)}
            stroke="#eef0f4"
            strokeWidth="0.5"
          />
        ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            points={toPoints(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 mt-3">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs text-ink-600">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[11px] text-ink-400">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}
