import { useEffect, useId, useRef } from 'react'
import Icon from './Icon.jsx'

// Native <dialog>: Esc and a backdrop click close it. Children render .modal-body / .modal-foot;
// mark the field that should receive focus with data-autofocus.
export default function Modal({ open, title, description, onClose, width = 520, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // showModal() focuses the first focusable element (the close button); prefer a marked field
      dialog.querySelector('[data-autofocus]')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      style={{ width }}
      aria-labelledby={titleId}
      onClose={onClose}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {open && (
        <div className="modal-inner">
          <header className="modal-head">
            <div>
              <h2 id={titleId}>{title}</h2>
              {description && <p className="cap">{description}</p>}
            </div>
            <button type="button" className="icon-btn" aria-label="关闭" onClick={onClose}>
              <Icon name="x" />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  )
}
