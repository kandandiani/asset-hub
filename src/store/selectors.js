import { dayDiff, startOfDay, toDayString, WEEKDAYS } from '../lib/format.js'
import { DEFAULT_SERIES, MATERIAL_STATUS, PLATFORMS, STAGE_DONE } from './constants.js'

const newestFirst = (a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)
const sumBy = (list, fn) => list.reduce((s, x) => s + (fn(x) || 0), 0)

export const getMaterial = (state, id) => state.materials.find((m) => m.id === id)
export const getVideo = (state, id) => state.videos.find((v) => v.id === id)
export const materialsNewest = (state) => [...state.materials].sort(newestFirst)

export function materialCounts(state) {
  const counts = { all: state.materials.length, pending: 0, picked: 0, dropped: 0 }
  for (const m of state.materials) counts[m.status] += 1
  return counts
}

export const matchesMaterial = (m, query) => {
  const q = query.trim().toLowerCase()
  return !q || [m.title, m.prompt, m.series, m.tags.join(' ')].some((f) => f && f.toLowerCase().includes(q))
}

export function seriesOptions(state) {
  const used = state.materials.map((m) => m.series).filter(Boolean)
  return [...new Set([...DEFAULT_SERIES, ...used])]
}

// Materials recorded in the last 7 calendar days, today included
export function weekStats(state, now = new Date()) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = startOfDay(now)
    d.setDate(d.getDate() - (6 - i))
    return { date: toDayString(d), label: i === 6 ? '今天' : WEEKDAYS[d.getDay()], isToday: i === 6, count: 0 }
  })
  let total = 0
  let screened = 0
  for (const m of state.materials) {
    const diff = dayDiff(m.createdAt, now)
    if (diff < 0 || diff > 6) continue
    days[6 - diff].count += 1
    total += 1
    if (m.status !== 'pending') screened += 1
  }
  return { days, total, screened, pending: total - screened, from: days[0].date, to: days[6].date }
}

export const assetForMaterial = (state, materialId) => state.assets.find((a) => a.materialId === materialId)
export const videosUsingMaterial = (state, materialId) => state.videos.filter((v) => v.materialIds.includes(materialId))

// Assets with their source material and the number of 成片 that use it, most used first
export function assetsWithRefs(state) {
  return state.assets
    .map((a) => ({ ...a, material: getMaterial(state, a.materialId), refs: videosUsingMaterial(state, a.materialId).length }))
    .sort((x, y) => y.refs - x.refs || newestFirst(x, y))
}

export const isMaking = (video) => video.stage < STAGE_DONE
export const isLive = (pub) => pub.status === 'published' || pub.status === 'running'

// [{ platform, pub }] in PLATFORMS order
export const videoPlatforms = (video) =>
  PLATFORMS.filter((p) => video.platforms[p.key]).map((p) => ({ platform: p, pub: video.platforms[p.key] }))

export function videoSummary(video) {
  const targets = videoPlatforms(video)
  const live = targets.filter((t) => isLive(t.pub))
  const measured = live.filter((t) => t.pub.views != null)
  const rated = live.filter((t) => t.pub.rate != null)
  return {
    targets,
    live,
    pending: targets.filter((t) => !isLive(t.pub)),
    views: sumBy(measured, (t) => t.pub.views),
    likes: sumBy(measured, (t) => t.pub.likes),
    avgRate: rated.length ? sumBy(rated, (t) => t.pub.rate) / rated.length : null,
    top: measured.reduce((best, t) => (!best || t.pub.views > best.pub.views ? t : best), null),
    making: isMaking(video),
  }
}

// Row status: real publication status wins; otherwise 制作中 while the video is unfinished
export const rowStatus = (video, pub) => (pub && isLive(pub) ? pub.status : isMaking(video) ? 'making' : 'pending')

// One row per video × target platform for the 投产视频 table; dated rows first, newest first
export function publicationRows(state) {
  const rows = []
  for (const video of state.videos) {
    const targets = videoPlatforms(video)
    if (!targets.length) rows.push({ key: `${video.id}:-`, video, platform: null, pub: null, status: rowStatus(video, null), date: '' })
    for (const { platform, pub } of targets) {
      rows.push({ key: `${video.id}:${platform.key}`, video, platform, pub, status: rowStatus(video, pub), date: pub.date })
    }
  }
  return rows.sort((a, b) => (b.date || '').localeCompare(a.date || '') || newestFirst(a.video, b.video))
}

export function videoKpis(state) {
  const rows = publicationRows(state)
  const live = rows.filter((r) => r.pub && isLive(r.pub))
  const measured = live.filter((r) => r.pub.views != null)
  const rated = live.filter((r) => r.pub.rate != null)
  const totalViews = sumBy(measured, (r) => r.pub.views)
  const byPlatform = PLATFORMS.map((p) => ({ platform: p, views: sumBy(measured.filter((r) => r.platform.key === p.key), (r) => r.pub.views) }))
    .filter((x) => x.views > 0)
    .sort((a, b) => b.views - a.views)
  const max = byPlatform[0]?.views || 1
  for (const x of byPlatform) {
    x.share = totalViews ? (x.views / totalViews) * 100 : 0
    x.bar = (x.views / max) * 100
  }
  const byRate = [...rated].sort((a, b) => b.pub.rate - a.pub.rate)
  return {
    rows,
    totalViews,
    byPlatform,
    measuredCount: measured.length,
    avgRate: rated.length ? sumBy(rated, (r) => r.pub.rate) / rated.length : null,
    maxRate: byRate[0] || null,
    minRate: byRate[byRate.length - 1] || null,
    topRow: measured.reduce((best, r) => (!best || r.pub.views > best.pub.views ? r : best), null),
    published: rows.filter((r) => r.status === 'published'),
    running: rows.filter((r) => r.status === 'running'),
    making: rows.filter((r) => r.status === 'making'),
  }
}

export function searchAll(state, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const has = (...fields) => fields.some((f) => f && String(f).toLowerCase().includes(q))
  const materials = materialsNewest(state)
    .filter((m) => matchesMaterial(m, q))
    .slice(0, 5)
    .map((m) => ({ kind: '素材', key: m.id, title: m.title, meta: `${MATERIAL_STATUS[m.status].label} · ${m.series || '未归入系列'}`, to: `/materials/${m.id}` }))
  const assets = state.assets
    .filter((a) => has(a.name))
    .slice(0, 3)
    .map((a) => ({ kind: '资产', key: a.id, title: a.name, meta: '资产库', to: `/materials/${a.materialId}` }))
  const videos = state.videos
    .filter((v) => has(v.title))
    .slice(0, 3)
    .map((v) => ({ kind: '成片', key: v.id, title: `${v.title} · 成片 v${v.version}`, meta: isMaking(v) ? '制作中' : '投产视频', to: `/videos/${v.id}` }))
  return [...materials, ...assets, ...videos]
}
