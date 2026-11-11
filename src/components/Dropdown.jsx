import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const normalize = (options) => options.map((o) => (typeof o === 'object' ? o : { value: o, label: String(o) }))

/**
 * Listbox-style select matching the prototype's dropdown.
 * options: strings or { value, label }. variant: 'field' (full-width form control) | 'inline' (filter bar)
 * An empty value always shows the placeholder, so an option with value '' works as "clear".
 */
export default function Dropdown({
  value,
  options,
  onChange,
  prefix = '',
  placeholder = '请选择',
  variant = 'field',
  id,
  ariaLabel,
  ariaLabelledby,
  invalid = false,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const items = normalize(options)
  const current = value === '' || value == null ? null : items.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`dd dd-${variant}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="control dd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={current ? 'dd-value' : 'dd-value dd-placeholder'}>
          {prefix && <span className="dd-prefix">{prefix}</span>}
          {current ? current.label : placeholder}
        </span>
        <Icon name="chevronDown" size={16} className="dd-caret" />
      </button>
      {open && (
        <ul className="dd-menu" role="listbox" aria-label={ariaLabel}>
          {items.map((o) => (
            <li key={String(o.value)}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className="dd-opt"
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                {o.label}
                {o.value === value && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
