import Badge from '../../components/Badge.jsx'
import { fmtCnDate, fmtInt, fmtPct } from '../../lib/format.js'
import { PUB_STATUS } from '../../store/constants.js'
import { isLive } from '../../store/selectors.js'

function Metric({ label, value, format }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {value == null ? (
          <>
            <span aria-hidden="true">—</span>
            <span className="sr-only">暂无数据</span>
          </>
        ) : (
          format(value)
        )}
      </dd>
    </div>
  )
}

// One target platform of a video; `feature` marks the platform with the most views
export default function PlatformCard({ platform, pub, feature = false, onRecord }) {
  const live = isLive(pub)
  const status = PUB_STATUS[pub.status]
  const headingId = `vd-plat-${platform.key}`
  const cls = ['card', 'card-lift', 'vd-plat', feature && 'vd-plat-feature', !live && 'vd-plat-pending', 'in-2']

  return (
    <article className={cls.filter(Boolean).join(' ')} aria-labelledby={headingId}>
      <header className="vd-plat-head">
        <span className={`tile tile-mono${live ? '' : ' tile-muted'}`} aria-hidden="true">
          {platform.mono}
        </span>
        <div>
          <h3 id={headingId}>{platform.label}</h3>
          <p className="cap">{pub.date ? `发布于 ${fmtCnDate(pub.date)}` : '尚未发布'}</p>
        </div>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
        {feature && <Badge>播放最高</Badge>}
      </header>
      <dl className="vd-metrics">
        <Metric label="播放" value={pub.views} format={fmtInt} />
        <Metric label="点赞" value={pub.likes} format={fmtInt} />
        <Metric label="完播率" value={pub.rate} format={fmtPct} />
      </dl>
      <footer className="vd-plat-foot">
        <span className="cap">{live ? '手工录入' : '发布后再录入效果数据'}</span>
        <button type="button" className="button button-secondary button-sm" onClick={() => onRecord(platform.key)}>
          {live ? '编辑数据' : '记录发布'}
        </button>
      </footer>
    </article>
  )
}
