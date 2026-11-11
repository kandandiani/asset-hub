import { VIDEO_DEFAULTS } from '../../store/actions.js'
import { PLATFORMS } from '../../store/constants.js'

export const TITLE_MAX = 40
// Fields that can show an error, in on-screen order; the first invalid one gets focus
export const FIELD_ORDER = ['title', 'version', 'duration']

const PENDING_PUB = { status: 'pending', date: '', views: null, likes: null, rate: null }

// Number inputs stay strings in the form so they can be cleared while typing
export function initialForm(video, materialId) {
  const v = video
    ? { ...VIDEO_DEFAULTS, ...video }
    : { ...VIDEO_DEFAULTS, materialIds: materialId ? [materialId] : [] }
  return {
    title: v.title,
    version: String(v.version),
    orientation: v.orientation,
    duration: v.duration == null ? '' : String(v.duration),
    stage: v.stage,
    platforms: PLATFORMS.filter((p) => v.platforms[p.key]).map((p) => p.key),
    materialIds: [...v.materialIds],
  }
}

export function parseVersion(text) {
  const n = Number(text)
  return text.trim() !== '' && Number.isSafeInteger(n) && n >= 1 ? n : null
}

function durationOk(text) {
  const n = Number(text)
  return text.trim() === '' || (n >= 1 && n <= 600)
}

export function validate(form) {
  const errors = {}
  const title = form.title.trim()
  if (!title || title.length > TITLE_MAX) errors.title = `请填写成片名称（最多 ${TITLE_MAX} 个字）`
  if (parseVersion(form.version) == null) errors.version = '版本需为不小于 1 的整数'
  if (!durationOk(form.duration)) errors.duration = '时长需在 1–600 秒之间'
  return errors
}

// Checked platforms keep their existing publication; new ones start as 待发布
export function toVideoData(form, video) {
  const platforms = {}
  for (const key of form.platforms) platforms[key] = video?.platforms[key] || { ...PENDING_PUB }
  return {
    title: form.title.trim(),
    version: parseVersion(form.version),
    orientation: form.orientation,
    duration: form.duration.trim() === '' ? null : Number(form.duration),
    stage: form.stage,
    materialIds: form.materialIds,
    platforms,
  }
}

// True when saving would delete a platform that already has publication data
export const dropsPublishedData = (form, video) =>
  Object.entries(video?.platforms || {}).some(([key, pub]) => pub.status !== 'pending' && !form.platforms.includes(key))
