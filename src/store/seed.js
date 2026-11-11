import { toDayString, startOfDay } from '../lib/format.js'
import { SEED_MATERIALS } from './seed-materials.js'

export const STORE_VERSION = 1

// [days ago, 'HH:mm'] -> ISO string, never later than now
function at(now, [days, time]) {
  const [h, m] = time.split(':').map(Number)
  const d = startOfDay(now)
  d.setDate(d.getDate() - days)
  d.setHours(h, m, 0, 0)
  // Seeding early in the morning: pull today's items back before now, keeping their order
  if (d > now) d.setTime(now.getTime() - ((1440 - (h * 60 + m)) / 10 + 1) * 60000)
  return d.toISOString()
}

const day = (now, days) => toDayString(new Date(now.getTime() - days * 86400000))

const pub = (now, status, days, views, likes, rate) =>
  status === 'pending'
    ? { status, date: '', views: null, likes: null, rate: null }
    : { status, date: day(now, days), views, likes, rate }

function buildMaterials(now) {
  return SEED_MATERIALS.map(({ at: when, ...m }) => {
    const createdAt = at(now, when)
    return {
      series: '', tags: [], negative: '', notes: '', extra: '', seed: '',
      resolution: '1080p', fps: 24, cover: null, hasFile: false,
      ...m,
      date: toDayString(new Date(createdAt)),
      createdAt,
      updatedAt: createdAt,
    }
  })
}

function buildVideos(now) {
  const v = (id, title, version, orientation, duration, stage, materialIds, created, platforms) => ({
    id, title, version, orientation, duration, stage, materialIds, platforms, notes: '',
    createdAt: at(now, [created, '10:00']), updatedAt: at(now, [created, '10:00']),
  })
  return [
    v('v01', '雨夜霓虹街角', 2, 'portrait', 30, 5, ['m10', 'm16', 'm15'], 16, {
      xhs: pub(now, 'published', 13, 12640, 1208, 46.8),
      douyin: pub(now, 'published', 14, 48210, 3126, 41.2),
      weibo: pub(now, 'pending'),
    }),
    v('v02', '山海经·白泽 开场动画', 1, 'landscape', 12, 5, [], 20, {
      tiktok: pub(now, 'published', 18, 21975, 1534, 38.5),
      weibo: pub(now, 'running', 12, 9386, 412, 33.1),
    }),
    v('v03', '机械鲸鱼漫游', 1, 'landscape', 20, 5, ['m15'], 25, {
      x: pub(now, 'published', 23, 6820, 530, 52.4),
    }),
    v('v04', '咖啡馆延时 · 秋日', 1, 'portrait', 45, 5, ['m03'], 31, {
      xhs: pub(now, 'published', 30, 17452, 2046, 44.9),
    }),
    v('v05', '赛博茶道 15s', 1, 'portrait', 15, 5, ['m04'], 12, {
      douyin: pub(now, 'running', 11, 31108, 2377, 36.7),
    }),
    v('v06', '像素森林 循环短片', 1, 'portrait', 10, 2, ['m13'], 4, {
      x: pub(now, 'pending'),
    }),
    v('v07', '春季通勤穿搭 · 竖版成片', 1, 'portrait', 15, 3, [], 3, {
      xhs: pub(now, 'pending'),
      douyin: pub(now, 'pending'),
    }),
    v('v08', '夜行系列花絮合辑', 1, 'landscape', 60, 4, ['m16', 'm15', 'm10'], 2, {
      tiktok: pub(now, 'pending'),
    }),
  ]
}

function buildAssets(now) {
  const a = (id, name, type, materialId, days) => ({ id, name, type, materialId, createdAt: at(now, [days, '12:00']) })
  return [
    a('a01', '赛博城市夜景', 'scene', 'm15', 7),
    a('a02', '霓虹雨巷', 'scene', 'm10', 3),
    a('a03', '撑伞夜行人', 'role', 'm16', 11),
    a('a04', '森林晨雾航拍', 'shot', 'm13', 5),
    a('a05', '蒸汽冷暖对比光', 'style', 'm04', 1),
  ]
}

export function buildSeed(now = new Date()) {
  return {
    version: STORE_VERSION,
    materials: buildMaterials(now),
    assets: buildAssets(now),
    videos: buildVideos(now),
    account: {
      nickname: '小满',
      email: 'xiaoman@example.com',
      joinedAt: '2026-03-18',
      timezone: '北京时间 UTC+8',
      bindings: {
        xhs: { name: '小满的素材手记', boundAt: '2026-05-12' },
        x: { name: '@xiaoman_clips', boundAt: '2026-06-03' },
        douyin: { name: '小满做视频', boundAt: '2026-07-21' },
      },
    },
    updatedAt: now.toISOString(),
  }
}
