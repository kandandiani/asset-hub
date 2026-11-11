import { useRef, useState } from 'react'
import { readVideoFile } from '../../lib/media.js'

// The newly picked video versus the saved one (edit mode); `status` drives the preview box
export default function useVideoFile(material, onRead) {
  const [pick, setPick] = useState(null)
  const [removed, setRemoved] = useState(false)
  const [busy, setBusy] = useState(null)
  // Only the latest read may update state; picking again or removing invalidates older reads
  const seq = useRef(0)

  const cover = pick ? pick.cover : removed ? null : material?.cover || null
  const savedFile = Boolean(material?.hasFile) && !removed

  async function choose(input) {
    const file = input.files?.[0]
    const ticket = ++seq.current
    if (!file) {
      setPick(null)
      setBusy(null)
      return
    }
    setBusy('loading')
    try {
      const info = await readVideoFile(file)
      if (ticket !== seq.current) return
      setPick({ file, cover: info.cover })
      setBusy(null)
      onRead(info)
    } catch {
      if (ticket !== seq.current) return
      input.value = ''
      setPick(null)
      setBusy('error')
    }
  }

  function remove() {
    seq.current += 1
    setPick(null)
    setBusy(null)
    setRemoved(true)
  }

  return {
    file: pick?.file || null,
    cover,
    removed,
    savedFile,
    status: busy || (cover ? 'ready' : 'empty'),
    choose,
    remove,
  }
}
