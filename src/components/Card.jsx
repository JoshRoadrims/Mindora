export default function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink-100 shadow-soft ${
        padded ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
