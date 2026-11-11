import { Link } from 'react-router'

// Linked list row: duration tile, title over meta, optional trailing element (badge)
export function Row({ to, tile, title, meta, end, className = '' }) {
  const cls = ['ov-row', end && 'ov-row-end', className].filter(Boolean).join(' ')
  return (
    <Link to={to} className={cls}>
      <span className="tile">{tile}</span>
      <span>
        <span className="ov-row-title">{title}</span>
        <span className="ov-row-meta">{meta}</span>
      </span>
      {end}
    </Link>
  )
}

// Caption line "value / max unit · pct%" over a progress bar; pct is 0 when max is 0
export function ProgressBlock({ title, label, value, max, unit }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="ov-prog-head">
        <b>{title}</b>
        <span className="cap num">
          {value} / {max} {unit} · {pct}%
        </span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${value} / ${max} ${unit}，${pct}%`}
      >
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
