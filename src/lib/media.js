import { RATIOS } from '../store/constants.js'

// Waits for `event`; after `ms` it rejects, or resolves when `settle` is set (use the frame we have)
function once(target, event, { ms = 8000, settle = false } = {}) {
  return new Promise((resolve, reject) => {
    const ok = () => { cleanup(); resolve() }
    const fail = () => { cleanup(); reject(new Error('video-unreadable')) }
    const timer = setTimeout(settle ? ok : fail, ms)
    const cleanup = () => {
      clearTimeout(timer)
      target.removeEventListener(event, ok)
      target.removeEventListener('error', fail)
    }
    target.addEventListener(event, ok)
    target.addEventListener('error', fail)
  })
}

function nearestRatio(w, h) {
  const r = w / h
  return RATIOS.reduce((best, item) => {
    const [a, b] = item.split(':').map(Number)
    return Math.abs(a / b - r) < Math.abs(best.v - r) ? { key: item, v: a / b } : best
  }, { key: RATIOS[0], v: 16 / 9 }).key
}

function resolutionLabel(w, h) {
  const short = Math.min(w, h)
  if (short >= 2160) return '4K'
  if (short >= 1440) return '2K'
  if (short >= 1080) return '1080p'
  return '720p'
}

// Reads duration and size of a video file and grabs a small JPEG cover frame.
export async function readVideoFile(file, maxSide = 384) {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  try {
    video.src = url
    await once(video, 'loadeddata')
    const { videoWidth: w, videoHeight: h, duration } = video
    if (!w || !h) throw new Error('video-unreadable')
    // Skip the first (often black) frame when the length is known; recordings may report Infinity
    if (Number.isFinite(duration) && duration > 0.3) {
      video.currentTime = Math.min(1, duration / 3)
      await once(video, 'seeked', { ms: 2500, settle: true })
    }
    const scale = maxSide / Math.max(w, h)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * scale)
    canvas.height = Math.round(h * scale)
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return {
      cover: canvas.toDataURL('image/jpeg', 0.72),
      duration: Number.isFinite(duration) ? Math.max(1, Math.round(duration)) : null,
      width: w,
      height: h,
      ratio: nearestRatio(w, h),
      resolution: resolutionLabel(w, h),
    }
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
