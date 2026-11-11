import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { fmtSeconds, relDayTime } from '../../lib/format.js'
import { MATERIAL_STATUS } from '../../store/constants.js'
import { Row } from './parts.jsx'

// items: the newest materials by record time
export default function RecentCard({ items, now }) {
  return (
    <article className="card card-lift ov-card ov-c-5 in-1" aria-labelledby="ov-recent-title">
      <div className="card-head">
        <div>
          <h2 id="ov-recent-title">最近记录</h2>
          <p className="cap">按记录时间倒序，点击进入素材详情</p>
        </div>
      </div>
      <div className="ov-grow">
        {items.length > 0 ? (
          <>
            <ul className="ov-rows">
              {items.map((m) => {
                const status = MATERIAL_STATUS[m.status]
                return (
                  <li key={m.id}>
                    <Row
                      to={`/materials/${m.id}`}
                      tile={fmtSeconds(m.duration)}
                      title={m.title}
                      meta={relDayTime(m.createdAt, now)}
                      end={<Badge tone={status.tone}>{status.label}</Badge>}
                    />
                  </li>
                )
              })}
            </ul>
            <Link to="/materials" className="button button-link">
              查看全部素材记录
            </Link>
          </>
        ) : (
          <Empty
            title="还没有素材记录"
            action={
              <Link to="/materials/new" className="button button-secondary">
                记录素材
              </Link>
            }
          >
            登记第一条生成的视频，提示词和参数会一并保存。
          </Empty>
        )}
      </div>
    </article>
  )
}
