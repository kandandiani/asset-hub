import { useState } from 'react'
import Dropdown from '../../components/Dropdown.jsx'
import Icon from '../../components/Icon.jsx'
import { PAGE_SIZE } from '../../store/constants.js'

const TIME_OPTIONS = [
  { value: 'all', label: '全部时间' },
  { value: '7d', label: '近 7 天' },
  { value: '30d', label: '近 30 天' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: '最近记录' },
  { value: 'oldest', label: '最早记录' },
]

export default function ListFilters({ q, time, sort, total, onChange }) {
  const [keyword, setKeyword] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)
  // Adopt q when it changes from outside (global search, clearing filters); our own typing comes back equal
  if (q !== syncedQ) {
    setSyncedQ(q)
    if (q !== keyword.trim()) setKeyword(q)
  }
  const search = (value) => onChange({ q: value.trim() })

  return (
    <div className="ml-filters">
      <div className="ml-search">
        <label className="sr-only" htmlFor="ml-keyword">
          按名称或提示词筛选
        </label>
        <Icon name="search" size={18} />
        <input
          id="ml-keyword"
          className="control"
          type="search"
          placeholder="按名称或提示词筛选"
          autoComplete="off"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            // Skip pinyin fragments while an IME is composing; compositionend sends the final text
            if (!e.nativeEvent.isComposing) search(e.target.value)
          }}
          onCompositionEnd={(e) => search(e.currentTarget.value)}
        />
      </div>
      <Dropdown variant="inline" prefix="时间" value={time} options={TIME_OPTIONS} onChange={(v) => onChange({ time: v })} />
      <Dropdown variant="inline" prefix="排序" value={sort} options={SORT_OPTIONS} onChange={(v) => onChange({ sort: v })} />
      <span className="cap num ml-filter-meta">{`共 ${total} 条 · 每页 ${PAGE_SIZE} 条`}</span>
    </div>
  )
}
