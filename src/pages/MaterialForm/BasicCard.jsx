import Dropdown from '../../components/Dropdown.jsx'
import Field from '../../components/Field.jsx'
import { MATERIAL_STATUS, MATERIAL_STATUS_KEYS } from '../../store/constants.js'
import { useStore } from '../../store/context.js'
import { seriesOptions } from '../../store/selectors.js'
import CardHead from './CardHead.jsx'

const STATUS_OPTIONS = MATERIAL_STATUS_KEYS.map((key) => ({ value: key, label: MATERIAL_STATUS[key].label }))

export default function BasicCard({ form, className = '' }) {
  const { state } = useStore()
  const { values, errors, set, bind } = form

  return (
    <section className={`card mf-card ${className}`} aria-labelledby="mf-g-basic">
      <CardHead id="mf-g-basic" title="基本信息" caption="名称用于在素材记录中检索，所属系列便于成组回看。" />
      <div className="mf-fields">
        <Field label="素材名称" htmlFor="mf-title" required error={errors.title}>
          <input
            {...bind('title')}
            type="text"
            className="control"
            maxLength={60}
            placeholder="例如 晨雾山林 · 航拍推近 v3"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <div className="cols-2">
          <Field label="所属系列" htmlFor="mf-series" hint="素材可归入系列，之后可调整。">
            <input
              {...bind('series')}
              type="text"
              className="control"
              list="mf-series-list"
              placeholder="未归入系列"
              autoComplete="off"
            />
            <datalist id="mf-series-list">
              {seriesOptions(state).map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </Field>
          <Field label="状态" labelId="mf-status-label" hint="刚生成的素材默认待筛选。">
            <Dropdown
              id="mf-status"
              value={values.status}
              options={STATUS_OPTIONS}
              onChange={(value) => set('status', value)}
              ariaLabel="状态"
              ariaLabelledby="mf-status-label mf-status"
            />
          </Field>
        </div>
        <div className="cols-2">
          <Field label="生成日期" htmlFor="mf-date">
            <input {...bind('date')} type="date" className="control" />
          </Field>
          <Field label="标签" htmlFor="mf-tags">
            <input {...bind('tags')} type="text" className="control" placeholder="例如 航拍，雾，推近" autoComplete="off" />
          </Field>
        </div>
      </div>
    </section>
  )
}
