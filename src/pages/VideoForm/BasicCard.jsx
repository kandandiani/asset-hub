import Field from '../../components/Field.jsx'
import { ORIENTATIONS } from '../../store/constants.js'
import { TITLE_MAX, parseVersion } from './form-model.js'

export default function BasicCard({ form, errors, onChange }) {
  const version = parseVersion(form.version)
  const inputProps = (name) => ({
    id: `vf-${name}`,
    name,
    className: 'control',
    value: form[name],
    autoComplete: 'off',
    'aria-invalid': Boolean(errors[name]),
    onChange: (e) => onChange({ [name]: e.target.value }),
  })

  return (
    <section className="card vf-card vf-c7 in-1" aria-labelledby="vf-basic-title">
      <div className="card-head">
        <div>
          <h2 id="vf-basic-title">基本信息</h2>
          <p className="cap">成片名称和版本会显示在投产视频列表里。</p>
        </div>
      </div>
      <Field label="成片名称" htmlFor="vf-title" required error={errors.title}>
        {/* The hard cap sits above the limit so an over-long title gets the error instead of being cut silently */}
        <input {...inputProps('title')} maxLength={TITLE_MAX * 2} placeholder="例如 雨夜霓虹街角" aria-required="true" />
      </Field>
      <div className="cols-3">
        <Field
          label="版本"
          htmlFor="vf-version"
          hint={version ? `显示为「成片 v${version}」` : '填写不小于 1 的整数'}
          error={errors.version}
        >
          <input {...inputProps('version')} className="control num" type="number" min="1" step="1" inputMode="numeric" />
        </Field>
        <Field label="画幅" labelId="vf-orientation-label">
          <div className="check-chips vf-orient" role="radiogroup" aria-labelledby="vf-orientation-label">
            {Object.entries(ORIENTATIONS).map(([key, label]) => (
              <label key={key} className="check-chip">
                <input
                  type="radio"
                  name="orientation"
                  value={key}
                  checked={form.orientation === key}
                  onChange={() => onChange({ orientation: key })}
                />
                {label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="时长（秒）" htmlFor="vf-duration" error={errors.duration}>
          <input
            {...inputProps('duration')}
            className="control num"
            type="number"
            min="1"
            max="600"
            step="1"
            inputMode="numeric"
            placeholder="例如 15"
          />
        </Field>
      </div>
    </section>
  )
}
