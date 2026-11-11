import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import Thumb from '../../components/Thumb.jsx'
import { fmtInt } from '../../lib/format.js'
import { ASSET_TYPE_MAP } from '../../store/constants.js'

// asset comes from assetsWithRefs: { ...asset, material, refs }
export default function AssetCard({ asset, maxRefs }) {
  const { name, material, refs } = asset
  const type = ASSET_TYPE_MAP[asset.type]
  const share = maxRefs > 0 ? (refs / maxRefs) * 100 : 0
  return (
    <article className="card card-lift al-card" style={{ '--c': type.color }}>
      {material?.cover ? (
        <Thumb src={material.cover} className="al-thumb" />
      ) : (
        <span className="al-thumb al-ph">
          <span aria-hidden="true">{type.label}</span>
        </span>
      )}
      <h3>{name}</h3>
      <div className="al-meta">
        <Badge>
          <i className="al-dot" aria-hidden="true" />
          {type.label}
        </Badge>
        <span className="al-refs">
          被引用 <strong className="num">{fmtInt(refs)}</strong> 次
        </span>
      </div>
      {material && <p className="cap al-src">来自素材：{material.title}</p>}
      <span className="progress al-bar" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${share}%` }} />
      </span>
      <Link
        to={`/materials/${asset.materialId}`}
        className="button button-secondary button-block al-view"
        aria-label={`查看资产：${name}`}
      >
        查看资产
      </Link>
    </article>
  )
}
