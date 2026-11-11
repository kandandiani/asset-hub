import { Link } from 'react-router'

const LINKS = [
  { to: '/materials/new', title: '记录素材', cap: '登记刚生成的视频' },
  { to: '/materials', title: '素材记录', cap: '按状态筛选全部素材' },
  { to: '/assets', title: '资产库', cap: '复用已沉淀的资产' },
  { to: '/videos', title: '投产视频', cap: '对比各平台效果' },
]

export default function QuickCard() {
  return (
    <article className="card card-lift ov-card ov-c-3 in-1" aria-labelledby="ov-quick-title">
      <div className="card-head">
        <h2 id="ov-quick-title">快捷入口</h2>
      </div>
      <nav className="ov-quick" aria-label="快捷入口">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="ov-quick-link">
            <b>{l.title}</b>
            <span className="cap">{l.cap}</span>
          </Link>
        ))}
      </nav>
    </article>
  )
}
