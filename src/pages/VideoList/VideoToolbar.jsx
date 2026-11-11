import Dropdown from '../../components/Dropdown.jsx'
import { PLATFORMS, ROW_STATUS, ROW_STATUS_KEYS } from '../../store/constants.js'
import { TIME_OPTIONS } from './filters.js'

// Status and channel chips are single select; 全部 clears both, the time range stays
export default function VideoToolbar({ filters, onChange }) {
  const { status, channel, time } = filters
  const timeLabel = TIME_OPTIONS.find((o) => o.value === time)?.label
  return (
    <div className="vl-toolbar" role="toolbar" aria-label="成片筛选">
      <div className="chips" role="group" aria-label="按状态筛选">
        <span className="vl-flabel" aria-hidden="true">
          状态
        </span>
        <button
          type="button"
          className="chip"
          aria-pressed={status === 'all'}
          onClick={() => onChange({ status: 'all', channel: null })}
        >
          全部
        </button>
        {ROW_STATUS_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="chip"
            aria-pressed={status === key}
            onClick={() => onChange({ status: key })}
          >
            {ROW_STATUS[key].label}
          </button>
        ))}
      </div>
      <span className="vl-sep" aria-hidden="true" />
      <div className="chips" role="group" aria-label="按渠道筛选">
        <span className="vl-flabel" aria-hidden="true">
          渠道
        </span>
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            type="button"
            className="chip"
            aria-pressed={channel === p.key}
            onClick={() => onChange({ channel: channel === p.key ? null : p.key })}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="vl-time">
        <Dropdown
          variant="inline"
          prefix="时间："
          value={time}
          options={TIME_OPTIONS}
          onChange={(value) => onChange({ time: value })}
          ariaLabel={`时间范围：${timeLabel}`}
        />
      </div>
    </div>
  )
}
