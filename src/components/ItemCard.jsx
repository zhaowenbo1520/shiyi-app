import { useState } from 'react'
import { getTypeLabel, getTypeIcon } from '../utils/categorize'
import { formatTime } from '../utils/date'

const TYPE_OPTIONS = [
  { value: 'task', label: '待办' },
  { value: 'reminder', label: '提醒' },
  { value: 'shopping', label: '购物' },
  { value: 'idea', label: '想法' },
  { value: 'knowledge', label: '知识' },
  { value: 'inbox', label: '收集箱' }
]

export default function ItemCard({ item, onComplete, onDelete, onPostpone, onChangeType }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showTypePicker, setShowTypePicker] = useState(false)
  const isCompleted = item.completed

  function handleComplete() {
    setShowMenu(false)
    onComplete(item.id)
  }

  function handleDelete() {
    setShowMenu(false)
    onDelete(item.id)
  }

  function handlePostpone() {
    setShowMenu(false)
    onPostpone(item.id)
  }

  function handleChangeType(newType) {
    setShowTypePicker(false)
    setShowMenu(false)
    onChangeType(item.id, newType)
  }

  const typeLabel = getTypeLabel(item.type)
  const typeIcon = getTypeIcon(item.type)

  if (isCompleted) {
    return (
      <div className="item-card completed">
        <div className="item-main">
          <span className="item-type-badge">{typeIcon} {typeLabel}</span>
          <p className="item-content">{item.content}</p>
          {item.completedAt && (
            <span className="item-time">{formatTime(item.completedAt)}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="item-card">
      <div className="item-main">
        <span className="item-type-badge">{typeIcon} {typeLabel}</span>
        <p className="item-content">{item.content}</p>
        <button
          className="btn-icon"
          onClick={() => { setShowMenu(!showMenu); setShowTypePicker(false) }}
          aria-label="更多操作"
        >
          ···
        </button>
      </div>

      {showMenu && (
        <div className="item-menu">
          <button className="btn btn-soft btn-complete" onClick={handleComplete}>
            已完成
          </button>
          <button className="btn btn-soft" onClick={handlePostpone}>
            明天再说
          </button>
          <button
            className="btn btn-soft"
            onClick={() => setShowTypePicker(!showTypePicker)}
          >
            改分类
          </button>
          <button className="btn btn-soft btn-danger-soft" onClick={handleDelete}>
            删除
          </button>
        </div>
      )}

      {showTypePicker && (
        <div className="type-picker">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`btn btn-sm ${item.type === opt.value ? 'active' : ''}`}
              onClick={() => handleChangeType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {item.postponedUntil && (
        <div className="item-meta">
          推迟到 {item.postponedUntil}
        </div>
      )}
    </div>
  )
}
