import { useState } from 'react'
import { Link } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Empty } from '../../components/Basics.jsx'
import Icon from '../../components/Icon.jsx'
import Thumb from '../../components/Thumb.jsx'
import { fmtSeconds } from '../../lib/format.js'
import { MATERIAL_STATUS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { matchesMaterial, materialsNewest } from '../../store/selectors.js'

const meta = (m) => [m.ratio || '—', fmtSeconds(m.duration), m.series || '未归入系列'].join(' · ')

// Enter in the filter box would otherwise submit the whole form
const blockEnterSubmit = (e) => {
  if (e.key === 'Enter' && !e.nativeEvent.isComposing) e.preventDefault()
}

function MaterialRow({ material: m, checked, onToggle }) {
  const status = MATERIAL_STATUS[m.status]
  return (
    <li>
      <label className="vf-mat">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <Thumb src={m.cover} seed={m.id} className="vf-mat-thumb" />
        <span className="vf-mat-text">
          <span className="vf-mat-title">{m.title}</span>
          <span className="cap">{meta(m)}</span>
        </span>
        <Badge tone={status.tone}>{status.label}</Badge>
      </label>
    </li>
  )
}

export default function MaterialPicker({ value, onChange }) {
  const { state } = useStore()
  const [query, setQuery] = useState('')
  const [onlyPicked, setOnlyPicked] = useState(true)
  // Selection as of the last filter change. These rows stay on top and visible,
  // so ticking or unticking a row never moves it away from the pointer.
  const [pinned, setPinned] = useState(() => new Set(value))
  const selected = new Set(value)

  const toggle = (id) => onChange(selected.has(id) ? value.filter((x) => x !== id) : [...value, id])
  const rows = materialsNewest(state).filter(
    (m) => matchesMaterial(m, query) && (!onlyPicked || m.status === 'picked' || selected.has(m.id) || pinned.has(m.id)),
  )
  const sorted = [...rows.filter((m) => pinned.has(m.id)), ...rows.filter((m) => !pinned.has(m.id))]

  return (
    <section className="card vf-card vf-c12 in-2" aria-labelledby="vf-mat-title">
      <div className="card-head">
        <div>
          <h2 id="vf-mat-title">使用的素材</h2>
          <p className="cap">选择这条成片用到的素材，素材详情页会显示它被哪些成片使用。</p>
        </div>
      </div>
      {state.materials.length === 0 ? (
        <Empty
          title="还没有素材记录"
          action={
            <Link to="/materials/new" className="button button-secondary">
              记录素材
            </Link>
          }
        />
      ) : (
        <>
          <div className="vf-mat-bar">
            <div className="vf-search">
              <Icon name="search" size={18} />
              <label htmlFor="vf-mat-q" className="sr-only">
                按名称或提示词筛选素材
              </label>
              <input
                id="vf-mat-q"
                type="search"
                className="control"
                placeholder="按名称或提示词筛选素材"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPinned(new Set(value))
                }}
                onKeyDown={blockEnterSubmit}
              />
            </div>
            <label className="check-chip">
              <input
                type="checkbox"
                checked={onlyPicked}
                onChange={(e) => {
                  setOnlyPicked(e.target.checked)
                  setPinned(new Set(value))
                }}
              />
              只看已入选
            </label>
            <p className="cap vf-mat-count">
              已选 <span className="num">{value.length}</span> 条
            </p>
          </div>
          {sorted.length ? (
            <ul className="vf-mat-list" aria-labelledby="vf-mat-title">
              {sorted.map((m) => (
                <MaterialRow key={m.id} material={m} checked={selected.has(m.id)} onToggle={() => toggle(m.id)} />
              ))}
            </ul>
          ) : (
            <Empty title="没有符合条件的素材" />
          )}
        </>
      )}
    </section>
  )
}
