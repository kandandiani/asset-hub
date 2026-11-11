import { Empty } from '../../components/Basics.jsx'
import { fmtInt, fmtPct } from '../../lib/format.js'
import { joinLabels } from './metrics.js'
import PlatformCard from './PlatformCard.jsx'

// 平台发布状态: summary row, then the top platform as a wide feature card, then the rest in PLATFORMS order
export default function PlatformCards({ summary: s, onRecord }) {
  const { targets, live, pending, top } = s
  const topKey = top?.platform.key
  const ordered = top ? [top, ...targets.filter((t) => t.platform.key !== topKey)] : targets
  const liveNote = `${live.length} 个已发布平台合计`

  return (
    <section className="vd-sec" aria-labelledby="vd-plats-h">
      <div className="vd-sec-head in-1">
        <h2 id="vd-plats-h">平台发布状态</h2>
        <p className="cap">
          {targets.length} 个目标平台 · {live.length} 个已发布 · {pending.length} 个待发布。效果数据为手工录入
        </p>
      </div>
      {targets.length ? (
        <div className="vd-bento">
          <dl className="card card-lift vd-sum in-1">
            <div>
              <dt>已发布平台</dt>
              <dd>
                {live.length} / {targets.length}
                <small>{pending.length ? `${joinLabels(pending)}待发布` : '全部已发布'}</small>
              </dd>
            </div>
            <div>
              <dt>累计播放</dt>
              <dd>
                {fmtInt(s.views)}
                <small>{liveNote}</small>
              </dd>
            </div>
            <div>
              <dt>累计点赞</dt>
              <dd>
                {fmtInt(s.likes)}
                <small>{liveNote}</small>
              </dd>
            </div>
            <div>
              <dt>平均完播率</dt>
              <dd>
                {fmtPct(s.avgRate)}
                <small>各平台简单平均</small>
              </dd>
            </div>
          </dl>
          {ordered.map((t) => (
            <PlatformCard
              key={t.platform.key}
              platform={t.platform}
              pub={t.pub}
              feature={t.platform.key === topKey}
              onRecord={onRecord}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="还没有记录发布平台"
          action={
            <button type="button" className="button button-primary" onClick={() => onRecord(null)}>
              记录发布平台
            </button>
          }
        >
          这条成片尚未登记任何平台。先记录一个发布平台，再手工录入播放、点赞和完播率。
        </Empty>
      )}
    </section>
  )
}
