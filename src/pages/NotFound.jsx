import { Link } from 'react-router'
import { Empty } from '../components/Basics.jsx'
import useTitle from '../lib/useTitle.js'

export default function NotFound() {
  useTitle('页面不存在')
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>页面不存在</h1>
          <p>链接可能已经失效，或者对应的记录已被删除。</p>
        </div>
      </header>
      <Empty
        title="没有找到这个页面"
        action={
          <Link to="/" className="button button-secondary">
            回到总览
          </Link>
        }
      >
        可以从左侧导航进入其他页面。
      </Empty>
    </div>
  )
}
