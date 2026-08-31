export default function BarChart({ data, color = '#1f3868', height = 160 }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${(d.value / max) * (height - 24)}px`,
              background: color,
              opacity: 0.9,
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[11px] text-ink-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
