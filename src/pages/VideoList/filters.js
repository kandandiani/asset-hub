import { dayDiff, parseDay } from '../../lib/format.js'

export const TIME_OPTIONS = [
  { value: 'all', label: '全部时间' },
  { value: '7d', label: '近 7 天' },
  { value: '30d', label: '近 30 天' },
  { value: 'quarter', label: '本季度' },
]

export const NO_FILTERS = { status: 'all', channel: null, time: 'all' }

const quarterIndex = (d) => d.getFullYear() * 4 + Math.floor(d.getMonth() / 3)

// Undated rows (待发布 / 制作中) only pass 全部时间; 近 N 天 counts today as day 1
export function inTimeRange(date, range, now = new Date()) {
  if (range === 'all') return true
  if (!date) return false
  if (range === 'quarter') return quarterIndex(parseDay(date)) === quarterIndex(now)
  const diff = dayDiff(date, now)
  return diff >= 0 && diff < (range === '7d' ? 7 : 30)
}

export function filterRows(rows, { status, channel, time }, now = new Date()) {
  return rows.filter(
    (r) => (status === 'all' || r.status === status) && (!channel || r.platform?.key === channel) && inTimeRange(r.date, time, now),
  )
}
