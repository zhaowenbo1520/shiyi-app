import ItemCard from './ItemCard'

export default function KnowledgeBox({ items, onComplete, onDelete, onPostpone, onChangeType }) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="section">
      <h2 className="section-title">📖 知识库</h2>
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
