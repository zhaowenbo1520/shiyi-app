/**
 * 自动分类规则
 * 优先级：提醒 > 购物 > 创意 > 任务
 */

const RULES = [
  {
    type: 'reminder',
    keywords: ['提醒', '明天', '今晚', '今天', '周末', '几点', '早上', '下午', '晚上', '后天', '大后天', '下周', '下个月']
  },
  {
    type: 'shopping',
    keywords: ['买', '采购', '下单', '超市', '网购', '购物']
  },
  {
    type: 'idea',
    keywords: ['创意', '想法', '灵感', '点子', '选题']
  }
]

/**
 * 根据输入内容自动判断分类
 * @param {string} content
 * @returns {'task' | 'shopping' | 'idea' | 'reminder'}
 */
export function categorize(content) {
  if (!content || typeof content !== 'string') return 'task'

  const text = content.trim()

  // 按优先级检查规则
  for (const rule of RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        return rule.type
      }
    }
  }

  return 'task'
}

/**
 * 获取分类的中文显示名称
 */
export function getTypeLabel(type) {
  const labels = {
    task: '任务',
    shopping: '购物',
    idea: '创意',
    reminder: '提醒'
  }
  return labels[type] || '其他'
}

/**
 * 获取分类对应的图标 emoji
 */
export function getTypeIcon(type) {
  const icons = {
    task: '📋',
    shopping: '🛒',
    idea: '💡',
    reminder: '⏰'
  }
  return icons[type] || '📝'
}
