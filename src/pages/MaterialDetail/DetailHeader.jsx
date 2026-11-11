import { startTransition, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { useToast } from '../../components/toast-context.js'
import { MATERIAL_STATUS, MATERIAL_STATUS_KEYS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import PromoteModal from './PromoteModal.jsx'

// Prototype order: 入选 / 弃用, then 待筛选 last
const STATUS_BUTTONS = [...MATERIAL_STATUS_KEYS.filter((key) => key !== 'pending'), 'pending']

function leadText(series, videoCount) {
  const owner = series ? `「${series}」系列的素材` : '未归入系列的素材'
  const linked = videoCount ? `已关联 ${videoCount} 条投产视频。` : '还没有关联投产视频。'
  return `${owner}，${linked}可以回看提示词与参数，也可以把它沉淀为资产。`
}

export default function DetailHeader({ m, asset, videoCount }) {
  const { actions } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [promoting, setPromoting] = useState(false)
  const status = MATERIAL_STATUS[m.status]

  const mark = (key) => {
    if (key === m.status) return
    actions.setMaterialStatus(m.id, key)
    toast(`已标记为${MATERIAL_STATUS[key].action}`)
  }

  const unpromote = () => {
    if (!window.confirm(`确定把「${asset.name}」移出资产库吗？素材记录和它的提示词、参数会保留。`)) return
    actions.removeAsset(asset.id)
    toast('已移出资产库')
  }

  const remove = () => {
    if (!window.confirm('删除后，这条素材、它的视频文件和对应的资产都会被移除。确定删除吗？')) return
    // The router navigates inside a transition; deleting in the same one keeps this page
    // from rendering its "已被删除" state for a frame before it leaves
    startTransition(() => {
      actions.deleteMaterial(m.id)
      navigate('/materials')
    })
    toast('素材已删除')
  }

  return (
    <>
      <header className="card page-head md-head in-0">
        <div className="md-head-main">
          <div className="md-status-line">
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
            <span className="cap">{status.hint}</span>
          </div>
          <h1>{m.title}</h1>
          <p className="md-lead">{leadText(m.series, videoCount)}</p>
        </div>
        <div className="md-head-side">
          <div className="md-head-actions">
            <div className="md-status" role="group" aria-label="素材状态">
              {STATUS_BUTTONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`button button-secondary md-st-${key}`}
                  aria-pressed={m.status === key}
                  onClick={() => mark(key)}
                >
                  {MATERIAL_STATUS[key].action}
                </button>
              ))}
            </div>
            {asset ? (
              <div className="md-asset-actions">
                <Link to="/assets" className="button button-secondary">
                  在资产库中查看
                </Link>
                <button type="button" className="button button-ghost button-sm" onClick={unpromote}>
                  移出资产库
                </button>
              </div>
            ) : (
              <button type="button" className="button button-primary" onClick={() => setPromoting(true)}>
                沉淀为资产
              </button>
            )}
          </div>
          <div className="md-head-minor">
            <Link to={`/materials/${m.id}/edit`} className="button button-secondary button-sm">
              编辑
            </Link>
            <button type="button" className="button button-ghost button-sm" onClick={remove}>
              删除
            </button>
          </div>
        </div>
      </header>
      {/* Outside the header: `.page-head p` would restyle the modal's hint and error text */}
      <PromoteModal open={promoting} material={m} onClose={() => setPromoting(false)} />
    </>
  )
}
