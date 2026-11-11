import { Link } from 'react-router'

const STEPS = ['在素材记录里打开一条素材', '点「沉淀为资产」', '回到资产库按类型复用']

export default function AssetHint() {
  return (
    <section className="card al-hint in-2" aria-labelledby="al-hint-title">
      <div className="al-hint-body">
        <h2 id="al-hint-title">提示说明</h2>
        <ol className="al-steps">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="cap">资产来自素材记录里的「沉淀为资产」。数据保存在这台设备的浏览器里。</p>
      </div>
      <Link to="/materials?status=picked" className="button button-primary">
        前往素材记录
      </Link>
    </section>
  )
}
