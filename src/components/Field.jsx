// Form field wrapper: label (with 必填 pill), control, then error or hint
export default function Field({ label, htmlFor, labelId, required = false, hint, error, className = '', children }) {
  return (
    <div className={['field', error && 'has-error', className].filter(Boolean).join(' ')}>
      <label className="label" htmlFor={htmlFor} id={labelId}>
        {label}
        {required && <span className="req">必填</span>}
      </label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="hint">{hint}</p>
      )}
    </div>
  )
}
