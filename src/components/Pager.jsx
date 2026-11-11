function pageList(page, count) {
  const keep = [...new Set([1, count, page - 1, page, page + 1])].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b)
  const out = []
  keep.forEach((p, i) => {
    if (i && p - keep[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

export default function Pager({ page, pageCount, onChange }) {
  const count = Math.max(1, pageCount)
  return (
    <nav className="pager" aria-label="分页">
      <button type="button" className="pager-step" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        上一页
      </button>
      {pageList(page, count).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="pager-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className="pager-num num"
            aria-current={p === page ? 'page' : undefined}
            aria-label={p === page ? `第 ${p} 页，当前页` : `第 ${p} 页`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="pager-step" disabled={page >= count} onClick={() => onChange(page + 1)}>
        下一页
      </button>
    </nav>
  )
}
