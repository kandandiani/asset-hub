// tone: pending | ok | run | muted | danger (see .badge-* in styles/ui.css); no tone = neutral outlined badge
export default function Badge({ tone, dot = false, className = '', children, ...rest }) {
  const cls = ['badge', tone && `badge-${tone}`, className].filter(Boolean).join(' ')
  return (
    <span className={cls} {...rest}>
      {dot && <i className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
