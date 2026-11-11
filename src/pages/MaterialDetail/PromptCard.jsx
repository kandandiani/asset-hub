import { useToast } from '../../components/toast-context.js'
import { fmtClock, fmtDay, fmtMonthDayTime } from '../../lib/format.js'

function TextBlock({ label, text }) {
  return (
    <div>
      <h3 className="md-sub">{label}</h3>
      {text?.trim() ? <p className="md-box">{text}</p> : <p className="md-none">未填写</p>}
    </div>
  )
}

export default function PromptCard({ m }) {
  const toast = useToast()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.prompt)
      toast('提示词已复制')
    } catch {
      toast('复制失败，请手动选择文本')
    }
  }

  const params = [
    ['所属系列', m.series],
    ['生成日期', fmtDay(m.date)],
    ['时长', fmtClock(m.duration)],
    ['画幅', m.ratio],
    ['分辨率', m.resolution],
    ['帧率', m.fps ? `${m.fps} fps` : ''],
    ['模型', m.model],
    ['随机种子', m.seed || '随机'],
    ['其他参数', m.extra],
    ['标签', m.tags.join('、')],
    ['记录时间', fmtMonthDayTime(m.createdAt)],
  ]

  return (
    <section className="card in-1" aria-labelledby="md-prompt-title">
      <div className="card-head md-card-head">
        <h2 id="md-prompt-title">提示词与参数</h2>
        <button type="button" className="button button-secondary button-sm" disabled={!m.prompt} onClick={copy}>
          复制提示词
        </button>
      </div>
      <div className="md-prompt-grid">
        <div className="md-prompt-col">
          <TextBlock label="正向提示词" text={m.prompt} />
          <TextBlock label="负向提示词" text={m.negative} />
          {m.notes?.trim() && <TextBlock label="备注" text={m.notes} />}
        </div>
        <dl className="md-params">
          {params.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
