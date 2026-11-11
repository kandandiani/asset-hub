import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import Icon from '../../components/Icon.jsx'
import Pager from '../../components/Pager.jsx'
import { fmtDay } from '../../lib/format.js'
import useTitle from '../../lib/useTitle.js'
import { PAGE_SIZE } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { videoKpis } from '../../store/selectors.js'
import { filterRows, NO_FILTERS } from './filters.js'
import KpiBento from './KpiBento.jsx'
import VideoTable from './VideoTable.jsx'
import VideoToolbar from './VideoToolbar.jsx'
import './VideoList.css'

function NewVideoLink() {
  return (
    <Link to="/videos/new" className="button button-primary">
      <Icon name="plus" size={18} />
      新建成片
    </Link>
  )
}

export default function VideoList() {
  useTitle('投产视频')
  const { state } = useStore()
  const kpis = useMemo(() => videoKpis(state), [state])
  const [filters, setFilters] = useState(NO_FILTERS)
  const [page, setPage] = useState(1)

  const rows = useMemo(() => filterRows(kpis.rows, filters), [kpis.rows, filters])
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }
  const resetFilters = () => updateFilters(NO_FILTERS)

  return (
    <div className="page">
      <header className="page-head vl-head in-0">
        <div>
          <h1>投产视频</h1>
          <p className="vl-lead">已做成并发布或投放的成片都在这里。按状态、渠道、时间筛选，横向比较播放、点赞和完播率。</p>
        </div>
        <div className="page-head-side">
          <Badge dot className="vl-fact">
            效果数据手填 · 最近更新 {fmtDay(state.updatedAt)}
          </Badge>
          <NewVideoLink />
        </div>
      </header>

      <KpiBento kpis={kpis} />

      <section className="card vl-list in-2" aria-labelledby="vl-list-title">
        <div className="card-head vl-list-head">
          <h2 id="vl-list-title">成片列表</h2>
          <p className="cap">
            共 {state.videos.length} 条成片 · {kpis.rows.length} 条发布记录 · 效果数据手填
          </p>
        </div>
        {state.videos.length === 0 ? (
          <Empty className="vl-empty" title="还没有投产视频" action={<NewVideoLink />}>
            成片做好并发布或投放后会出现在这里。先新建一条成片，选择用到的素材和目标平台。
          </Empty>
        ) : (
          <>
            <VideoToolbar filters={filters} onChange={updateFilters} />
            {rows.length === 0 ? (
              <Empty
                className="vl-empty"
                title="没有符合条件的成片"
                action={
                  <button type="button" className="button button-secondary" onClick={resetFilters}>
                    查看全部成片
                  </button>
                }
              >
                换一个状态或渠道试试，或回到全部成片。
              </Empty>
            ) : (
              <>
                <VideoTable rows={pageRows} />
                <div className="pager-bar vl-pager">
                  <p className="num">
                    第 {current} 页 · 每页 {PAGE_SIZE} 条 · 共 {rows.length} 条
                  </p>
                  <Pager page={current} pageCount={pageCount} onChange={setPage} />
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}
