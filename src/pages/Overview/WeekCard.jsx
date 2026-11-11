import { fmtCnDate } from '../../lib/format.js'
import { ProgressBlock } from './parts.jsx'

const STATS = [
  { key: 'total', label: '本周记录' },
  { key: 'screened', label: '已筛选' },
  { key: 'pending', label: '待筛选' },
]

// Height relative to the busiest day (96px), with a 2px stub for empty days
const barHeight = (count, max) => Math.max(2, max ? Math.round((count / max) * 96) : 0)

export default function WeekCard({ week }) {
  const max = Math.max(...week.days.map((d) => d.count))
  const summary = week.days.map((d) => `${d.label} ${d.count}`).join('，')
  return (
    <article className="card card-lift ov-card ov-c-8 in-0" aria-labelledby="ov-week-title">
      <div className="card-head">
        <div>
          <h2 id="ov-week-title">本周进度</h2>
          <p className="cap">
            近 7 天 · {fmtCnDate(week.from)}至 {fmtCnDate(week.to)} · 每日新记录素材
          </p>
        </div>
      </div>
      <div className="ov-week">
        <ul className="ov-stats" aria-label="本周统计">
          {STATS.map((s) => (
            <li key={s.key} className="ov-stat">
              <span className="cap">{s.label}</span>
              <b>
                {week[s.key]}
                <small>条</small>
              </b>
            </li>
          ))}
        </ul>
        <ul className="ov-bars" aria-label={`近 7 天每日新记录素材数：${summary}`}>
          {week.days.map((d) => {
            const today = d.isToday ? ' ov-today' : ''
            return (
              <li key={d.date}>
                <div className="ov-bar-track">
                  <span className="ov-bar-val">{d.count}</span>
                  <span className={`ov-bar${today}`} style={{ height: barHeight(d.count, max) }} />
                </div>
                <span className={`ov-bar-day${today}`}>{d.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <ProgressBlock title="筛选进度" label="本周筛选进度" value={week.screened} max={week.total} unit="条" />
    </article>
  )
}
