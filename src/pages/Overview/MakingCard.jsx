import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { fmtSeconds } from '../../lib/format.js'
import { STAGE_DONE, STAGES } from '../../store/constants.js'
import { ProgressBlock, Row } from './parts.jsx'

// video.stage = number of finished steps, so STAGES[stage] is the step in progress
const stepLabel = (i, stage) => (i < stage ? '已完成' : i === stage ? '进行中' : '待开始')

function MakingBody({ video, targets }) {
  return (
    <>
      <Row
        className="ov-row-flush"
        to={`/videos/${video.id}`}
        tile={fmtSeconds(video.duration)}
        title={`${video.title} · 成片 v${video.version}`}
        meta={`目标平台：${targets.length ? targets.join('、') : '未选择'}`}
      />
      <ProgressBlock title="制作进度" label="成片制作进度" value={video.stage} max={STAGE_DONE} unit="步" />
      <ol className="ov-steps ov-grow" aria-label="制作步骤">
        {STAGES.map((name, i) => (
          <li key={name} aria-current={i === video.stage ? 'step' : undefined}>
            <span>{name}</span>
            <span>{stepLabel(i, video.stage)}</span>
          </li>
        ))}
      </ol>
    </>
  )
}

// videos: unfinished videos, newest first; targets: platform labels of the first one
export default function MakingCard({ videos, targets }) {
  const [video] = videos
  const others = videos.length - 1
  return (
    <article className="card card-lift ov-card ov-c-4 in-1" aria-labelledby="ov-making-title">
      <div className="card-head">
        <h2 id="ov-making-title">制作中成片</h2>
        {video && <Badge>{videos.length} 条制作中</Badge>}
      </div>
      {video ? (
        <MakingBody video={video} targets={targets} />
      ) : (
        <div className="ov-grow">
          <Empty
            title="没有制作中的成片"
            action={
              <Link to="/videos/new" className="button button-secondary">
                新建成片
              </Link>
            }
          >
            新建成片后，制作进度会显示在这里。
          </Empty>
        </div>
      )}
      <div className="ov-foot">
        {others > 0 && <p className="cap">另有 {others} 条制作中</p>}
        <Link to="/videos" className="button button-secondary button-block">
          投产视频
        </Link>
      </div>
    </article>
  )
}
