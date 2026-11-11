import { startTransition, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Breadcrumb, Empty } from '../../components/Basics.jsx'
import { useToast } from '../../components/toast-context.js'
import useTitle from '../../lib/useTitle.js'
import { ORIENTATIONS, STAGE_DONE, STAGES } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { getVideo, videoSummary } from '../../store/selectors.js'
import CompareCard from './CompareCard.jsx'
import MaterialsCard from './MaterialsCard.jsx'
import PlatformCards from './PlatformCards.jsx'
import PublicationModal from './PublicationModal.jsx'
import StageCard from './StageCard.jsx'
import './VideoDetail.css'

function HeadBadge({ video, summary: s }) {
  if (s.making) {
    return (
      <Badge tone="pending" dot>
        制作中 · {STAGES[video.stage]}
      </Badge>
    )
  }
  if (s.live.length) {
    return (
      <Badge tone="ok" dot>
        已发布 {s.live.length} 个平台
      </Badge>
    )
  }
  return (
    <Badge tone="muted" dot>
      待发布
    </Badge>
  )
}

function lede(video, s) {
  if (!s.making) return `${s.live.length} 个平台已发布 · ${s.pending.length} 个待发布 · 效果数据为手工录入`
  const format = `${ORIENTATIONS[video.orientation]}${video.duration ? ` ${video.duration}s` : ''}`
  return `${format} · 制作进度 ${video.stage}/${STAGE_DONE} · ${s.targets.length} 个目标平台`
}

export default function VideoDetail() {
  const { id } = useParams()
  const { state, actions } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [pubModal, setPubModal] = useState({ open: false, key: null })
  const video = getVideo(state, id)
  const name = video ? `${video.title} · 成片 v${video.version}` : ''
  useTitle(video ? name : '成片不存在')

  if (!video) {
    return (
      <div className="page">
        <Empty
          title="这条成片不存在或已被删除"
          action={
            <Link to="/videos" className="button button-secondary">
              返回投产视频
            </Link>
          }
        />
      </div>
    )
  }

  const s = videoSummary(video)
  const openPub = (key) => setPubModal({ open: true, key: key ?? null })
  const closePub = () => setPubModal((m) => (m.open ? { ...m, open: false } : m))
  // 编辑效果数据 presets the top live platform, else the first live one, else the first target
  const editTarget = s.top || s.live[0] || s.targets[0]
  const editMetrics = () => openPub(editTarget?.platform.key)

  const remove = () => {
    if (!window.confirm(`确定删除「${name}」吗？它的发布记录和效果数据会一起删除，且无法恢复。`)) return
    navigate('/videos')
    // Router updates run in a transition; deleting inside one too keeps this page from
    // rendering its "不存在" state for a frame before /videos shows
    startTransition(() => actions.deleteVideo(video.id))
    toast('成片已删除')
  }

  return (
    <div className="page">
      <div className="vd-head in-0">
        <Breadcrumb items={[{ label: '投产视频', to: '/videos' }, { label: name }]} />
        <header className="page-head">
          <div>
            <div className="vd-title-row">
              <h1>{name}</h1>
              <HeadBadge video={video} summary={s} />
            </div>
            <p>{lede(video, s)}</p>
          </div>
          <div className="page-head-side">
            <button type="button" className="button button-primary" onClick={() => openPub(null)}>
              记录发布平台
            </button>
            <button type="button" className="button button-secondary" disabled={!editTarget} onClick={editMetrics}>
              编辑效果数据
            </button>
            <Link to={`/videos/${video.id}/edit`} className="button button-secondary">
              编辑成片
            </Link>
            <button type="button" className="button button-ghost button-sm" onClick={remove}>
              删除
            </button>
          </div>
        </header>
      </div>
      {s.making && <StageCard video={video} />}
      <PlatformCards summary={s} onRecord={openPub} />
      {/* Keyed by video so the selected metric tab resets when the route moves to another video */}
      <CompareCard key={video.id} summary={s} canEdit={Boolean(editTarget)} onEditMetrics={editMetrics} />
      <MaterialsCard video={video} />
      <footer className="vd-foot">
        <Link to="/videos">返回投产视频</Link>
      </footer>
      <PublicationModal open={pubModal.open} video={video} platformKey={pubModal.key} onClose={closePub} />
    </div>
  )
}
