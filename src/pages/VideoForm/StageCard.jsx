import { STAGES, STAGE_DONE } from '../../store/constants.js'

// Option i means i steps are finished; the last option is 已完成
const OPTIONS = Array.from({ length: STAGE_DONE + 1 }, (_, i) =>
  i < STAGE_DONE ? { label: `进行中：${STAGES[i]}`, cap: `已完成 ${i} / ${STAGE_DONE} 步` } : { label: '已完成制作' },
)

export default function StageCard({ value, onChange }) {
  return (
    <section className="card vf-card vf-c5 in-1" aria-labelledby="vf-stage-title">
      <div className="card-head">
        <div>
          <h2 id="vf-stage-title">制作进度</h2>
          <p className="cap">选择成片当前进行到的步骤。</p>
        </div>
      </div>
      <div className="vf-stages" role="radiogroup" aria-labelledby="vf-stage-title">
        {OPTIONS.map((option, i) => (
          <label key={option.label} className="vf-stage">
            <input type="radio" name="stage" value={i} checked={value === i} onChange={() => onChange(i)} />
            <span className="vf-stage-label">{option.label}</span>
            {option.cap && <span className="vf-stage-cap">{option.cap}</span>}
          </label>
        ))}
      </div>
    </section>
  )
}
