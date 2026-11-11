import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import Thumb from '../../components/Thumb.jsx'
import { MATERIAL_STATUS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { getMaterial } from '../../store/selectors.js'

const meta = (m) => [m.ratio, m.duration ? `${m.duration}s` : ''].filter(Boolean).join(' · ') || '—'

// 使用的素材: materials linked to the video; ids whose material was deleted are skipped
export default function MaterialsCard({ video }) {
  const { state } = useStore()
  const list = [...new Set(video.materialIds)].map((mid) => getMaterial(state, mid)).filter(Boolean)

  return (
    <section className="card vd-mats in-2" aria-labelledby="vd-mats-h">
      <div className="card-head">
        <div>
          <h2 id="vd-mats-h">使用的素材</h2>
          {list.length > 0 && <p className="cap">{list.length} 条素材</p>}
        </div>
      </div>
      {list.length ? (
        <ul className="vd-mat-list">
          {list.map((m) => {
            const status = MATERIAL_STATUS[m.status]
            return (
              <li key={m.id}>
                <Thumb src={m.cover} seed={m.id} className="vd-mat-thumb" />
                <div>
                  <Link to={`/materials/${m.id}`} className="vd-mat-title">
                    {m.title || '未命名素材'}
                  </Link>
                  <p className="cap num">{meta(m)}</p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="vd-mat-empty">
          <p className="cap">这条成片还没有关联素材</p>
          <Link to={`/videos/${video.id}/edit`} className="button button-link button-sm">
            编辑成片
          </Link>
        </div>
      )}
    </section>
  )
}
