import { fmtInt, fmtPct } from '../../lib/format.js'
import { isLive } from '../../store/selectors.js'

export const joinLabels = (list) => list.map((t) => t.platform.label).join('、')

export const METRICS = [
  { key: 'views', label: '播放', format: fmtInt, cap: '条长按播放最高的平台为 100% 换算' },
  { key: 'likes', label: '点赞', format: fmtInt, cap: '条长按点赞最高的平台为 100% 换算' },
  { key: 'rate', label: '完播率', format: fmtPct, cap: '条长即完播率百分比' },
]

// Live platforms that have the metric, highest first (ties keep PLATFORMS order)
const ranked = (targets, key) =>
  targets.filter((t) => isLive(t.pub) && t.pub[key] != null).sort((a, b) => b.pub[key] - a.pub[key])

// Live platforms with at least one hand-entered number
export const measuredPlatforms = (summary) => summary.live.filter((t) => METRICS.some((m) => t.pub[m.key] != null))

// Bar rows for one metric: measured platforms first, then the rest with value null
export function barRows(targets, key) {
  const has = ranked(targets, key)
  const max = has.length ? has[0].pub[key] : 0
  const width = (n) => (key === 'rate' ? Math.min(Math.max(n, 0), 100) : max > 0 ? (n / max) * 100 : 0)
  return [
    ...has.map((t) => ({ ...t, value: t.pub[key], width: width(t.pub[key]) })),
    ...targets.filter((t) => !has.includes(t)).map((t) => ({ ...t, value: null, width: 0 })),
  ]
}

const ratio = (a, b) => (a / b).toFixed(1)

// 对比小结 lines; a comparison that cannot be computed is skipped
export function takeaways(summary) {
  const { targets, pending } = summary
  const lines = []
  const views = ranked(targets, 'views')
  const lowest = views[views.length - 1]
  if (views.length > 1 && lowest.pub.views > 0) {
    const [top] = views
    lines.push({
      key: 'views',
      title: `播放：${top.platform.label} 领先`,
      text: `${fmtInt(top.pub.views)} 次，约为${lowest.platform.label}的 ${ratio(top.pub.views, lowest.pub.views)} 倍`,
    })
  }
  const likes = ranked(targets, 'likes')
  if (likes.length > 1 && likes[1].pub.likes > 0) {
    const [top, second] = likes
    lines.push({
      key: 'likes',
      title: `点赞：${top.platform.label} 领先`,
      text: `${fmtInt(top.pub.likes)} 个，约为第二名${second.platform.label}的 ${ratio(top.pub.likes, second.pub.likes)} 倍`,
    })
  }
  const rates = ranked(targets, 'rate')
  if (rates.length > 1) {
    const [top] = rates
    const min = rates[rates.length - 1]
    lines.push({
      key: 'rate',
      title: `完播率：${top.platform.label} ${fmtPct(top.pub.rate)}`,
      text: `最低为${min.platform.label} ${fmtPct(min.pub.rate)}，相差 ${(top.pub.rate - min.pub.rate).toFixed(1)} 个百分点`,
    })
  }
  if (!lines.length) lines.push({ key: 'single', text: '录入更多平台的数据后即可横向比较' })
  if (pending.length) {
    lines.push({ key: 'pending', title: `待发布：${joinLabels(pending)}`, text: '发布后录入数据，即可纳入以上对比' })
  }
  return lines
}
