import ItemCard from './ItemCard'

export default function TodayTasks({ items, onComplete, onDelete, onPostpone, onChangeType }) {
  if (items.length === 0) {
    return (
      <div className="section">
        <h2 className="section-title">✨ 今天先做这几件</h2>
        <p className="empty-hint">暂时没有要处理的事，放松一下~</p>
      </div>
    )
  }

  return (
    <div className="section">
      <h2 className="section-title">✨ 今天先做这几件</h2>
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onComplete={onComplete}
          onDelete={onDelete}
          onPostpone={onPostpone}
          onChangeType={onChangeType}
        />
      ))}
    </div>
  )
}
