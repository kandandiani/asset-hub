import { Link, useNavigate } from 'react-router'
import Badge from '../../components/Badge.jsx'
import Icon from '../../components/Icon.jsx'
import { fmtInt, fmtPct } from '../../lib/format.js'
import { ORIENTATIONS, ROW_STATUS } from '../../store/constants.js'

function None() {
  return (
    <span className="vl-none" aria-label="暂无数据">
      —
    </span>
  )
}

function rowMeta({ video, date }) {
  const shape = ORIENTATIONS[video.orientation] + (video.duration ? ` ${video.duration}s` : '')
  return [shape, `v${video.version}`, date || '尚未发布'].join(' · ')
}

function RateCell({ rate }) {
  if (rate == null) return <None />
  return (
    <div className="vl-rate">
      <span className="num">{fmtPct(rate)}</span>
      <span className="progress vl-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} />
      </span>
    </div>
  )
}

function VideoRow({ row, onOpen }) {
  const { video, platform, pub, status } = row
  const to = `/videos/${video.id}`
  const rowStatus = ROW_STATUS[status]
  // The whole row is clickable for pointer users; the Link stays the keyboard target
  return (
    <tr
      onClick={(e) => {
        if (!e.target.closest('a')) onOpen(to)
      }}
    >
      <td>
        <span className="vl-name">{video.title}</span>
        <span className="vl-meta">{rowMeta(row)}</span>
      </td>
      <td>{platform ? <Badge>{platform.label}</Badge> : <span className="vl-none">未选择</span>}</td>
      <td>
        <Badge tone={rowStatus.tone} dot>
          {rowStatus.label}
        </Badge>
      </td>
      <td className="vl-r num">{pub?.views != null ? fmtInt(pub.views) : <None />}</td>
      <td className="vl-r num">{pub?.likes != null ? fmtInt(pub.likes) : <None />}</td>
      <td>
        <RateCell rate={pub?.rate} />
      </td>
      <td>
        <Link
          to={to}
          className="vl-go"
          aria-label={`查看成片详情：${video.title}（${platform ? platform.label : '未选择渠道'}）`}
        >
          <Icon name="arrowRight" size={16} />
        </Link>
      </td>
    </tr>
  )
}

export default function VideoTable({ rows }) {
  const navigate = useNavigate()
  return (
    <table className="vl-table">
      <caption className="sr-only">投产视频成片列表，含渠道、状态、播放、点赞和完播率</caption>
      <colgroup>
        <col />
        <col className="vl-c-channel" />
        <col className="vl-c-status" />
        <col className="vl-c-views" />
        <col className="vl-c-likes" />
        <col className="vl-c-rate" />
        <col className="vl-c-go" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">成片名</th>
          <th scope="col">渠道</th>
          <th scope="col">状态</th>
          <th scope="col" className="vl-r">
            播放
          </th>
          <th scope="col" className="vl-r">
            点赞
          </th>
          <th scope="col">完播率</th>
          <th scope="col">
            <span className="sr-only">操作</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <VideoRow key={row.key} row={row} onOpen={navigate} />
        ))}
      </tbody>
    </table>
  )
}
