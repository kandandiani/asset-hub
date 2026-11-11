import { useSearchParams } from 'react-router'
import { MATERIAL_STATUS_KEYS } from '../../store/constants.js'

const DEFAULTS = { status: 'all', q: '', time: 'all', sort: 'newest', page: '1' }
const CHOICES = {
  status: ['all', ...MATERIAL_STATUS_KEYS],
  time: ['all', '7d', '30d'],
  sort: ['newest', 'oldest'],
}

const pick = (params, key) => {
  const value = params.get(key)
  return CHOICES[key].includes(value) ? value : DEFAULTS[key]
}

// List filters live in the URL so other pages can deep-link (?status=pending, ?q=…); defaults are left out
export default function useListQuery() {
  const [params, setParams] = useSearchParams()
  const page = Number.parseInt(params.get('page'), 10)

  // Any filter change returns to page 1 unless the patch sets the page itself
  const update = (patch) =>
    setParams(
      (prev) => {
        for (const [key, value] of Object.entries({ page: 1, ...patch })) {
          const v = String(value ?? '')
          if (v === '' || v === DEFAULTS[key]) prev.delete(key)
          else prev.set(key, v)
        }
        return prev
      },
      { replace: true },
    )

  return {
    status: pick(params, 'status'),
    q: (params.get('q') || '').trim(),
    time: pick(params, 'time'),
    sort: pick(params, 'sort'),
    page: page > 0 ? page : 1,
    update,
    reset: () => setParams({}, { replace: true }),
  }
}
