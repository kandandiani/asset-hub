import { useState } from 'react'
import Badge from '../../components/Badge.jsx'
import { useToast } from '../../components/toast-context.js'
import { fmtDay } from '../../lib/format.js'
import { PLATFORMS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import BindModal from './BindModal.jsx'

const UNBIND_CONFIRM = '解绑后，这个平台的账号名称会从本机移除，已录入的发布数据不受影响。确定解绑吗？'

export default function PlatformCard() {
  const { state, actions } = useStore()
  const toast = useToast()
  const [target, setTarget] = useState(null) // platform shown in BindModal
  const { bindings } = state.account
  const boundCount = PLATFORMS.filter((p) => bindings[p.key]).length

  const unbind = (platform) => {
    if (!window.confirm(UNBIND_CONFIRM)) return
    actions.unbindPlatform(platform.key)
    toast(`已解绑${platform.label}账号`)
  }
  const bind = (name) => {
    actions.bindPlatform(target.key, name)
    toast(`已绑定${target.label}账号`)
    setTarget(null)
  }

  return (
    <section className="card ac-card ac-platforms in-1">
      <div className="card-head">
        <div>
          <h2>已绑定的发布平台账号</h2>
          <p className="cap">投产视频可从这里选择发布去向</p>
        </div>
        <Badge className="num">
          已绑定 {boundCount} / {PLATFORMS.length}
        </Badge>
      </div>
      <ul className="ac-plats">
        {PLATFORMS.map((p) => {
          const binding = bindings[p.key]
          const sub = binding
            ? `${binding.name} · 绑定于 ${fmtDay(binding.boundAt)}`
            : '尚未绑定 · 绑定后可作为投产视频发布去向'
          const verb = binding ? '解绑' : '绑定'
          return (
            <li key={p.key} className="ac-row ac-plat">
              <span className="tile tile-mono" aria-hidden="true">
                {p.mono}
              </span>
              <div className="ac-row-main">
                <span className="ac-row-title">{p.label}</span>
                <span className="cap num" title={sub}>
                  {sub}
                </span>
              </div>
              {binding ? (
                <Badge tone="ok" dot>
                  已绑定
                </Badge>
              ) : (
                <Badge dot>未绑定</Badge>
              )}
              <button
                type="button"
                className="button button-secondary button-sm"
                aria-label={`${verb}${p.label}`}
                onClick={() => (binding ? unbind(p) : setTarget(p))}
              >
                {verb}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="ac-foot">
        <p className="cap">绑定只在本机记录账号名称，不会连接真实的平台账号。</p>
      </div>
      <BindModal platform={target} onClose={() => setTarget(null)} onBind={bind} />
    </section>
  )
}
