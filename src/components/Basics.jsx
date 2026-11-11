import { Link } from 'react-router'

// items: [{ label, to }]; the last item is the current page
export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="面包屑">
      <ol>
        {items.map((item, i) =>
          i < items.length - 1 ? (
            <li key={`${i}-${item.label}`}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ) : (
            <li key={`${i}-${item.label}`} aria-current="page">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}

export function Empty({ title, children, action, className = '' }) {
  return (
    <div className={`empty ${className}`}>
      <p className="empty-title">{title}</p>
      {children && <p className="cap">{children}</p>}
      {action}
    </div>
  )
}
