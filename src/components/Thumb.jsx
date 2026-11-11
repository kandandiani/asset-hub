import { hashHue } from '../lib/format.js'

// Material cover image, or a gradient placeholder tinted by `seed`. Size it with a className.
export default function Thumb({ src, seed = '', label, alt = '', className = '' }) {
  if (src) {
    return (
      <span className={`thumb ${className}`}>
        <img src={src} alt={alt} />
      </span>
    )
  }
  return (
    <span
      className={`thumb thumb-ph ${className}`}
      style={{ '--h': hashHue(seed) }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {label && <span className="thumb-label">{label}</span>}
    </span>
  )
}
