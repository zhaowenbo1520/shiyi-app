import { categorize } from './categorize'

const STORAGE_KEY = 'shiyi-records'

/**
 * 生成唯一 ID
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

/**
 * 获取今天的日期字符串（YYYY-MM-DD）
 */
function getTodayStr() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取明天的日期字符串
 */
export function getTomorrowStr() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 从 localStorage 读取所有记录
 */
export function getRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 保存所有记录到 localStorage
 */
function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error('保存失败:', e)
  }
}

/**
 * 新增一条记录
 */
export function addRecord(content) {
  if (!content || !content.trim()) return null

  const now = new Date().toISOString()
  const trimmed = content.trim()
  const type = categorize(trimmed)

  const record = {
    id: generateId(),
    content: trimmed,
    type,
    completed: false,
    createdAt: now,
    updatedAt: now,
    postponedUntil: null,
    remindText: null,
    originalText: trimmed
  }

  const records = getRecords()
  records.unshift(record)
  saveRecords(records)
  return record
}

/**
 * 更新一条记录
 */
export function updateRecord(id, updates) {
  const records = getRecords()
  const index = records.findIndex(r => r.id === id)
  if (index === -1) return null

  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  saveRecords(records)
  return records[index]
}

/**
 * 删除一条记录
 */
export function deleteRecord(id) {
  const records = getRecords()
  const filtered = records.filter(r => r.id !== id)
  if (filtered.length === records.length) return false
  saveRecords(filtered)
  return true
}

/**
 * 标记为完成
 */
export function completeRecord(id) {
  return updateRecord(id, { completed: true })
}

/**
 * 推迟到明天
 */
export function postponeRecord(id) {
  return updateRecord(id, { postponedUntil: getTomorrowStr() })
}

/**
 * 修改分类
 */
export function changeType(id, newType) {
  return updateRecord(id, { type: newType })
}

/**
 * 获取今日待办（最多 3 条）
 * 规则：未完成的 task，未被推迟到明天或更晚
 */
export function getTodayTasks() {
  const records = getRecords()
  const today = getTodayStr()

  return records
    .filter(r => {
      if (r.completed) return false
      if (r.type !== 'task') return false
      if (r.postponedUntil && r.postponedUntil > today) return false
      return true
    })
    .slice(0, 3)
}

/**
 * 获取提醒列表
 */
export function getReminderItems() {
  const records = getRecords()
  const today = getTodayStr()

  return records.filter(r => {
    if (r.completed) return false
    if (r.type !== 'reminder') return false
    if (r.postponedUntil && r.postponedUntil > today) return false
    return true
  })
}

/**
 * 获取购物清单
 */
export function getShoppingItems() {
  const records = getRecords()
  return records.filter(r => r.type === 'shopping' && !r.completed)
}

/**
 * 获取想法列表（含已完成，想法永不消失）
 */
export function getIdeaItems() {
  const records = getRecords()
  return records.filter(r => r.type === 'idea')
}

/**
 * 获取知识列表（含已完成，知识需要随时查阅）
 */
export function getKnowledgeItems() {
  const records = getRecords()
  return records.filter(r => r.type === 'knowledge')
}

/**
 * 获取收集箱内容
 * 规则：inbox 类型未完成事项 + 其他未展示的未完成剩余事项
 */
export function getCollectionItems() {
  const records = getRecords()
  const today = getTodayStr()

  // 今日已展示的 task ID（前 3 条）
  const todayTaskIds = new Set(
    records
      .filter(r => {
        if (r.completed) return false
        if (r.type !== 'task') return false
        if (r.postponedUntil && r.postponedUntil > today) return false
        return true
      })
      .slice(0, 3)
      .map(r => r.id)
  )

  return records.filter(r => {
    if (r.completed) return false
    // 已在其他版块展示的排除
    if (r.type === 'task' && todayTaskIds.has(r.id)) return false
    if (r.type === 'shopping') return false
    if (r.type === 'idea') return false
    if (r.type === 'knowledge') return false
    // reminder 已在提醒版块展示
    if (r.type === 'reminder') return false
    return true
  })
}

/**
 * 获取所有未完成记录（用于统计）
 */
export function getIncompleteCount() {
  const records = getRecords()
  return records.filter(r => !r.completed).length
}
