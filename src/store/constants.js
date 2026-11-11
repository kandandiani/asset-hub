// Shared enumerations. `tone` maps to a .badge-* modifier in styles/ui.css.

export const MATERIAL_STATUS = {
  pending: { label: '待筛选', action: '待筛选', tone: 'pending', hint: '尚未决定是否入选' },
  picked: { label: '已入选', action: '入选', tone: 'ok', hint: '已加入入选素材，可沉淀为资产' },
  dropped: { label: '已弃用', action: '弃用', tone: 'muted', hint: '已标记为弃用，可随时恢复' },
}
export const MATERIAL_STATUS_KEYS = ['pending', 'picked', 'dropped']

export const PLATFORMS = [
  { key: 'xhs', label: '小红书', mono: '小' },
  { key: 'x', label: '推特', mono: 'X' },
  { key: 'douyin', label: '抖音', mono: '抖' },
  { key: 'tiktok', label: 'TikTok', mono: 'T' },
  { key: 'weibo', label: '微博', mono: '微' },
]
export const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.key, p]))

// Status of one video on one platform
export const PUB_STATUS = {
  pending: { label: '待发布', tone: 'muted' },
  published: { label: '已发布', tone: 'ok' },
  running: { label: '投放中', tone: 'run' },
}
export const PUB_STATUS_KEYS = ['pending', 'published', 'running']

// Row status in the 投产视频 list: a platform row of an unfinished video shows 制作中
export const ROW_STATUS = {
  making: { label: '制作中', tone: 'pending' },
  ...PUB_STATUS,
}
export const ROW_STATUS_KEYS = ['published', 'running', 'pending', 'making']

// Production steps; video.stage = number of finished steps (0–5), 5 means 已完成
export const STAGES = ['脚本', '素材挑选', '剪辑', '配音与字幕', '导出']
export const STAGE_DONE = STAGES.length

export const ORIENTATIONS = { portrait: '竖版', landscape: '横版' }

export const ASSET_TYPES = [
  { key: 'shot', label: '镜头', color: 'var(--ok)' },
  { key: 'scene', label: '场景', color: 'var(--accent)' },
  { key: 'role', label: '角色', color: 'var(--brand)' },
  { key: 'style', label: '风格', color: 'var(--warn)' },
]
export const ASSET_TYPE_MAP = Object.fromEntries(ASSET_TYPES.map((t) => [t.key, t]))

export const MODELS = ['Veo', 'Sora', '可灵', '即梦', 'Runway', '其他模型']
export const RESOLUTIONS = ['720p', '1080p', '2K', '4K']
export const RATIOS = ['16:9', '9:16', '1:1', '4:3']
export const DEFAULT_SERIES = ['晨雾山林', '霓虹雨夜', '产品微距']

export const PAGE_SIZE = 8
