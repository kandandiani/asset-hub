import Field from '../../components/Field.jsx'
import CardHead from './CardHead.jsx'

// The notes textarea stretches to the height of the prompt card beside it
export default function NotesCard({ form, className = '' }) {
  return (
    <section className={`card mf-card mf-notes ${className}`} aria-labelledby="mf-g-notes">
      <CardHead id="mf-g-notes" title="备注" caption="记下这条素材的取舍理由、后续想调整的方向。" />
      <Field label="备注内容" htmlFor="mf-notes">
        <textarea
          {...form.bind('notes')}
          className="control"
          placeholder="例如 运镜自然，但结尾人物有轻微形变，可换参考图重试"
        />
      </Field>
    </section>
  )
}
