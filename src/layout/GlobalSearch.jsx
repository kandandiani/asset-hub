import { useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../components/Icon.jsx'
import { useStore } from '../store/context.js'
import { searchAll } from '../store/selectors.js'

// Topbar search: suggests 素材 / 资产 / 成片 as you type; Enter without a pick searches 素材记录
export default function GlobalSearch() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const blurTimer = useRef(0)
  const results = useMemo(() => searchAll(state, query), [state, query])
  const showPop = open && query.trim() !== ''

  const go = (to) => {
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!results.length) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active].to)
      else if (query.trim()) go(`/materials?q=${encodeURIComponent(query.trim())}`)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="search-field">
      <label className="sr-only" htmlFor={`${listId}-input`}>
        搜索素材、提示词或资产
      </label>
      <Icon name="search" size={18} />
      <input
        id={`${listId}-input`}
        className="search-input"
        type="search"
        placeholder="搜索素材、提示词或资产"
        autoComplete="off"
        role="combobox"
        aria-expanded={showPop}
        aria-controls={listId}
        aria-activedescendant={showPop && results[active] ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120)
        }}
        onKeyDown={onKeyDown}
      />
      {showPop && (
        <div className="search-pop" onMouseDown={() => clearTimeout(blurTimer.current)}>
          {results.length ? (
            <div role="listbox" id={listId} aria-label="搜索结果">
              {results.map((r, i) => (
                <button
                  key={`${r.kind}-${r.key}`}
                  id={`${listId}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className="search-opt"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.to)}
                >
                  <span className="search-kind">{r.kind}</span>
                  <span>
                    <span className="search-title">{r.title}</span>
                    <span className="search-meta">{r.meta}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="search-empty" id={listId}>
              没有找到相关内容，按 Enter 在素材记录中按名称或提示词筛选
            </p>
          )}
          {results.length > 0 && <p className="search-foot">↑↓ 选择，Enter 打开</p>}
        </div>
      )}
    </div>
  )
}
