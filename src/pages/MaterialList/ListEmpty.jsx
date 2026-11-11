import { Link } from 'react-router'
import { Empty } from '../../components/Basics.jsx'

// No materials at all, or the current filters match nothing
export default function ListEmpty({ hasMaterials, onReset }) {
  if (!hasMaterials) {
    return (
      <Empty
        title="还没有素材记录"
        action={
          <Link to="/materials/new" className="button button-primary">
            记录素材
          </Link>
        }
      >
        生成第一条视频后，在这里登记它的提示词和参数。
      </Empty>
    )
  }
  return (
    <Empty
      title="这个筛选条件下暂时没有素材"
      action={
        <button type="button" className="button button-secondary" onClick={onReset}>
          查看全部素材
        </button>
      }
    >
      换一个状态或关键词，或回到全部素材继续浏览。
    </Empty>
  )
}
