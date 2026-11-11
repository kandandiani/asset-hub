import { useEffect, useRef, useState } from 'react'
import Badge from '../../components/Badge.jsx'
import Thumb from '../../components/Thumb.jsx'
import { useToast } from '../../components/toast-context.js'
import { fmtClock } from '../../lib/format.js'
import { getFile } from '../../store/files.js'

export default function PreviewCard({ m }) {
  const toast = useToast()
  const [src, setSrc] = useState(null) // object URL of the video blob while playing
  const request = useRef(0) // bumped to cancel a pending file read

  // Revoke the URL when playback stops or the card unmounts
  useEffect(() => {
    if (!src) return
    return () => URL.revokeObjectURL(src)
  }, [src])

  // A read that finishes after unmount must not create a URL that nobody revokes
  useEffect(() => {
    const pending = request
    return () => {
      pending.current += 1
    }
  }, [])

  const play = async () => {
    request.current += 1
    const token = request.current
    let blob = null
    try {
      blob = await getFile(m.id)
    } catch {
      blob = null
    }
    if (token !== request.current) return
    if (blob instanceof Blob) setSrc(URL.createObjectURL(blob))
    else toast('没有找到这条素材的视频文件')
  }

  const stop = () => {
    request.current += 1
    setSrc(null)
  }

  const specs = [m.ratio, m.fps ? `${m.fps} fps` : ''].filter(Boolean)

  return (
    <section className="card md-preview in-0" aria-label="视频预览">
      <figure className="md-frame">
        {src ? (
          <video className="md-media" src={src} controls autoPlay playsInline aria-label={`${m.title} 视频预览`} />
        ) : (
          <Thumb src={m.cover} seed={m.id} alt={m.cover ? `${m.title} 封面` : ''} className="md-media md-cover" />
        )}
        <span className="md-chip md-chip-tl">{m.series || '未归入系列'}</span>
        {/* Hidden while playing so it doesn't cover the native controls */}
        {!src && m.duration ? <span className="md-chip md-chip-br num">{fmtClock(m.duration)}</span> : null}
      </figure>
      <div className="md-player">
        <div className="md-play">
          <button
            type="button"
            className="button button-secondary button-sm"
            disabled={!m.hasFile}
            aria-describedby={m.hasFile ? undefined : 'md-no-file'}
            onClick={src ? stop : play}
          >
            {src ? '停止预览' : '播放预览'}
          </button>
          {!m.hasFile && (
            <span className="cap" id="md-no-file">
              登记时没有保存视频文件
            </span>
          )}
        </div>
        <div className="md-timeline num" aria-hidden="true">
          <span>0:00</span>
          <span className="md-track" />
          <span>{fmtClock(m.duration)}</span>
        </div>
        {specs.length > 0 && (
          <div className="md-specs">
            {specs.map((s) => (
              <Badge key={s} className="num">
                {s}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
