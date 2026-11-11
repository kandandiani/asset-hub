// Card heading with a caption; `id` labels the surrounding <section>
export default function CardHead({ id, title, caption }) {
  return (
    <div className="card-head">
      <div>
        <h2 id={id}>{title}</h2>
        <p className="cap">{caption}</p>
      </div>
    </div>
  )
}
