import ItemCard from './ItemCard'

export default function IdeaBox({ items, onComplete, onDelete, onPostpone, onChangeType }) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="section">
      <h2 className="section-title">💡 灵感先放这</h2>
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
