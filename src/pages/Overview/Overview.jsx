import { useMemo, useState } from 'react'
import Badge from '../../components/Badge.jsx'
import { fmtCnDate, relDayTime, WEEKDAYS } from '../../lib/format.js'
import useTitle from '../../lib/useTitle.js'
import { useStore } from '../../store/context.js'
import { isMaking, materialCounts, materialsNewest, videoPlatforms, weekStats } from '../../store/selectors.js'
import MakingCard from './MakingCard.jsx'
import PendingCard from './PendingCard.jsx'
import QuickCard from './QuickCard.jsx'
import RecentCard from './RecentCard.jsx'
import WeekCard from './WeekCard.jsx'
import './Overview.css'

// Date sentence plus the to-do sentence; a clause is dropped when its count is 0
function leadText(now, counts, making) {
  const parts = []
  if (counts.pending) parts.push(`有 ${counts.pending} 条素材等你筛选`)
  else if (counts.all) parts.push('素材都已筛选完')
  if (making) parts.push(`${making} 条成片还在制作中`)
  const todo = parts.length ? `${parts.join('，')}。` : ''
  return `今天是 ${fmtCnDate(now)}，${WEEKDAYS[now.getDay()]}。${todo}`
}

export default function Overview() {
  useTitle('总览')
  const { state } = useStore()
  // One clock reading per visit, so "today" agrees across the greeting, chart and rows
  const [now] = useState(() => new Date())
  const view = useMemo(() => {
    const counts = materialCounts(state)
    const newest = materialsNewest(state)
    const making = state.videos.filter(isMaking).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return {
      counts,
      lead: leadText(now, counts, making.length),
      updated: state.updatedAt ? relDayTime(state.updatedAt, now) : '',
      week: weekStats(state, now),
      // Oldest first: these have waited longest
      pending: newest.filter((m) => m.status === 'pending').reverse().slice(0, 3),
      recent: newest.slice(0, 5),
      making,
      targets: making.length ? videoPlatforms(making[0]).map((t) => t.platform.label) : [],
    }
  }, [state, now])

  return (
    <div className="page">
      <header className="page-head in-0">
        <div>
          <h1>总览</h1>
          <p>{view.lead}</p>
        </div>
        {view.updated && (
          <div className="page-head-side">
            <span className="stamp">
              <i aria-hidden="true" />
              数据更新于 {view.updated}
            </span>
          </div>
        )}
      </header>

      <div className="ov-bento">
        <WeekCard week={view.week} />
        <PendingCard total={view.counts.pending} items={view.pending} now={now} />
        <MakingCard videos={view.making} targets={view.targets} />
        <RecentCard items={view.recent} now={now} />
        <QuickCard />
        <p className="cap ov-note ov-c-12 in-1">
          <Badge>本地保存</Badge>
          数据保存在这台设备的浏览器里，效果数字手工填写。
        </p>
      </div>
    </div>
  )
}
