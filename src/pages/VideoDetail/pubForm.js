import { toDayString } from '../../lib/format.js'

export const METRIC_FIELDS = [
  { name: 'views', label: '播放', step: 1, inputMode: 'numeric' },
  { name: 'likes', label: '点赞', step: 1, inputMode: 'numeric' },
  { name: 'rate', label: '完播率（%）', step: 0.1, max: 100, inputMode: 'decimal' },
]

const str = (n) => (n == null ? '' : String(n))
const blank = (v) => String(v).trim() === ''
const numOrNull = (v) => (blank(v) ? null : Number(v))

// Form values for one platform: its saved record, or the defaults for a new one
export function formFor(video, platform) {
  const pub = platform ? video.platforms[platform] : null
  if (!pub) return { platform, status: 'published', date: toDayString(), views: '', likes: '', rate: '' }
  return {
    platform,
    status: pub.status,
    date: pub.date || (pub.status === 'pending' ? '' : toDayString()),
    views: str(pub.views),
    likes: str(pub.likes),
    rate: str(pub.rate),
  }
}

// `elements` is the form's control collection: a number input holding unparsable text reports
// value '' with validity.badInput, which must not pass as a blank (allowed) field
export function validate(form, elements) {
  const errors = {}
  if (!form.platform) errors.platform = '请选择平台'
  if (form.status === 'pending') return errors
  const bad = (name) => Boolean(elements[name]?.validity.badInput)
  for (const name of ['views', 'likes']) {
    const n = Number(form[name])
    if (bad(name) || (!blank(form[name]) && !(Number.isInteger(n) && n >= 0))) errors[name] = '需为不小于 0 的整数'
  }
  const rate = Number(form.rate)
  if (bad('rate') || (!blank(form.rate) && !(rate >= 0 && rate <= 100))) errors.rate = '需在 0–100 之间'
  return errors
}

// Payload for savePublication; normalizePub drops the date and metrics of a pending record
export function toPub(form) {
  const rate = numOrNull(form.rate)
  return {
    status: form.status,
    date: form.date,
    views: numOrNull(form.views),
    likes: numOrNull(form.likes),
    rate: rate == null ? null : Math.round(rate * 10) / 10,
  }
}
