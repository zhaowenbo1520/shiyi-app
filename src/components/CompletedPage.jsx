import { getDateGroupLabel, formatTime } from '../utils/date'
import { getTypeLabel, getTypeIcon } from '../utils/categorize'

export default function CompletedPage({ groupedItems, onRestore, onDelete }) {
  if (!groupedItems || groupedItems.length === 0) {
    return (
      <div className="page page-completed">
        <div className="page-header">
          <h2 className="page-title">已完成</h2>
        </div>
        <div className="empty-state">
          <p>✨ 还没有完成过事项</p>
          <p className="empty-hint">完成事项后会在这里按日期展示</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page page-completed">
      <div className="page-header">
        <h2 className="page-title">已完成</h2>
      </div>

      <div className="completed-groups">
        {groupedItems.map(([dateStr, items]) => (
          <div key={dateStr} className="completed-group">
            <h3 className="completed-group-title">{getDateGroupLabel(dateStr)}</h3>
            <div className="completed-items">
              {items.map(item => (
                <div key={item.id} className="completed-item">
                  <div className="completed-item-main">
                    <span className="completed-type-badge">
                      {getTypeIcon(item.type)} {getTypeLabel(item.type)}
                    </span>
                    <p className="completed-item-content">{item.content}</p>
                    <span className="completed-item-time">
                      {formatTime(item.completedAt)}
                    </span>
                  </div>
                  <div className="completed-item-actions">
                    <button
                      className="btn btn-xs"
                      onClick={() => onRestore(item.id)}
                    >
                      恢复
                    </button>
                    <button
                      className="btn btn-xs btn-danger-soft"
                      onClick={() => onDelete(item.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
