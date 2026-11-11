import { useToast } from '../../components/toast-context.js'
import { STAGE_DONE, STAGES } from '../../store/constants.js'
import { useStore } from '../../store/context.js'

const stepState = (i, stage) => (i < stage ? '已完成' : i === stage ? '进行中' : '待开始')

// Only rendered while the video is still in production (stage < STAGE_DONE)
export default function StageCard({ video }) {
  const { actions } = useStore()
  const toast = useToast()
  const { id, stage } = video
  const pct = Math.round((stage / STAGE_DONE) * 100)

  const complete = () => {
    const next = stage + 1
    actions.updateVideo(id, { stage: next })
    toast(next >= STAGE_DONE ? '成片已完成制作，可以记录发布平台了' : `已完成「${STAGES[stage]}」`)
  }

  return (
    <section className="card vd-stage in-1" aria-labelledby="vd-stage-h">
      <div className="card-head">
        <div>
          <h2 id="vd-stage-h">制作进度</h2>
          <p className="cap num">
            {stage} / {STAGE_DONE} 步 · {pct}%
          </p>
        </div>
        <div className="vd-stage-actions">
          <button type="button" className="button button-primary button-sm" onClick={complete}>
            完成「{STAGES[stage]}」
          </button>
          <button
            type="button"
            className="button button-ghost button-sm"
            disabled={stage === 0}
            onClick={() => actions.updateVideo(id, { stage: stage - 1 })}
          >
            回退一步
          </button>
        </div>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="成片制作进度"
        aria-valuemin={0}
        aria-valuemax={STAGE_DONE}
        aria-valuenow={stage}
      >
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="vd-steps" aria-label="制作步骤">
        {STAGES.map((name, i) => (
          <li key={name} aria-current={i === stage ? 'step' : undefined}>
            <span>{name}</span>
            <span>{stepState(i, stage)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
