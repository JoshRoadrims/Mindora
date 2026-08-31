export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-6 px-8 pt-8 pb-6 border-b border-ink-100 bg-white">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide uppercase text-teal-600 mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
        {subtitle && <p className="text-ink-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}
