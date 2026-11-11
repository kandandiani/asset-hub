import { useState } from 'react'
import Field from '../../components/Field.jsx'
import { useToast } from '../../components/toast-context.js'
import { toDayString } from '../../lib/format.js'
import { PLATFORM_MAP, PLATFORMS, PUB_STATUS, PUB_STATUS_KEYS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { formFor, METRIC_FIELDS, toPub, validate } from './pubForm.js'

// Mounted fresh on every opening of PublicationModal, so the initial state is the reset
export default function PublicationForm({ video, platformKey, onClose }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [form, setForm] = useState(() => formFor(video, platformKey))
  const [errors, setErrors] = useState({})
  const pending = form.status === 'pending'
  const label = form.platform ? PLATFORM_MAP[form.platform].label : ''
  const exists = Boolean(form.platform && video.platforms[form.platform])

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }
  const pickPlatform = (key) => {
    setForm(formFor(video, key))
    setErrors({})
  }
  const pickStatus = (status) => {
    setForm((f) => ({ ...f, status, date: status !== 'pending' && !f.date ? toDayString() : f.date }))
    setErrors((e) => ({ platform: e.platform }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form, e.currentTarget.elements)
    setErrors(found)
    if (Object.keys(found).length) return
    actions.savePublication(video.id, form.platform, toPub(form))
    toast(`已保存${label}的发布记录`)
    onClose()
  }

  const remove = () => {
    if (!window.confirm(`确定把${label}移出这条成片吗？该平台的发布记录和效果数据会一起删除。`)) return
    actions.removePublication(video.id, form.platform)
    toast(`已移出${label}`)
    onClose()
  }

  return (
    <form className="vd-pub" noValidate onSubmit={submit}>
      <div className="modal-body">
        <Field label="平台" labelId="vd-pub-platform" required error={errors.platform}>
          <div className="check-chips" role="radiogroup" aria-labelledby="vd-pub-platform">
            {PLATFORMS.map((p) => (
              <label key={p.key} className="check-chip">
                <input
                  type="radio"
                  name="platform"
                  value={p.key}
                  checked={form.platform === p.key}
                  onChange={() => pickPlatform(p.key)}
                />
                {p.label}
                {video.platforms[p.key] ? '(已登记)' : ''}
                {!state.account.bindings[p.key] && <span className="cap">未绑定账号</span>}
              </label>
            ))}
          </div>
        </Field>
        <Field label="状态" labelId="vd-pub-status">
          <div className="check-chips" role="radiogroup" aria-labelledby="vd-pub-status">
            {PUB_STATUS_KEYS.map((key) => (
              <label key={key} className="check-chip">
                <input
                  type="radio"
                  name="status"
                  value={key}
                  checked={form.status === key}
                  onChange={() => pickStatus(key)}
                />
                {PUB_STATUS[key].label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="发布日期" htmlFor="vd-pub-date">
          <input
            id="vd-pub-date"
            type="date"
            className="control"
            value={form.date}
            disabled={pending}
            onChange={(e) => set('date', e.target.value)}
          />
        </Field>
        <div className="cols-3">
          {METRIC_FIELDS.map((m) => (
            <Field key={m.name} label={m.label} htmlFor={`vd-pub-${m.name}`} error={errors[m.name]}>
              <input
                id={`vd-pub-${m.name}`}
                name={m.name}
                type="number"
                className="control num"
                inputMode={m.inputMode}
                min={0}
                max={m.max}
                step={m.step}
                value={form[m.name]}
                disabled={pending}
                aria-invalid={errors[m.name] ? true : undefined}
                onChange={(e) => set(m.name, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </div>
      <footer className="modal-foot">
        {exists && (
          <button type="button" className="button button-ghost vd-danger-ghost push" onClick={remove}>
            移出该平台
          </button>
        )}
        <button type="button" className="button button-secondary" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="button button-primary">
          保存
        </button>
      </footer>
    </form>
  )
}
