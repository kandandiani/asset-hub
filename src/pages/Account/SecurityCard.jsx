import { useState } from 'react'
import Badge from '../../components/Badge.jsx'
import { useToast } from '../../components/toast-context.js'
import { relDayTime } from '../../lib/format.js'

function Row({ title, sub, children }) {
  return (
    <li className="ac-row ac-sec">
      <div className="ac-row-main">
        <span className="ac-row-title">{title}</span>
        <span className="cap num">{sub}</span>
      </div>
      {children}
    </li>
  )
}

export default function SecurityCard() {
  const toast = useToast()
  const [openedAt] = useState(() => new Date())

  return (
    <section className="card ac-card ac-security in-2">
      <div className="card-head">
        <div>
          <h2>登录与安全</h2>
          <p className="cap">当前为本机版，数据只存在这台设备的浏览器里</p>
        </div>
      </div>
      <ul>
        <Row title="登录密码" sub="本机版不需要登录密码">
          <button
            type="button"
            className="button button-secondary button-sm"
            onClick={() => toast('修改密码需要账号服务，当前版本暂不支持')}
          >
            修改密码
          </button>
        </Row>
        <Row title="当前设备" sub={`${relDayTime(openedAt)} · 这台电脑的浏览器`}>
          <Badge tone="ok" dot>
            当前会话
          </Badge>
        </Row>
        <Row title="数据存储" sub="素材、资产和成片保存在浏览器本地存储，视频文件保存在浏览器数据库">
          <Badge>本机</Badge>
        </Row>
      </ul>
      <div className="ac-foot">
        <p className="cap">清除浏览器数据会一并删除这些记录，请注意备份。</p>
        <button
          type="button"
          className="button button-danger button-sm"
          onClick={() => toast('当前为本机版，无需退出登录')}
        >
          退出登录
        </button>
      </div>
    </section>
  )
}
