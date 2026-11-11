import { Link, useParams } from 'react-router'
import Badge from '../../components/Badge.jsx'
import { Breadcrumb, Empty } from '../../components/Basics.jsx'
import useTitle from '../../lib/useTitle.js'
import { useStore } from '../../store/context.js'
import { getMaterial } from '../../store/selectors.js'
import BasicCard from './BasicCard.jsx'
import FileCard from './FileCard.jsx'
import NotesCard from './NotesCard.jsx'
import ParamsCard from './ParamsCard.jsx'
import PromptCard from './PromptCard.jsx'
import useMaterialForm from './useMaterialForm.js'
import './MaterialForm.css'

const LEAD_CREATE = '登记一条刚生成的视频素材，连同提示词与关键参数一起留档，之后可在素材记录里回看、筛选或沉淀为资产。'
const LEAD_EDIT = '修改这条素材的名称、提示词与关键参数，保存后回到素材详情查看。'

function PageHead({ material }) {
  return (
    <header className="page-head mf-head in-0">
      <div>
        {material && (
          <Breadcrumb
            items={[
              { label: '素材记录', to: '/materials' },
              { label: material.title, to: `/materials/${material.id}` },
              { label: '编辑' },
            ]}
          />
        )}
        <h1>{material ? '编辑素材' : '记录素材'}</h1>
        <p>{material ? LEAD_EDIT : LEAD_CREATE}</p>
      </div>
      <div className="page-head-side">
        <Badge dot>数据仅保存在本机</Badge>
      </div>
    </header>
  )
}

function Editor({ material }) {
  const form = useMaterialForm(material)
  const busy = form.saving || form.video.status === 'loading'
  return (
    <div className="page">
      <PageHead material={material} />
      <form className="mf-grid" noValidate aria-label={material ? '编辑素材表单' : '素材登记表单'} onSubmit={form.submit}>
        <FileCard video={form.video} className="mf-c5 in-0" />
        <BasicCard form={form} className="mf-c7 in-0" />
        <PromptCard form={form} className="mf-c7 in-1" />
        <NotesCard form={form} className="mf-c5 in-1" />
        <ParamsCard form={form} className="mf-c12 in-1" />
        <div className="card form-actions mf-c12 in-1">
          <p className="cap">标记「必填」的项目为素材名称与提示词，其余可稍后在素材详情中补充。</p>
          <div className="btn-row">
            <Link to={material ? `/materials/${material.id}` : '/materials'} className="button button-secondary">
              取消
            </Link>
            <button type="submit" className="button button-primary" disabled={busy}>
              {form.saving ? '正在保存…' : '保存素材'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Missing() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>编辑素材</h1>
        </div>
      </header>
      <Empty
        title="没有找到这条素材"
        action={
          <Link to="/materials" className="button button-secondary">
            返回素材记录
          </Link>
        }
      >
        它可能已被删除，可以回到素材记录查看其他素材。
      </Empty>
    </div>
  )
}

export default function MaterialForm() {
  const { id } = useParams()
  const { state } = useStore()
  const material = id ? getMaterial(state, id) : null
  useTitle(id ? '编辑素材' : '记录素材')
  if (id && !material) return <Missing />
  // /materials/new and /materials/:id/edit share this component; the key resets the form between them
  return <Editor key={id || 'new'} material={material} />
}
