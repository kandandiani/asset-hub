const now = () => new Date().toISOString()

const patchById = (list, id, patch) =>
  list.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: now() } : item))

function reduce(state, action) {
  const { type, payload: p } = action
  switch (type) {
    case 'material/add':
      return { ...state, materials: [p, ...state.materials] }
    case 'material/update':
      return { ...state, materials: patchById(state.materials, p.id, p.patch) }
    case 'material/delete':
      return {
        ...state,
        materials: state.materials.filter((m) => m.id !== p.id),
        assets: state.assets.filter((a) => a.materialId !== p.id),
        videos: state.videos.map((v) =>
          v.materialIds.includes(p.id) ? { ...v, materialIds: v.materialIds.filter((id) => id !== p.id) } : v,
        ),
      }
    case 'asset/add':
      return { ...state, assets: [p, ...state.assets.filter((a) => a.materialId !== p.materialId)] }
    case 'asset/update':
      return { ...state, assets: state.assets.map((a) => (a.id === p.id ? { ...a, ...p.patch } : a)) }
    case 'asset/delete':
      return { ...state, assets: state.assets.filter((a) => a.id !== p.id) }
    case 'video/add':
      return { ...state, videos: [p, ...state.videos] }
    case 'video/update':
      return { ...state, videos: patchById(state.videos, p.id, p.patch) }
    case 'video/delete':
      return { ...state, videos: state.videos.filter((v) => v.id !== p.id) }
    case 'pub/save':
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === p.videoId
            ? { ...v, platforms: { ...v.platforms, [p.platform]: p.data }, updatedAt: now() }
            : v,
        ),
      }
    case 'pub/remove':
      return {
        ...state,
        videos: state.videos.map((v) => {
          if (v.id !== p.videoId) return v
          const platforms = { ...v.platforms }
          delete platforms[p.platform]
          return { ...v, platforms, updatedAt: now() }
        }),
      }
    case 'account/update':
      return { ...state, account: { ...state.account, ...p } }
    case 'binding/set': {
      const bindings = { ...state.account.bindings }
      if (p.binding) bindings[p.platform] = p.binding
      else delete bindings[p.platform]
      return { ...state, account: { ...state.account, bindings } }
    }
    default:
      return state
  }
}

export function reducer(state, action) {
  const next = reduce(state, action)
  return next === state ? state : { ...next, updatedAt: now() }
}
