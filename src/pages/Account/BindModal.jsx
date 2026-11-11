import { useEffect, useId, useRef, useState } from 'react'
import Field from '../../components/Field.jsx'
import Modal from '../../components/Modal.jsx'

const NAME_MAX = 40

// platform: the PLATFORMS entry being bound, or null while closed. onBind receives the trimmed name.
export default function BindModal({ platform, onClose, onBind }) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [shownFor, setShownFor] = useState(platform)
  const inputRef = useRef(null)
  const inputId = useId()

  // Start from an empty form every time the modal opens
  if (platform !== shownFor) {
    setShownFor(platform)
    setName('')
    setSubmitted(false)
  }

  // autoFocus would fire before Modal's showModal() moves focus to the close button.
  // Parent effects run after child effects, so focusing here happens once the dialog is open.
  useEffect(() => {
    if (platform) inputRef.current?.focus()
  }, [platform])

  const error = submitted && !name.trim() ? '请填写账号名称' : ''

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setSubmitted(true)
      inputRef.current?.focus()
      return
    }
    onBind(name.trim())
  }

  return (
    <Modal
      open={Boolean(platform)}
      title={platform ? `绑定${platform.label}账号` : ''}
      description="只记录你在该平台使用的账号名称，方便在成片里识别发布去向。"
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate>
        <div className="modal-body">
          <Field label="账号名称" htmlFor={inputId} required error={error}>
            <input
              ref={inputRef}
              id={inputId}
              className="control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              placeholder="例如 @xiaoman_clips"
              autoComplete="off"
              required
              aria-invalid={Boolean(error)}
            />
          </Field>
        </div>
        <footer className="modal-foot">
          <button type="button" className="button button-secondary" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="button button-primary">
            绑定
          </button>
        </footer>
      </form>
    </Modal>
  )
}
