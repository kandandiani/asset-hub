import { useMemo } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import Pager from '../../components/Pager.jsx'
import { dayDiff } from '../../lib/format.js'
import useTitle from '../../lib/useTitle.js'
import { MATERIAL_STATUS, MATERIAL_STATUS_KEYS, PAGE_SIZE } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { matchesMaterial, materialCounts, materialsNewest } from '../../store/selectors.js'
import ListEmpty from './ListEmpty.jsx'
import ListFilters from './ListFilters.jsx'
import MaterialRow from './MaterialRow.jsx'
import useListQuery from './useListQuery.js'
import './MaterialList.css'

const TABS = [{ key: 'all', label: '全部' }, ...MATERIAL_STATUS_KEYS.map((key) => ({ key, label: MATERIAL_STATUS[key].label }))]
const RANGE_DAYS = { '7d': 7, '30d': 30 }

function filterMaterials(state, { status, q, time, sort }) {
  const now = new Date()
  const days = RANGE_DAYS[time]
  const list = materialsNewest(state).filter((m) => {
    if (status !== 'all' && m.status !== status) return false
    if (days) {
      // Last N calendar days, today included (same window as weekStats)
      const diff = dayDiff(m.createdAt, now)
      if (diff < 0 || diff >= days) return false
    }
    return matchesMaterial(m, q)
  })
  return sort === 'oldest' ? list.reverse() : list
}

export default function MaterialList() {
  useTitle('素材记录')
  const { state } = useStore()
  const { status, q, time, sort, page: requested, update, reset } = useListQuery()
  const counts = materialCounts(state)
  const filtered = useMemo(() => filterMaterials(state, { status, q, time, sort }), [state, status, q, time, sort])

  // Clamp into range: the URL may point past the last page after data shrinks
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(requested, pageCount)
  const start = (page - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="page">
      <header className="page-head in-0">
        <div>
          <h1>素材记录</h1>
          <p>{`共 ${counts.all} 条素材，其中 ${counts.pending} 条待筛选。点开一条查看提示词与参数，把好用的沉淀为资产。`}</p>
        </div>
        <div className="page-head-side">
          <Badge dot>数据仅保存在本机</Badge>
          <Link to="/materials/new" className="button button-secondary">
            记录素材
          </Link>
        </div>
      </header>

      <section className="card in-1" aria-labelledby="ml-list-title">
        <h2 className="sr-only" id="ml-list-title">
          素材列表
        </h2>
        <div className="tabs ml-tabs" role="group" aria-label="按状态筛选">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className="tab"
              aria-pressed={status === t.key}
              onClick={() => update({ status: t.key })}
            >
              {t.label}
              <span className="tab-count">{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <ListFilters q={q} time={time} sort={sort} total={filtered.length} onChange={update} />

        {rows.length > 0 ? (
          <>
            <div className="ml-head" aria-hidden="true">
              <span>素材</span>
              <span>状态</span>
              <span>记录时间</span>
              <span />
            </div>
            <ul>
              {rows.map((m) => (
                <MaterialRow key={m.id} material={m} />
              ))}
            </ul>
            <div className="pager-bar ml-pager">
              <p className="cap num">{`第 ${start + 1}–${start + rows.length} 条，共 ${filtered.length} 条 · 第 ${page} / ${pageCount} 页`}</p>
              <Pager page={page} pageCount={pageCount} onChange={(p) => update({ page: p })} />
            </div>
          </>
        ) : (
          <ListEmpty hasMaterials={counts.all > 0} onReset={reset} />
        )}
      </section>
    </div>
  )
}
