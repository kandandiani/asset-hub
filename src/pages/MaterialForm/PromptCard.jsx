import Field from '../../components/Field.jsx'
import CardHead from './CardHead.jsx'

export default function PromptCard({ form, className = '' }) {
  const { errors, bind } = form
  return (
    <section className={`card mf-card ${className}`} aria-labelledby="mf-g-prompt">
      <CardHead id="mf-g-prompt" title="提示词" caption="直接粘贴生成时使用的完整提示词，保留原文便于复现。" />
      <div className="mf-fields">
        <Field label="提示词" htmlFor="mf-prompt" required error={errors.prompt}>
          <textarea
            {...bind('prompt')}
            className="control"
            rows={6}
            placeholder="粘贴提示词原文，例如镜头、主体、光线、运动与风格描述"
            aria-required="true"
          />
        </Field>
        <Field label="反向提示词" htmlFor="mf-negative">
          <textarea {...bind('negative')} className="control" rows={2} placeholder="需要避开的内容，没有可留空" />
        </Field>
      </div>
    </section>
  )
}
