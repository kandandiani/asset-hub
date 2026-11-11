import { Link, useParams } from 'react-router'
import { Breadcrumb, Empty } from '../../components/Basics.jsx'
import useTitle from '../../lib/useTitle.js'
import { useStore } from '../../store/context.js'
import { assetForMaterial, getMaterial, videosUsingMaterial } from '../../store/selectors.js'
import DetailHeader from './DetailHeader.jsx'
import PreviewCard from './PreviewCard.jsx'
import PromptCard from './PromptCard.jsx'
import RelatedVideos from './RelatedVideos.jsx'
import './MaterialDetail.css'

const CRUMBS = [{ label: '素材记录', to: '/materials' }, { label: '素材详情' }]

function HintCard() {
  return (
    <section className="card md-hint in-1" aria-labelledby="md-hint-title">
      <h2 id="md-hint-title">沉淀为资产之后</h2>
      <p>素材会进入资产库，之后制作新的投产视频时可以直接复用；这条素材记录和它的提示词、参数会原样保留。</p>
      <Link to="/assets" className="button button-secondary button-sm">
        前往资产库
      </Link>
    </section>
  )
}

export default function MaterialDetail() {
  const { id } = useParams()
  const { state } = useStore()
  const m = getMaterial(state, id)
  useTitle(m ? m.title : '素材详情')

  if (!m) {
    return (
      <div className="page">
        <Breadcrumb items={CRUMBS} />
        <h1 className="sr-only">素材详情</h1>
        <Empty
          title="这条素材不存在或已被删除"
          action={
            <Link to="/materials" className="button button-secondary">
              返回素材记录
            </Link>
          }
        />
      </div>
    )
  }

  const asset = assetForMaterial(state, id)
  const videos = videosUsingMaterial(state, id)
  // Keyed by id: opening another material (search, history) starts with playback stopped and the modal closed
  return (
    <div className="page" key={m.id}>
      <Breadcrumb items={CRUMBS} />
      <DetailHeader m={m} asset={asset} videoCount={videos.length} />
      <div className="md-body">
        <div className="md-col">
          <PreviewCard m={m} />
          <PromptCard m={m} />
        </div>
        <div className="md-col">
          <RelatedVideos materialId={m.id} videos={videos} />
          <HintCard />
        </div>
      </div>
    </div>
  )
}
