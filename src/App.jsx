import { useState, useEffect, useCallback } from 'react'
import {
  getRecords,
  addRecord,
  completeRecord,
  deleteRecord,
  postponeRecord as postponeInStorage,
  changeType as changeTypeInStorage,
  getTodayTasks,
  getReminderItems,
  getShoppingItems,
  getIdeaItems,
  getKnowledgeItems,
  getCollectionItems
} from './utils/storage'
import QuickRecord from './components/QuickRecord'
import TodayTasks from './components/TodayTasks'
import ReminderList from './components/ReminderList'
import ShoppingList from './components/ShoppingList'
import IdeaBox from './components/IdeaBox'
import KnowledgeBox from './components/KnowledgeBox'
import CollectionBox from './components/CollectionBox'
import './App.css'

export default function App() {
  const [todayTasks, setTodayTasks] = useState([])
  const [reminderItems, setReminderItems] = useState([])
  const [shoppingItems, setShoppingItems] = useState([])
  const [ideaItems, setIdeaItems] = useState([])
  const [knowledgeItems, setKnowledgeItems] = useState([])
  const [collectionItems, setCollectionItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  function refresh() {
    setTodayTasks(getTodayTasks())
    setReminderItems(getReminderItems())
    setShoppingItems(getShoppingItems())
    setIdeaItems(getIdeaItems())
    setKnowledgeItems(getKnowledgeItems())
    setCollectionItems(getCollectionItems())
    setTotalCount(getRecords().filter(r => !r.completed).length)
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

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">拾遗</h1>
        <p className="app-subtitle">外部记忆助手</p>
        {totalCount > 0 && (
          <span className="app-count">{totalCount} 件事待处理</span>
        )}
      </header>

      <main className="app-main">
        <QuickRecord onSave={handleSave} />

        <TodayTasks
          items={todayTasks}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        <ReminderList
          items={reminderItems}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        <ShoppingList
          items={shoppingItems}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        <IdeaBox
          items={ideaItems}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        <KnowledgeBox
          items={knowledgeItems}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        <CollectionBox
          items={collectionItems}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
          onChangeType={handleChangeType}
        />

        {totalCount === 0 && (
          <div className="empty-state">
            <p>✨ 目前没有待处理的事项</p>
            <p className="empty-hint">想到什么就记下来吧</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>拾遗 · 你的外部记忆助手</p>
      </footer>
    </div>
  )
}
