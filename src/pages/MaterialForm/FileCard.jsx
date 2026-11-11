import { useRef } from 'react'
import Field from '../../components/Field.jsx'
import Thumb from '../../components/Thumb.jsx'
import CardHead from './CardHead.jsx'

const PREVIEW_COPY = {
  empty: ['暂无预览', '选择视频后，这里显示封面帧'],
  loading: ['正在读取封面…', '较大的视频可能需要几秒'],
  error: ['无法读取该文件', '请换一个 MP4 或 MOV 文件后重试'],
}

function fileHint(video) {
  if (video.file) return '已从视频读取时长、画幅和分辨率，可再调整。'
  if (video.savedFile) return '已保存视频文件，重新选择会替换它'
  return '支持 MP4、MOV、WebM；也可先不选文件，只登记提示词与参数。'
}

export default function FileCard({ video, className = '' }) {
  const inputRef = useRef(null)
  const { status, cover } = video
  const canRemove = Boolean(video.file || cover || video.savedFile)

  const remove = () => {
    inputRef.current.value = ''
    video.remove()
    inputRef.current.focus()
  }

  return (
    <section className={`card mf-card ${className}`} aria-labelledby="mf-g-file">
      <CardHead id="mf-g-file" title="素材文件与预览" caption="选择刚生成的视频文件，文件仅保存在本机。" />
      <div className={`mf-preview mf-preview-${status}`} role="status">
        {status === 'ready' ? (
          <Thumb src={cover} alt="视频封面帧" className="mf-cover" />
        ) : (
          <>
            <strong>{PREVIEW_COPY[status][0]}</strong>
            <span>{PREVIEW_COPY[status][1]}</span>
          </>
        )}
      </div>
      <Field label="视频文件" htmlFor="mf-file" hint={fileHint(video)}>
        <div className="mf-file-row">
          <input
            ref={inputRef}
            id="mf-file"
            name="file"
            type="file"
            accept="video/*"
            className="control"
            onChange={(e) => video.choose(e.currentTarget)}
          />
          {canRemove && (
            <button type="button" className="button button-ghost button-sm" onClick={remove}>
              移除视频
            </button>
          )}
        </div>
      </Field>
    </section>
  )
}
