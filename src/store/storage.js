import { buildSeed, STORE_VERSION } from './seed.js'

const KEY = 'asset-hub:data'

// Returns the saved state, or seeds demo data on first launch / unreadable data
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && data.version === STORE_VERSION && Array.isArray(data.materials)) return data
    }
  } catch {
    // fall through to seed
  }
  return buildSeed()
}

// Returns false when the browser refuses to store (quota exceeded, private mode)
export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
