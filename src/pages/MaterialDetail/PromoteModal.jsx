import { useEffect, useId, useRef, useState } from 'react'
import Field from '../../components/Field.jsx'
import Modal from '../../components/Modal.jsx'
import { useToast } from '../../components/toast-context.js'
import { ASSET_TYPES } from '../../store/constants.js'
import { useStore } from '../../store/context.js'

const MAX_NAME = 30

// "海边日落 · 推镜 v3" -> "海边日落 · 推镜"
const defaultName = (title) => title.replace(/\s+v\d+$/, '').trim()
const nameLength = (name) => [...name.trim()].length

function nameError(name) {
  const length = nameLength(name)
  if (!length) return '请填写资产名称'
  if (length > MAX_NAME) return `资产名称最多 ${MAX_NAME} 个字，现在是 ${length} 个字`
  return ''
}

// Mounted only while the modal is open, so every opening starts from the defaults
function PromoteForm({ material, onClose }) {
  const { actions } = useStore()
  const toast = useToast()
  const uid = useId()
  const nameRef = useRef(null)
  const [name, setName] = useState(() => defaultName(material.title))
  const [type, setType] = useState('shot')
  const [submitted, setSubmitted] = useState(false)
  // "Required" waits for a submit; "too long" shows right away
  const error = (submitted || nameLength(name) > MAX_NAME) ? nameError(name) : ''

  useEffect(() => {
    // Modal calls showModal() after this effect and focuses its close button; move focus to the name afterwards
    const frame = requestAnimationFrame(() => {
      nameRef.current?.focus()
      nameRef.current?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (nameError(name)) return
    actions.promoteMaterial(material.id, { name: name.trim(), type })
    if (material.status !== 'picked') actions.setMaterialStatus(material.id, 'picked')
    toast('已沉淀为资产，可在资产库中复用')
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="modal-body">
        <Field label="资产名称" htmlFor={`${uid}-name`} required hint={`最多 ${MAX_NAME} 个字`} error={error}>
          <input
            ref={nameRef}
            id={`${uid}-name`}
            className="control"
            value={name}
            required
            aria-invalid={error ? true : undefined}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="资产类型" labelId={`${uid}-type`}>
          <div className="check-chips" role="radiogroup" aria-labelledby={`${uid}-type`}>
            {ASSET_TYPES.map((t) => (
              <label key={t.key} className="check-chip">
                <input
                  type="radio"
                  name={`${uid}-type`}
                  value={t.key}
                  checked={type === t.key}
                  onChange={() => setType(t.key)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <footer className="modal-foot">
        <button type="button" className="button button-secondary" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="button button-primary">
          确认沉淀
        </button>
      </footer>
    </form>
  )
}

export default function PromoteModal({ open, material, onClose }) {
  return (
    <Modal open={open} title="沉淀为资产" description="资产会出现在资产库，之后新建成片时可以直接复用。" onClose={onClose}>
      <PromoteForm material={material} onClose={onClose} />
    </Modal>
  )
}
