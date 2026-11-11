import { useId, useState } from 'react'
import Badge from '../../components/Badge.jsx'
import Field from '../../components/Field.jsx'
import { useToast } from '../../components/toast-context.js'
import { fmtDay } from '../../lib/format.js'
import { useStore } from '../../store/context.js'

const NICK_MAX = 20
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ nickname, email }) {
  const nick = nickname.trim()
  return {
    nickname: !nick || nick.length > NICK_MAX ? '请填写昵称（最多 20 个字）' : '',
    email: EMAIL_RE.test(email.trim()) ? '' : '请输入有效的邮箱地址',
  }
}

export default function ProfileCard() {
  const { state, actions } = useStore()
  const toast = useToast()
  const { nickname, email, joinedAt, timezone } = state.account
  const [draft, setDraft] = useState(null) // null while viewing
  const [submitted, setSubmitted] = useState(false)
  // Once the form has closed, the remounted 编辑资料 button takes focus back
  const [refocus, setRefocus] = useState(false)
  const nickId = useId()
  const mailId = useId()

  const errors = draft && submitted ? validate(draft) : {}
  const change = (key) => (e) => setDraft({ ...draft, [key]: e.target.value })

  const startEdit = () => {
    setDraft({ nickname, email })
    setSubmitted(false)
  }
  const stopEdit = () => {
    setDraft(null)
    setRefocus(true)
  }
  const submit = (e) => {
    e.preventDefault()
    const errs = validate(draft)
    if (errs.nickname || errs.email) {
      setSubmitted(true)
      e.currentTarget.elements[errs.nickname ? 'nickname' : 'email'].focus()
      return
    }
    actions.updateAccount({ nickname: draft.nickname.trim(), email: draft.email.trim() })
    toast('资料已保存')
    stopEdit()
  }

  const facts = [
    ['账号类型', '个人版'],
    ['加入时间', fmtDay(joinedAt)],
    ['时区', timezone || '—'],
  ]

  return (
    <section className="card ac-card ac-profile in-0">
      <div className="card-head">
        <div>
          <h2>个人资料</h2>
          <p className="cap">你在素材中台里显示的身份信息</p>
        </div>
        {!draft && (
          <button type="button" className="button button-primary button-sm" autoFocus={refocus} onClick={startEdit}>
            编辑资料
          </button>
        )}
      </div>
      {draft ? (
        <form className="ac-edit" onSubmit={submit} noValidate>
          <Field label="昵称" htmlFor={nickId} required error={errors.nickname}>
            <input
              id={nickId}
              name="nickname"
              className="control"
              type="text"
              value={draft.nickname}
              onChange={change('nickname')}
              maxLength={NICK_MAX}
              autoComplete="off"
              autoFocus
              required
              aria-invalid={Boolean(errors.nickname)}
            />
          </Field>
          <Field label="邮箱" htmlFor={mailId} error={errors.email}>
            <input
              id={mailId}
              name="email"
              className="control"
              type="email"
              value={draft.email}
              onChange={change('email')}
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
          <div className="ac-edit-actions">
            <button type="button" className="button button-secondary" onClick={stopEdit}>
              取消
            </button>
            <button type="submit" className="button button-primary">
              保存资料
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="ac-identity">
            <span className="ac-avatar" aria-hidden="true">
              {Array.from(nickname.trim())[0] || '?'}
            </span>
            <div className="ac-who">
              <p className="ac-name">{nickname}</p>
              <p className="ac-mail">{email}</p>
              <Badge>个人使用</Badge>
            </div>
          </div>
          <dl className="ac-facts">
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  )
}
