import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useToast } from '../../components/toast-context.js'
import { useStore } from '../../store/context.js'
import BasicCard from './BasicCard.jsx'
import MaterialPicker from './MaterialPicker.jsx'
import PlatformCard from './PlatformCard.jsx'
import StageCard from './StageCard.jsx'
import { FIELD_ORDER, dropsPublishedData, initialForm, toVideoData, validate } from './form-model.js'

const DROP_CONFIRM = '取消勾选的平台已有发布数据，保存后这些数据会被删除。确定保存吗？'

export default function VideoFormBody({ video, presetMaterial }) {
  const { actions } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState(() => initialForm(video, presetMaterial))
  const [submitted, setSubmitted] = useState(false)
  // Errors show from the first submit on and are recomputed on every change
  const errors = submitted ? validate(form) : {}
  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  function submit(e) {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form)
    const firstInvalid = FIELD_ORDER.find((name) => found[name])
    if (firstInvalid) {
      e.currentTarget.elements.namedItem(firstInvalid)?.focus()
      return
    }
    if (dropsPublishedData(form, video) && !window.confirm(DROP_CONFIRM)) return

    const data = toVideoData(form, video)
    if (video) {
      actions.updateVideo(video.id, data)
      navigate(`/videos/${video.id}`, { replace: true })
      toast('修改已保存')
    } else {
      const id = actions.addVideo(data)
      navigate(`/videos/${id}`, { replace: true })
      toast('成片已创建')
    }
  }

  return (
    <form className="vf-grid" noValidate aria-label="成片表单" onSubmit={submit}>
      <BasicCard form={form} errors={errors} onChange={update} />
      <StageCard value={form.stage} onChange={(stage) => update({ stage })} />
      <PlatformCard value={form.platforms} onChange={(platforms) => update({ platforms })} />
      <MaterialPicker value={form.materialIds} onChange={(materialIds) => update({ materialIds })} />
      <div className="card form-actions vf-c12 in-2">
        <p className="cap">成片名称为必填，其余可稍后在成片详情里补充。</p>
        <div className="btn-row">
          <Link to={video ? `/videos/${video.id}` : '/videos'} className="button button-secondary">
            取消
          </Link>
          <button type="submit" className="button button-primary">
            保存成片
          </button>
        </div>
      </div>
    </form>
  )
}
