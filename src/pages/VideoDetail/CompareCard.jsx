import { useState } from 'react'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { isLive } from '../../store/selectors.js'
import { barRows, joinLabels, measuredPlatforms, METRICS, takeaways } from './metrics.js'

const STEP = { ArrowRight: 1, ArrowLeft: -1 }

function Bars({ targets, metric }) {
  return (
    <ul className="vd-bars">
      {barRows(targets, metric.key).map((row, i) => (
        <li key={row.platform.key} className={row.value == null ? 'vd-bar-wait' : undefined}>
          <span className="vd-bar-name">{row.platform.label}</span>
          <span className="vd-track" aria-hidden="true">
            {row.value != null && (
              <span className={`vd-fill${i === 0 ? ' vd-fill-top' : ''}`} style={{ width: `${row.width}%` }} />
            )}
          </span>
          <span className="vd-bar-val">
            {row.value != null ? (
              metric.format(row.value)
            ) : (
              <Badge tone="muted" dot>
                {isLive(row.pub) ? '暂无数据' : '待发布'}
              </Badge>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

// 平台对比: metric tabs with ranked bars on the left, computed takeaways on the right
export default function CompareCard({ summary: s, canEdit, onEditMetrics }) {
  const [metricKey, setMetricKey] = useState('views')
  const metric = METRICS.find((m) => m.key === metricKey)
  const measured = measuredPlatforms(s)
  const pendingNote = s.pending.length ? ` · ${joinLabels(s.pending)}待发布` : ''

  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onTabKey = (e, i) => {
    const n = METRICS.length
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : STEP[e.key] ? (i + STEP[e.key] + n) % n : -1
    if (next < 0) return
    e.preventDefault()
    setMetricKey(METRICS[next].key)
    e.currentTarget.parentElement.children[next].focus()
  }

  // The tab panel is keyed by metric so its bars replay the fill animation on every switch
  return (
    <section className="vd-sec" aria-labelledby="vd-cmp-h">
      <div className="vd-sec-head in-2">
        <h2 id="vd-cmp-h">平台对比</h2>
        <p className="cap">
          {measured.length ? `横向比较 ${measured.length} 个有数据的平台` : '还没有平台录入效果数据'}
          {pendingNote}
        </p>
      </div>
      {measured.length ? (
        <div className="card vd-cmp in-2">
          <div>
            <div className="vd-cmp-top">
              <div className="seg-group" role="tablist" aria-label="对比指标">
                {METRICS.map((m, i) => (
                  <button
                    key={m.key}
                    type="button"
                    role="tab"
                    id={`vd-tab-${m.key}`}
                    className="seg"
                    aria-selected={m.key === metricKey}
                    aria-controls="vd-cmp-panel"
                    tabIndex={m.key === metricKey ? 0 : -1}
                    onClick={() => setMetricKey(m.key)}
                    onKeyDown={(e) => onTabKey(e, i)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div
              key={metricKey}
              id="vd-cmp-panel"
              className="vd-cmp-panel"
              role="tabpanel"
              aria-labelledby={`vd-tab-${metricKey}`}
              tabIndex={0}
            >
              <Bars targets={s.targets} metric={metric} />
              <p className="cap">{metric.cap}</p>
            </div>
          </div>
          <aside className="vd-take" aria-labelledby="vd-take-h">
            <h3 id="vd-take-h">对比小结</h3>
            <ul>
              {takeaways(s).map((line) => (
                <li key={line.key}>
                  {line.title && <strong>{line.title}</strong>}
                  {line.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : (
        <Empty
          title="暂无可对比的效果数据"
          action={
            <button type="button" className="button button-secondary" disabled={!canEdit} onClick={onEditMetrics}>
              编辑效果数据
            </button>
          }
        >
          至少有一个平台录入了播放、点赞和完播率之后，这里才会生成对比条形。
        </Empty>
      )}
    </section>
  )
}
