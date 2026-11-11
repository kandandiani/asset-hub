import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { fmtDay } from '../../lib/format.js'
import { isLive, isMaking, videoPlatforms } from '../../store/selectors.js'

function StatusBadge({ video, liveCount }) {
  if (isMaking(video)) return <Badge tone="pending">制作中</Badge>
  if (liveCount) {
    return (
      <Badge tone="ok" dot>
        已发布 {liveCount} 个平台
      </Badge>
    )
  }
  return <Badge tone="muted">待发布</Badge>
}

function RelatedRow({ video }) {
  const targets = videoPlatforms(video)
  const live = targets.filter((t) => isLive(t.pub))
  const firstDate = live.map((t) => t.pub.date).filter(Boolean).sort()[0]
  const platforms = targets.map((t) => t.platform.label).join('、')
  const meta = [platforms, firstDate ? fmtDay(firstDate) : '尚未发布'].filter(Boolean).join(' · ')
  const title = `${video.title} · 成片 v${video.version}`
  return (
    <li>
      <Link to={`/videos/${video.id}`} className="md-rel-row">
        <span>
          <span className="md-rel-title" title={title}>
            {title}
          </span>
          <span className="cap num">{meta}</span>
        </span>
        <StatusBadge video={video} liveCount={live.length} />
      </Link>
    </li>
  )
}

export default function RelatedVideos({ materialId, videos }) {
  return (
    <section className="card in-1" aria-labelledby="md-rel-title">
      <div className="card-head md-card-head">
        <h2 id="md-rel-title">关联投产视频</h2>
        <Badge tone="muted" className="num">
          共 {videos.length} 条
        </Badge>
      </div>
      {videos.length ? (
        <>
          <ul className="md-rel-list">
            {videos.map((v) => (
              <RelatedRow key={v.id} video={v} />
            ))}
          </ul>
          <div className="md-card-foot">
            <span className="cap">成片里选用这条素材后会出现在这里</span>
            <Link to="/videos" className="button button-ghost button-sm">
              查看投产视频
            </Link>
          </div>
        </>
      ) : (
        <Empty
          title="还没有关联的投产视频"
          action={
            <Link to={`/videos/new?material=${encodeURIComponent(materialId)}`} className="button button-secondary button-sm">
              新建成片
            </Link>
          }
        >
          新建成片时选择这条素材，就会出现在这里。
        </Empty>
      )}
    </section>
  )
}
