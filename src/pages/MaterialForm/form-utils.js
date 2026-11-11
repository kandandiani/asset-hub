import { toDayString } from '../../lib/format.js'
import { MATERIAL_DEFAULTS } from '../../store/actions.js'

const VALUE_KEYS = [
  'title', 'series', 'status', 'date', 'prompt', 'negative', 'notes',
  'model', 'resolution', 'ratio', 'duration', 'fps', 'seed', 'extra',
]
const TRIMMED_KEYS = ['title', 'series', 'prompt', 'negative', 'notes', 'seed', 'extra']

// Validated fields in DOM order; the first invalid one receives focus
export const FOCUS_ORDER = ['title', 'prompt', 'duration', 'fps']

// Form values are strings; a new material defaults to today's date
export function initialValues(material) {
  const src = { ...MATERIAL_DEFAULTS, date: material ? '' : toDayString(), ...material }
  const values = Object.fromEntries(VALUE_KEYS.map((k) => [k, src[k] == null ? '' : String(src[k])]))
  return { ...values, tags: (src.tags || []).join('，') }
}

export const parseTags = (text) => [...new Set(text.split(/[,，、\s]+/).filter(Boolean))]

const toNum = (text) => (text.trim() === '' ? null : Number(text))

function inRange(text, min, max) {
  const n = Number(text)
  return Number.isFinite(n) && n >= min && n <= max
}

export function validate(v) {
  const errors = {}
  const title = v.title.trim()
  if (!title || title.length > 60) errors.title = '请填写素材名称（最多 60 个字）'
  if (v.prompt.trim().length < 10) errors.prompt = '请粘贴提示词，至少 10 个字符'
  if (v.duration.trim() && !inRange(v.duration, 1, 120)) errors.duration = '时长需在 1–120 秒之间'
  if (v.fps.trim() && !inRange(v.fps, 1, 240)) errors.fps = '帧率需在 1–240 之间'
  return errors
}

export function buildData(v, cover) {
  return {
    ...Object.fromEntries(TRIMMED_KEYS.map((k) => [k, v[k].trim()])),
    status: v.status,
    date: v.date,
    tags: parseTags(v.tags),
    model: v.model,
    resolution: v.resolution,
    ratio: v.ratio,
    duration: toNum(v.duration),
    fps: toNum(v.fps),
    cover,
  }
}

// Values read by readVideoFile(); keeps the typed duration when the browser reports none
export const videoFields = (info, v) => ({
  duration: info.duration == null ? v.duration : String(info.duration),
  ratio: info.ratio,
  resolution: info.resolution,
})
