import { useState, useEffect, useCallback, useRef } from 'react'
import SplashScreen from './components/SplashScreen'

const MIN_SPLASH_TIME = 2200
import {
  getRecords,
  addRecord,
  completeRecord,
  deleteRecord,
  postponeRecord as postponeInStorage,
  changeType as changeTypeInStorage,
  restoreRecord as restoreInStorage,
  getTodayTasks,
  getReminderItems,
  getShoppingItems,
  getIdeaItems,
  getKnowledgeItems,
  getCollectionItems,
  getCompletedItemsGrouped,
  getTodayCompletedCount
} from './utils/storage'
import { getTypeIcon, getTypeLabel } from './utils/categorize'
import QuickRecord from './components/QuickRecord'
import TodayTasks from './components/TodayTasks'
import ItemCard from './components/ItemCard'
import CompletedPage from './components/CompletedPage'
import BottomNav from './components/BottomNav'
import './App.css'

const CATEGORY_ENTRIES = [
  { type: 'reminder', icon: '⏰', label: '提醒', desc: '该提醒的事会在这里' },
  { type: 'shopping', icon: '🛒', label: '购物', desc: '暂时没有要买的' },
  { type: 'idea', icon: '💡', label: '想法', desc: '灵感来了就放这里' },
  { type: 'knowledge', icon: '📖', label: '知识', desc: '值得记住的东西会在这里' },
  { type: 'inbox', icon: '📥', label: '收集箱', desc: '暂时没有未分类内容' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [todayTasks, setTodayTasks] = useState([])
  const [reminderItems, setReminderItems] = useState([])
  const [shoppingItems, setShoppingItems] = useState([])
  const [ideaItems, setIdeaItems] = useState([])
  const [knowledgeItems, setKnowledgeItems] = useState([])
  const [collectionItems, setCollectionItems] = useState([])
  const [completedGrouped, setCompletedGrouped] = useState([])
  const [todayCompletedCount, setTodayCompletedCount] = useState(0)
  const [incompleteCount, setIncompleteCount] = useState(0)
  const [showSplash, setShowSplash] = useState(true)

  // Guard: don't hide splash before MIN_SPLASH_TIME even if data loads early
  // Uses Date.now() absolute timing so the minimum display time is guaranteed
  // regardless of when React mounts the component.
  const splashStartRef = useRef(Date.now())
  const splashGuardRef = useRef(false)

  function refresh() {
    setTodayTasks(getTodayTasks())
    setReminderItems(getReminderItems())
    setShoppingItems(getShoppingItems())
    setIdeaItems(getIdeaItems())
    setKnowledgeItems(getKnowledgeItems())
    setCollectionItems(getCollectionItems())
    setCompletedGrouped(getCompletedItemsGrouped())
    setTodayCompletedCount(getTodayCompletedCount())
    setIncompleteCount(getRecords().filter(r => !r.completed).length)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSave = useCallback((content) => {
    addRecord(content)
    refresh()
  }, [])

  const handleComplete = useCallback((id) => {
    completeRecord(id)
    refresh()
  }, [])

  const handleDelete = useCallback((id) => {
    deleteRecord(id)
    refresh()
  }, [])

  const handlePostpone = useCallback((id) => {
    postponeInStorage(id)
    refresh()
  }, [])

  const handleChangeType = useCallback((id, newType) => {
    changeTypeInStorage(id, newType)
    refresh()
  }, [])

  const handleRestore = useCallback((id) => {
    restoreInStorage(id)
    refresh()
  }, [])

  function getCategoryCount(type) {
    const map = {
      reminder: reminderItems.length,
      shopping: shoppingItems.length,
      idea: ideaItems.filter(r => !r.completed).length,
      knowledge: knowledgeItems.filter(r => !r.completed).length,
      inbox: collectionItems.filter(r => r.type === 'inbox').length
    }
    return map[type] || 0
  }

  function getCategoryDesc(type, count) {
    if (count > 0) return `${count} 条待处理`
    const defaults = {
      reminder: '该提醒的事会在这里',
      shopping: '暂时没有要买的',
      idea: '灵感来了就放这里',
      knowledge: '值得记住的东西会在这里',
      inbox: '暂时没有未分类内容'
    }
    return defaults[type] || ''
  }

  return (
    <>
      {showSplash && (
        <SplashScreen
          onFinish={() => {
            // Guard: only hide splash when minimum display time has elapsed.
            // Uses absolute Date.now() to avoid setTimeout drift issues.
            if (splashGuardRef.current) return
            const elapsed = Date.now() - splashStartRef.current
            if (elapsed >= MIN_SPLASH_TIME) {
              splashGuardRef.current = true
              setShowSplash(false)
            } else {
              // Timer fired early — retry after remaining time
              setTimeout(() => {
                splashGuardRef.current = true
                setShowSplash(false)
              }, MIN_SPLASH_TIME - elapsed)
            }
          }}
        />
      )}
      {!showSplash && (
        <div className="app">
          {/* 首页 */}
          {activeTab === 'home' && (
        <main className="app-main">
          <div className="home-header">
            <h1 className="home-title">拾遗</h1>
            <p className="home-subtitle">外部记忆助手</p>
          </div>

          <QuickRecord onSave={handleSave} />

          <TodayTasks
            items={todayTasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onPostpone={handlePostpone}
            onChangeType={handleChangeType}
          />

          {/* 分类入口 */}
          <div className="section category-entries">
            <h2 className="section-title">分类</h2>
            {CATEGORY_ENTRIES.map(entry => {
              const count = getCategoryCount(entry.type)
              return (
                <button
                  key={entry.type}
                  className="category-entry"
                  onClick={() => setActiveTab('categories')}
                >
                  <span className="category-entry-icon">{entry.icon}</span>
                  <div className="category-entry-body">
                    <span className="category-entry-name">{entry.label}</span>
                    <span className="category-entry-desc">
                      {getCategoryDesc(entry.type, count)}
                    </span>
                  </div>
                  {count > 0 && (
                    <span className="category-entry-count">{count}</span>
                  )}
                  <span className="category-entry-arrow">›</span>
                </button>
              )
            })}
          </div>

          {/* 已完成入口 */}
          <button
            className="completed-entry"
            onClick={() => setActiveTab('completed')}
          >
            <span className="completed-entry-icon">✓</span>
            <div className="completed-entry-body">
              <span className="completed-entry-name">已完成</span>
              <span className="completed-entry-desc">
                今天已完成 {todayCompletedCount} 条
              </span>
            </div>
            <span className="completed-entry-arrow">›</span>
          </button>
        </main>
      )}

      {/* 分类页面 */}
      {activeTab === 'categories' && (
        <main className="app-main">
          <div className="page-header">
            <h2 className="page-title">分类</h2>
          </div>

          {reminderItems.length > 0 && (
            <div className="section">
              <h2 className="section-title">⏰ 提醒</h2>
              {reminderItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPostpone={handlePostpone}
                  onChangeType={handleChangeType}
                />
              ))}
            </div>
          )}

          {shoppingItems.length > 0 && (
            <div className="section">
              <h2 className="section-title">🛒 购物</h2>
              {shoppingItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPostpone={handlePostpone}
                  onChangeType={handleChangeType}
                />
              ))}
            </div>
          )}

          {ideaItems.length > 0 && (
            <div className="section">
              <h2 className="section-title">💡 想法</h2>
              {ideaItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPostpone={handlePostpone}
                  onChangeType={handleChangeType}
                />
              ))}
            </div>
          )}

          {knowledgeItems.length > 0 && (
            <div className="section">
              <h2 className="section-title">📖 知识</h2>
              {knowledgeItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPostpone={handlePostpone}
                  onChangeType={handleChangeType}
                />
              ))}
            </div>
          )}

          {collectionItems.length > 0 && (
            <div className="section">
              <h2 className="section-title">📥 收集箱</h2>
              {collectionItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPostpone={handlePostpone}
                  onChangeType={handleChangeType}
                />
              ))}
            </div>
          )}

          {reminderItems.length === 0 &&
            shoppingItems.length === 0 &&
            ideaItems.length === 0 &&
            knowledgeItems.length === 0 &&
            collectionItems.length === 0 && (
              <div className="empty-state">
                <p>✨ 目前没有待处理的事项</p>
                <p className="empty-hint">想到什么就记下来吧</p>
              </div>
            )}
        </main>
      )}

      {/* 已完成页面 */}
      {activeTab === 'completed' && (
        <CompletedPage
          groupedItems={completedGrouped}
          onRestore={handleRestore}
          onDelete={handleDelete}
        />
      )}

      {/* 底部导航 */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedCount={todayCompletedCount}
      />
    </div>
      )}
    </>
  )
}
