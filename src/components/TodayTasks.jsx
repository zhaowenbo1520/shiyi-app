import ItemCard from './ItemCard'

export default function TodayTasks({ items, onComplete, onDelete, onPostpone, onChangeType }) {
  return (
    <div className="section today-section">
      <h2 className="section-title">今天</h2>
      {items.length === 0 ? (
        <p className="section-empty">今天先放轻松，想到再记</p>
      ) : (
        <div className="today-items">
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
      )}
    </div>
  )
}
