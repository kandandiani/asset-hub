import { useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import { fmtInt } from '../../lib/format.js'
import useTitle from '../../lib/useTitle.js'
import { ASSET_TYPES } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { assetsWithRefs } from '../../store/selectors.js'
import AssetCard from './AssetCard.jsx'
import AssetHint from './AssetHint.jsx'
import './AssetLibrary.css'

const FILTERS = [{ key: 'all', label: '全部' }, ...ASSET_TYPES]

export default function AssetLibrary() {
  useTitle('资产库')
  const { state } = useStore()
  const [filter, setFilter] = useState('all')
  const assets = assetsWithRefs(state)
  const ofType = (key) => (key === 'all' ? assets : assets.filter((a) => a.type === key))
  const shown = ofType(filter)
  const totalRefs = assets.reduce((sum, a) => sum + a.refs, 0)
  const maxRefs = Math.max(0, ...assets.map((a) => a.refs))

  return (
    <div className="page">
      <header className="page-head al-head in-0">
        <div>
          <h1>资产库</h1>
          <p className="al-lede">
            资产是从素材里筛选、沉淀下来的可复用内容。想加入新资产，先到素材记录里打开一条素材，再点「沉淀为资产」。
          </p>
        </div>
        <ul className="page-head-side al-stats" aria-label="资产统计">
          <li>
            <Badge className="al-stat">
              <strong className="num">{fmtInt(assets.length)}</strong> 项资产
            </Badge>
          </li>
          <li>
            <Badge className="al-stat">
              累计被引用 <strong className="num">{fmtInt(totalRefs)}</strong> 次
            </Badge>
          </li>
        </ul>
      </header>

      <section className="al-library in-1" aria-labelledby="al-library-title">
        <h2 id="al-library-title" className="sr-only">
          资产分类与卡片
        </h2>
        {assets.length === 0 ? (
          <Empty
            className="al-empty"
            title="资产库还是空的"
            action={
              <Link to="/materials?status=picked" className="button button-primary">
                前往素材记录
              </Link>
            }
          >
            资产来自素材记录里的「沉淀为资产」。先打开一条满意的素材，再把它沉淀下来，这里就会出现第一张资产卡片。
          </Empty>
        ) : (
          <>
            <div className="al-toolbar">
              <div className="seg-group" role="group" aria-label="资产类型">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className="seg"
                    aria-pressed={filter === f.key}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label} <span className="n">{ofType(f.key).length}</span>
                  </button>
                ))}
              </div>
              <p className="cap">按被引用次数从高到低排列</p>
            </div>
            {shown.length > 0 ? (
              <div className="cols-4">
                {shown.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} maxRefs={maxRefs} />
                ))}
              </div>
            ) : (
              <Empty
                className="al-empty"
                title="这个分类下还没有资产"
                action={
                  <button type="button" className="button button-secondary" onClick={() => setFilter('all')}>
                    查看全部
                  </button>
                }
              >
                切换到「全部」查看其他资产，或到素材记录里把更多素材沉淀为资产。
              </Empty>
            )}
          </>
        )}
      </section>

      <AssetHint />
    </div>
  )
}
