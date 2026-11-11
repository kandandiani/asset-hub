// Video files live in IndexedDB (localStorage is too small); keyed by material id.
const DB_NAME = 'asset-hub'
const STORE = 'files'

let dbPromise = null

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  return dbPromise
}

async function run(mode, fn) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req?.result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export const putFile = (id, blob) => run('readwrite', (s) => s.put(blob, id))
export const getFile = (id) => run('readonly', (s) => s.get(id))
export const deleteFile = (id) => run('readwrite', (s) => s.delete(id))
