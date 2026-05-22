import ItemCard from './ItemCard'

export default function CollectionBox({ items, onComplete, onDelete, onPostpone, onChangeType }) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="section">
      <h2 className="section-title">📦 收集箱</h2>
      <p className="section-desc">暂时没顾上的事项，先放在这里</p>
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
