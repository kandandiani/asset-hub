export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const pad2 = (n) => String(n).padStart(2, '0')

// 'YYYY-MM-DD' strings are local calendar days; parse them without the UTC shift of new Date(str)
export function parseDay(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(value)
}

export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export function dayDiff(value, now = new Date()) {
  const d = parseDay(value)
  return Math.round((startOfDay(now) - startOfDay(d)) / 86400000)
}

export function toDayString(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export const fmtTime = (value) => {
  const d = parseDay(value)
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export const fmtMonthDay = (value) => {
  const d = parseDay(value)
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export const fmtMonthDayTime = (value) => `${fmtMonthDay(value)} ${fmtTime(value)}`

// "10 月 26 日"
export const fmtCnDate = (value) => {
  const d = parseDay(value)
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export const fmtDay = (value) => (value ? toDayString(parseDay(value)) : '—')

// 今天 / 昨天 / 前天 / 周X within a week, otherwise MM-DD
export function relDay(value, now = new Date()) {
  const diff = dayDiff(value, now)
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === 2) return '前天'
  if (diff > 2 && diff < 7) return WEEKDAYS[parseDay(value).getDay()]
  return fmtMonthDay(value)
}

export const relDayTime = (value, now) => `${relDay(value, now)} ${fmtTime(value)}`

export const fmtInt = (n) => (n == null || n === '' ? '—' : Number(n).toLocaleString('en-US'))

export const fmtPct = (n) => (n == null || n === '' ? '—' : `${Number(n).toFixed(1)}%`)

// 6 -> "0:06"
export const fmtClock = (sec) => (sec ? `${Math.floor(sec / 60)}:${pad2(Math.round(sec % 60))}` : '—')

// 8 -> "8s"
export const fmtSeconds = (sec) => (sec ? `${sec}s` : '—')

// FNV-1a plus a murmur3 finalizer, so similar ids (m01, m02) land on unrelated hues
export function hashHue(text = '') {
  let h = 2166136261
  for (const ch of String(text)) {
    h ^= ch.codePointAt(0)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) % 360
}

export const uid = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
