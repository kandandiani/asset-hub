import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { fmtSeconds, relDayTime } from '../../lib/format.js'
import { Row } from './parts.jsx'

const SHAPES = { '9:16': '竖版', '1:1': '方形' }
const shape = (ratio) => (ratio ? `${SHAPES[ratio] || '横版'} ${ratio} · ` : '')

// total: all pending materials; items: the oldest few of them
export default function PendingCard({ total, items, now }) {
  const rest = total - items.length
  return (
    <article className="card card-lift ov-card ov-c-4 in-0" aria-labelledby="ov-pending-title">
      <div className="card-head">
        <h2 id="ov-pending-title">待筛选素材</h2>
        {total > 0 && <Badge tone="pending">待处理</Badge>}
      </div>
      <p className="ov-big">
        <b>{total}</b>
        <span className="cap">条等你筛选</span>
      </p>
      <div className="ov-grow">
        {total > 0 ? (
          <>
            <ul className="ov-rows">
              {items.map((m) => (
                <li key={m.id}>
                  <Row
                    to={`/materials/${m.id}`}
                    tile={fmtSeconds(m.duration)}
                    title={m.title}
                    meta={`${shape(m.ratio)}${relDayTime(m.createdAt, now)}`}
                  />
                </li>
              ))}
            </ul>
            {rest > 0 && (
              <Link to="/materials?status=pending" className="button button-link">
                另有 {rest} 条待筛选，查看全部
              </Link>
            )}
          </>
        ) : (
          <Empty
            title="没有待筛选的素材"
            action={
              <Link to="/materials/new" className="button button-secondary">
                记录素材
              </Link>
            }
          >
            新生成的视频登记后会出现在这里。
          </Empty>
        )}
      </div>
      <Link to={total > 0 ? '/materials?status=pending' : '/materials'} className="button button-primary button-block">
        去筛选素材
      </Link>
    </article>
  )
}
