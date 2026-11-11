import { Link } from 'react-router'
import { PLATFORMS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'

export default function PlatformCard({ value, onChange }) {
  const { state } = useStore()
  const bindings = state.account.bindings || {}
  // Keep the checked keys in PLATFORMS order
  const toggle = (key) =>
    onChange(PLATFORMS.map((p) => p.key).filter((k) => (k === key ? !value.includes(k) : value.includes(k))))

  return (
    <section className="card vf-card vf-c12 in-2" aria-labelledby="vf-platform-title">
      <div className="card-head">
        <div>
          <h2 id="vf-platform-title">目标平台</h2>
          <p className="cap">勾选要发布的平台。勾选后会在投产视频里生成对应的发布记录，默认待发布。</p>
        </div>
      </div>
      <div className="vf-platforms">
        <div className="check-chips" role="group" aria-labelledby="vf-platform-title">
          {PLATFORMS.map((p) => (
            <label key={p.key} className="check-chip">
              <input type="checkbox" checked={value.includes(p.key)} onChange={() => toggle(p.key)} />
              {p.label}
              <span className="cap">{bindings[p.key]?.name || '未绑定'}</span>
            </label>
          ))}
        </div>
        <p className="hint">
          可在
          <Link to="/account" className="vf-link">
            账号管理
          </Link>
          里绑定平台账号
        </p>
      </div>
    </section>
  )
}
