/**
 * 日期工具函数
 */

/**
 * 获取 ISO 日期字符串中的 YYYY-MM-DD 部分
 */
export function getDateStr(isoStr) {
  if (!isoStr) return ''
  return isoStr.slice(0, 10)
}

/**
 * 判断两个日期字符串是否同一天
 */
function isSameDay(a, b) {
  return getDateStr(a) === getDateStr(b)
}

/**
 * 判断 ISO 日期是否是今天
 */
export function isToday(isoStr) {
  if (!isoStr) return false
  return getDateStr(isoStr) === getTodayStr()
}

/**
 * 判断 ISO 日期是否是昨天
 */
export function isYesterday(isoStr) {
  if (!isoStr) return false
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const yesterday = dateToStr(d)
  return getDateStr(isoStr) === yesterday
}

/**
 * 获取今天的日期字符串
 */
export function getTodayStr() {
  return dateToStr(new Date())
}

/**
 * Date 对象转 YYYY-MM-DD
 */
function dateToStr(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取日期分组显示名称
 * @param {string} dateStr - YYYY-MM-DD 格式
 * @returns {string}
 */
export function getDateGroupLabel(dateStr) {
  if (!dateStr) return '较早'
  const today = getTodayStr()
  if (dateStr === today) return '今天'
  const yesterday = dateToStr(new Date(Date.now() - 86400000))
  if (dateStr === yesterday) return '昨天'
  const parts = dateStr.split('-')
  return `${parseInt(parts[0])}年${parseInt(parts[1])}月${parseInt(parts[2])}日`
}

/**
 * 格式化 ISO 字符串为 HH:mm
 */
export function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
