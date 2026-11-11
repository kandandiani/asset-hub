import Badge from '../../components/Badge.jsx'
import useTitle from '../../lib/useTitle.js'
import PlatformCard from './PlatformCard.jsx'
import ProfileCard from './ProfileCard.jsx'
import SecurityCard from './SecurityCard.jsx'
import './Account.css'

export default function Account() {
  useTitle('账号管理')
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>账号管理</h1>
          <p>管理你的个人资料、绑定的发布平台账号和本机数据。</p>
        </div>
        <div className="page-head-side">
          <Badge dot>数据仅保存在本机</Badge>
        </div>
      </header>
      <div className="ac-bento">
        <ProfileCard />
        <PlatformCard />
        <SecurityCard />
      </div>
    </div>
  )
}
