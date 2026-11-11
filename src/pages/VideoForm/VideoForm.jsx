import { Link, useParams, useSearchParams } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Breadcrumb, Empty } from '../../components/Basics.jsx'
import useTitle from '../../lib/useTitle.js'
import { useStore } from '../../store/context.js'
import { getMaterial, getVideo } from '../../store/selectors.js'
import VideoFormBody from './VideoFormBody.jsx'
import './VideoForm.css'

export default function VideoForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { state } = useStore()
  const editing = id !== undefined
  const video = editing ? getVideo(state, id) : null
  const heading = editing ? '编辑成片' : '新建成片'
  useTitle(heading)

  if (editing && !video) {
    return (
      <div className="page">
        <header className="page-head">
          <div>
            <h1>{heading}</h1>
          </div>
        </header>
        <Empty
          title="没有找到这条成片"
          action={
            <Link to="/videos" className="button button-secondary">
              返回投产视频
            </Link>
          }
        >
          它可能已被删除，或者链接有误。
        </Empty>
      </div>
    )
  }

  const materialId = searchParams.get('material')
  const presetMaterial = !editing && materialId && getMaterial(state, materialId) ? materialId : null

  return (
    <div className="page">
      <div className="vf-head in-0">
        {editing && (
          <Breadcrumb
            items={[
              { label: '投产视频', to: '/videos' },
              { label: `${video.title} · 成片 v${video.version}`, to: `/videos/${video.id}` },
              { label: '编辑' },
            ]}
          />
        )}
        <header className="page-head">
          <div>
            <h1>{heading}</h1>
            <p>记录一条成片用到的素材、目标平台和制作进度。发布后在成片详情里录入各平台的效果数据。</p>
          </div>
          <div className="page-head-side">
            <Badge dot>数据仅保存在本机</Badge>
          </div>
        </header>
      </div>
      {/* Keyed by video so the lazy prefill runs once per video, even when the route element is reused */}
      <VideoFormBody key={id ?? 'new'} video={video} presetMaterial={presetMaterial} />
    </div>
  )
}
