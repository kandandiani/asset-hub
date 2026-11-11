import { toDayString, uid } from '../lib/format.js'
import { deleteFile } from './files.js'

const stamp = () => new Date().toISOString()

export const MATERIAL_DEFAULTS = {
  title: '', series: '', status: 'pending', date: '', tags: [], prompt: '', negative: '', notes: '',
  model: '', resolution: '1080p', ratio: '16:9', duration: null, fps: null, seed: '', extra: '',
  cover: null, hasFile: false,
}

export const VIDEO_DEFAULTS = {
  title: '', version: 1, orientation: 'portrait', duration: null, stage: 0, materialIds: [], platforms: {}, notes: '',
}

const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v))

// Pending publications carry no date or metrics
export function normalizePub({ status = 'pending', date = '', views, likes, rate } = {}) {
  if (status === 'pending') return { status, date: '', views: null, likes: null, rate: null }
  return { status, date: date || toDayString(), views: num(views), likes: num(likes), rate: num(rate) }
}

export function createActions(dispatch) {
  return {
    addMaterial(data) {
      const id = uid('m')
      const t = stamp()
      dispatch({ type: 'material/add', payload: { ...MATERIAL_DEFAULTS, ...data, id, createdAt: t, updatedAt: t } })
      return id
    },
    updateMaterial: (id, patch) => dispatch({ type: 'material/update', payload: { id, patch } }),
    setMaterialStatus: (id, status) => dispatch({ type: 'material/update', payload: { id, patch: { status } } }),
    deleteMaterial(id) {
      dispatch({ type: 'material/delete', payload: { id } })
      deleteFile(id).catch(() => {})
    },

    promoteMaterial(materialId, { name, type }) {
      const id = uid('a')
      dispatch({ type: 'asset/add', payload: { id, name, type, materialId, createdAt: stamp() } })
      return id
    },
    updateAsset: (id, patch) => dispatch({ type: 'asset/update', payload: { id, patch } }),
    removeAsset: (id) => dispatch({ type: 'asset/delete', payload: { id } }),

    addVideo(data) {
      const id = uid('v')
      const t = stamp()
      dispatch({ type: 'video/add', payload: { ...VIDEO_DEFAULTS, ...data, id, createdAt: t, updatedAt: t } })
      return id
    },
    updateVideo: (id, patch) => dispatch({ type: 'video/update', payload: { id, patch } }),
    deleteVideo: (id) => dispatch({ type: 'video/delete', payload: { id } }),
    savePublication: (videoId, platform, data) =>
      dispatch({ type: 'pub/save', payload: { videoId, platform, data: normalizePub(data) } }),
    removePublication: (videoId, platform) => dispatch({ type: 'pub/remove', payload: { videoId, platform } }),

    updateAccount: (patch) => dispatch({ type: 'account/update', payload: patch }),
    bindPlatform: (platform, name) =>
      dispatch({ type: 'binding/set', payload: { platform, binding: { name, boundAt: toDayString() } } }),
    unbindPlatform: (platform) => dispatch({ type: 'binding/set', payload: { platform, binding: null } }),
  }
}
