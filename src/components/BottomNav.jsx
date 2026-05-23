export default function BottomNav({ activeTab, onTabChange, completedCount }) {
  const tabs = [
    { key: 'home', label: '首页', icon: '◉' },
    { key: 'categories', label: '分类', icon: '⊞' },
    { key: 'completed', label: '已完成', icon: '✓', badge: completedCount }
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
          {tab.badge > 0 && activeTab !== tab.key && (
            <span className="nav-badge">{tab.badge}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
