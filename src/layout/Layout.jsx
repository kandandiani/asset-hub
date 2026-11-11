import { Link, Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import { useToast } from '../components/toast-context.js'
import { useStore } from '../store/context.js'
import { materialCounts } from '../store/selectors.js'
import GlobalSearch from './GlobalSearch.jsx'
import './shell.css'

const NAV = [
  { label: null, items: [{ to: '/', text: '总览', match: (p) => p === '/' }] },
  {
    label: '素材与成片',
    items: [
      { to: '/materials', text: '素材记录', match: (p) => p.startsWith('/materials') && p !== '/materials/new', count: true },
      { to: '/materials/new', text: '记录素材', match: (p) => p === '/materials/new' },
      { to: '/assets', text: '资产库', match: (p) => p.startsWith('/assets') },
      { to: '/videos', text: '投产视频', match: (p) => p.startsWith('/videos') },
    ],
  },
  { label: '我的', items: [{ to: '/account', text: '账号管理', match: (p) => p.startsWith('/account') }] },
]

function Topbar({ pathname }) {
  const toast = useToast()
  return (
    <header className="topbar">
      <Link to="/" className="brand-capsule" aria-label="素材中台，回到总览">
        <span className="brand-dot" aria-hidden="true" />
        素材中台
      </Link>
      <GlobalSearch />
      <div className="top-actions">
        <button type="button" className="icon-btn" aria-label="通知" onClick={() => toast('暂无新通知')}>
          <Icon name="bell" />
        </button>
        <button type="button" className="icon-btn" aria-label="设置" onClick={() => toast('设置暂未开放')}>
          <Icon name="settings" />
        </button>
        <Link
          to="/account"
          className="icon-btn"
          aria-label="我的账户"
          aria-current={pathname.startsWith('/account') ? 'page' : undefined}
        >
          <Icon name="user" />
        </Link>
      </div>
    </header>
  )
}

function Sidebar({ pathname }) {
  const { state } = useStore()
  const pending = materialCounts(state).pending
  return (
    <div className="side-col">
      <aside className="side" aria-label="侧边导航">
        {NAV.map((group) => (
          <nav className="side-group" key={group.label || 'main'} aria-label={group.label || '总览'}>
            {group.label && <p className="side-label">{group.label}</p>}
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-item"
                aria-current={item.match(pathname) ? 'page' : undefined}
              >
                {item.text}
                {item.count && pending > 0 && (
                  <span className="nav-count" aria-label={`${pending} 条待筛选`}>
                    {pending}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        ))}
        <div className="side-note">
          <strong>本地数据</strong>
          <p className="cap">数据保存在这台设备的浏览器里，效果数字手工填写。</p>
        </div>
      </aside>
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <Topbar pathname={pathname} />
      <div className="app">
        <Sidebar pathname={pathname} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
