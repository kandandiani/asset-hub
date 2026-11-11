import Dropdown from '../../components/Dropdown.jsx'
import Field from '../../components/Field.jsx'
import { MODELS, RATIOS, RESOLUTIONS } from '../../store/constants.js'
import CardHead from './CardHead.jsx'

const MODEL_OPTIONS = [{ value: '', label: '不填写' }, ...MODELS]

function SelectField({ form, name, label, options, placeholder }) {
  const labelId = `mf-${name}-label`
  return (
    <Field label={label} labelId={labelId}>
      <Dropdown
        id={`mf-${name}`}
        value={form.values[name]}
        options={options}
        placeholder={placeholder}
        onChange={(value) => form.set(name, value)}
        ariaLabel={label}
        ariaLabelledby={`${labelId} mf-${name}`}
      />
    </Field>
  )
}

export default function ParamsCard({ form, className = '' }) {
  const { errors, bind } = form
  return (
    <section className={`card mf-card ${className}`} aria-labelledby="mf-g-params">
      <CardHead
        id="mf-g-params"
        title="模型与关键参数"
        caption="记录生成所用模型和影响结果的主要参数，方便之后对比同一提示词的不同产出。"
      />
      <div className="cols-4">
        <SelectField form={form} name="model" label="模型" options={MODEL_OPTIONS} placeholder="选择模型" />
        <SelectField form={form} name="resolution" label="分辨率" options={RESOLUTIONS} />
        <SelectField form={form} name="ratio" label="画幅" options={RATIOS} />
        <Field label="时长（秒）" htmlFor="mf-duration" error={errors.duration}>
          <input
            {...bind('duration')}
            type="number"
            className="control num"
            min={1}
            max={120}
            step={1}
            inputMode="numeric"
            placeholder="例如 8"
          />
        </Field>
        <Field label="帧率（fps）" htmlFor="mf-fps" error={errors.fps}>
          <input
            {...bind('fps')}
            type="number"
            className="control num"
            min={1}
            max={240}
            step="any"
            inputMode="decimal"
            placeholder="例如 24"
          />
        </Field>
        <Field label="Seed" htmlFor="mf-seed">
          <input {...bind('seed')} type="text" className="control" placeholder="随机则留空" autoComplete="off" />
        </Field>
        <Field label="其他参数" htmlFor="mf-extra" className="span-2">
          <input
            {...bind('extra')}
            type="text"
            className="control"
            placeholder="例如 运镜：缓慢推近；风格强度 0.7；参考图 1 张"
            autoComplete="off"
          />
        </Field>
      </div>
    </section>
  )
}
