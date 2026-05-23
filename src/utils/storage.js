import { categorize } from './categorize'
import { getDateStr, getTodayStr } from './date'

const STORAGE_KEY = 'shiyi-records'

/**
 * 生成唯一 ID
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

/**
 * 归一化记录，确保所有字段存在
 * 兼容旧数据：如果 completed 但缺少 completedAt，从 updatedAt 或 createdAt 推断
 */
function normalizeRecord(record) {
  const r = record || {}

  // 如果已完成但缺少 completedAt，尝试推断
  if (r.completed && !r.completedAt) {
    r.completedAt = r.updatedAt || r.createdAt || null
  }

  // 确保 completedAt 字段存在（未完成时设为 null）
  if (!r.completed) {
    r.completedAt = r.completedAt || null
  }

  // 确保其他字段存在
  r.id = r.id || generateId()
  r.content = r.content || ''
  r.type = r.type || 'task'
  r.createdAt = r.createdAt || new Date().toISOString()
  r.updatedAt = r.updatedAt || new Date().toISOString()
  r.postponedUntil = r.postponedUntil || null
  r.originalText = r.originalText || r.content

  return r
}

/**
 * 从 localStorage 读取所有记录
 */
export function getRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const records = data ? JSON.parse(data) : []
    return records.map(normalizeRecord)
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
    completedAt: null,
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
 * 标记为完成（记录完成时间）
 */
export function completeRecord(id) {
  return updateRecord(id, {
    completed: true,
    completedAt: new Date().toISOString()
  })
}

/**
 * 恢复为未完成
 */
export function restoreRecord(id) {
  return updateRecord(id, {
    completed: false,
    completedAt: null
  })
}

/**
 * 推迟到明天
 */
export function postponeRecord(id) {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return updateRecord(id, { postponedUntil: `${year}-${month}-${day}` })
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
 * 获取想法列表（含已完成）
 */
export function getIdeaItems() {
  const records = getRecords()
  return records.filter(r => r.type === 'idea')
}

/**
 * 获取知识列表（含已完成）
 */
export function getKnowledgeItems() {
  const records = getRecords()
  return records.filter(r => r.type === 'knowledge')
}

/**
 * 获取收集箱内容（未完成的 inbox + 其他未展示的剩余未完成事项）
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
    if (r.type === 'task' && todayTaskIds.has(r.id)) return false
    if (r.type === 'shopping') return false
    if (r.type === 'idea') return false
    if (r.type === 'knowledge') return false
    if (r.type === 'reminder') return false
    return true
  })
}

/**
 * 获取所有已完成记录，按 completedAt 降序排列
 */
export function getCompletedItems() {
  const records = getRecords()
  return records
    .filter(r => r.completed && r.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
}

/**
 * 按日期分组已完成记录
 * 返回：[[dateStr, [items]], ...]
 */
export function getCompletedItemsGrouped() {
  const items = getCompletedItems()
  const groups = {}

  for (const item of items) {
    const dateStr = getDateStr(item.completedAt) || 'unknown'
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(item)
  }

  // 按日期降序排列
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

/**
 * 获取今日完成的条目数量
 */
export function getTodayCompletedCount() {
  const records = getRecords()
  const today = getTodayStr()
  return records.filter(r => r.completed && r.completedAt && getDateStr(r.completedAt) === today).length
}

/**
 * 获取所有未完成记录（用于统计）
 */
export function getIncompleteCount() {
  const records = getRecords()
  return records.filter(r => !r.completed).length
}
