import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../../components/toast-context.js'
import { useStore } from '../../store/context.js'
import { deleteFile, putFile } from '../../store/files.js'
import { buildData, FOCUS_ORDER, initialValues, validate, videoFields } from './form-utils.js'
import useVideoFile from './useVideoFile.js'

// Form state, validation and saving; `material` is null when recording a new one
export default function useMaterialForm(material) {
  const { actions } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [values, setValues] = useState(() => initialValues(material))
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const video = useVideoFile(material, (info) => setValues((v) => ({ ...v, ...videoFields(info, v) })))
  // Errors appear after the first submit, then follow every change
  const errors = submitted ? validate(values) : {}

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }))
  const bind = (key) => ({
    id: `mf-${key}`,
    name: key,
    value: values[key],
    onChange: (e) => set(key, e.target.value),
    'aria-invalid': errors[key] ? true : undefined,
  })

  async function save() {
    const data = buildData(values, video.cover)
    const { file } = video
    let id = material?.id
    if (id) {
      const patch = file ? { hasFile: true } : video.removed ? { hasFile: false, cover: null } : {}
      actions.updateMaterial(id, { ...data, ...patch })
      if (!file && video.removed) deleteFile(id).catch(() => {})
    } else {
      id = actions.addMaterial({ ...data, hasFile: Boolean(file) })
    }
    let message = material ? '修改已保存' : '素材已登记，并保存到本机'
    if (file) {
      try {
        await putFile(id, file)
      } catch {
        actions.updateMaterial(id, { hasFile: false })
        message = '视频文件没有保存成功，已只保存文字信息'
      }
    }
    navigate(`/materials/${id}`, { replace: true })
    toast(message)
  }

  function submit(e) {
    e.preventDefault()
    if (saving || video.status === 'loading') return
    setSubmitted(true)
    const found = validate(values)
    const first = FOCUS_ORDER.find((key) => found[key])
    if (first) {
      e.currentTarget.elements.namedItem(first)?.focus()
      return
    }
    setSaving(true)
    save()
  }

  return { values, errors, set, bind, video, saving, submit }
}
