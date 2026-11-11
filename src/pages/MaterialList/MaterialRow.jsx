import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import Thumb from '../../components/Thumb.jsx'
import { fmtMonthDayTime, fmtSeconds } from '../../lib/format.js'
import { MATERIAL_STATUS } from '../../store/constants.js'

export default function MaterialRow({ material: m }) {
  const to = `/materials/${m.id}`
  const status = MATERIAL_STATUS[m.status]
  const caption = [m.prompt, m.ratio, m.duration ? `${m.duration} 秒` : ''].filter(Boolean).join(' · ')

  return (
    <li className="ml-row">
      <Link to={to} aria-hidden="true" tabIndex={-1}>
        <Thumb src={m.cover} seed={m.id} label={fmtSeconds(m.duration)} className="ml-thumb" />
      </Link>
      <div className="ml-info">
        <Link to={to} className="ml-title">
          {m.title}
        </Link>
        {caption && <p className="cap ml-caption">{caption}</p>}
      </div>
      <Badge tone={status.tone} dot>
        {status.label}
      </Badge>
      <time className="cap num" dateTime={m.createdAt}>
        {fmtMonthDayTime(m.createdAt)}
      </time>
      <Link to={to} className="button button-secondary button-sm ml-open" aria-label={`打开素材：${m.title}`}>
        打开素材
      </Link>
    </li>
  )
}
