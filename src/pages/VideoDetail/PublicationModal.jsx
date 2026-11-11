import Modal from '../../components/Modal.jsx'
import PublicationForm from './PublicationForm.jsx'

// platformKey presets the platform (null = let the user pick); the form remounts on every opening
export default function PublicationModal({ open, video, platformKey, onClose }) {
  return (
    <Modal
      open={open}
      title="发布与效果数据"
      description="数据只保存在本机，效果数字手工填写。"
      onClose={onClose}
      width={560}
    >
      {open && <PublicationForm video={video} platformKey={platformKey} onClose={onClose} />}
    </Modal>
  )
}
