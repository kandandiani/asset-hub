import { Link } from 'react-router'
import { fmtInt, fmtPct } from '../../lib/format.js'

const labelOf = (row) => row.platform?.label ?? '未选择渠道'
const uniqueLabels = (rows) => [...new Set(rows.map(labelOf))]

// "推特、小红书、TikTok 各 1 条" when every count is 1, otherwise "抖音 2 条、微博 1 条"
function channelSummary(rows) {
  const counts = new Map()
  for (const r of rows) counts.set(labelOf(r), (counts.get(labelOf(r)) || 0) + 1)
  const groups = [...counts].sort((a, b) => b[1] - a[1])
  if (groups.length > 1 && groups.every(([, n]) => n === 1)) {
    const names = groups.map(([label]) => label).join('、')
    // Space only between Latin and CJK text: "TikTok 各 1 条" but "抖音各 1 条"
    return `${names}${/[A-Za-z0-9]$/.test(names) ? ' ' : ''}各 1 条`
  }
  return groups.map(([label, n]) => `${label} ${n} 条`).join('、')
}

const countStat = (rows, meta, empty) =>
  rows.length ? { value: rows.length, unit: '条', meta: meta(rows) } : { value: '—', meta: empty }

function rateMeta({ maxRate, minRate }) {
  if (!maxRate) return '发布后在成片详情里填写完播率'
  const part = (r) => `${fmtPct(r.pub.rate)} ${r.platform.label}`
  return `最高 ${part(maxRate)} · 最低 ${part(minRate)}`
}

function Stat({ label, value, unit, meta }) {
  return (
    <article className="card card-lift vl-stat">
      <h3 className="vl-stat-label">{label}</h3>
      <p className="vl-stat-num">
        {value}
        {unit && <small>{unit}</small>}
      </p>
      <p className="cap">{meta}</p>
    </article>
  )
}

function PlaysCard({ kpis }) {
  const { totalViews, byPlatform, measuredCount, topRow } = kpis
  return (
    <article className="card vl-stat vl-stat-big">
      <h3 className="vl-stat-label">总播放</h3>
      <p className="vl-stat-num">
        {fmtInt(totalViews)}
        <small>次</small>
      </p>
      <p className="cap">{measuredCount} 条发布记录已有效果数据 · 按渠道分布</p>
      {byPlatform.length ? (
        <ul className="vl-chan" aria-label="各渠道播放分布">
          {byPlatform.map(({ platform, views, share, bar }) => (
            <li key={platform.key}>
              <span>{platform.label}</span>
              <span className="progress vl-track" aria-hidden="true">
                <span className="progress-fill" style={{ width: `${bar}%` }} />
              </span>
              <span className="vl-chan-val num">
                {fmtInt(views)} · {share.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cap">还没有录入效果数据，发布后在成片详情里填写</p>
      )}
      {topRow && (
        <div className="vl-top">
          <p className="vl-top-text">
            <span>播放最高的成片</span>
            <strong>
              {topRow.video.title} · {topRow.platform.label} · {fmtInt(topRow.pub.views)}
            </strong>
          </p>
          <Link to={`/videos/${topRow.video.id}`} className="button button-primary">
            查看成片详情
          </Link>
        </div>
      )}
    </article>
  )
}

export default function KpiBento({ kpis }) {
  return (
    <section className="vl-bento in-1" aria-labelledby="vl-kpi-title">
      <h2 id="vl-kpi-title" className="sr-only">
        成片数据概览
      </h2>
      <PlaysCard kpis={kpis} />
      <Stat
        label="已发布"
        {...countStat(kpis.published, (rows) => `覆盖${uniqueLabels(rows).join('、')}`, '还没有发布到任何渠道')}
      />
      <Stat label="平均完播率" value={fmtPct(kpis.avgRate)} meta={rateMeta(kpis)} />
      <Stat label="制作中" {...countStat(kpis.making, channelSummary, '没有制作中的成片')} />
      <Stat label="投放中" {...countStat(kpis.running, channelSummary, '当前没有投放中的成片')} />
    </section>
  )
}
