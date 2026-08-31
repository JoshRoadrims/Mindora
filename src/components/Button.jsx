import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-5 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-navy-800 text-white hover:bg-navy-700',
  accent: 'bg-teal-500 text-white hover:bg-teal-600',
  secondary: 'bg-white text-navy-800 border border-ink-200 hover:border-navy-300',
  ghost: 'text-navy-700 hover:bg-navy-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export default function Button({
  as = 'button',
  to,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${className}`
  if (as === 'link' || to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
