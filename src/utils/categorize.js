/**
 * 自动分类规则
 * 优先级：提醒 > 购物 > 想法 > 知识 > 待办
 */

const RULES = [
  {
    type: 'reminder',
    keywords: ['提醒', '明天', '今晚', '今天', '周末', '几点', '早上', '下午', '晚上', '后天', '下周']
  },
  {
    type: 'shopping',
    keywords: ['买', '采购', '下单', '超市', '网购']
  },
  {
    type: 'idea',
    keywords: ['创意', '想法', '灵感', '点子', '选题', '产品想法']
  },
  {
    type: 'knowledge',
    keywords: ['知识', '概念', '方法', '原则', '经验', '学习', '记住', '笔记', '理论', '公式', '定义', '什么意思', '总结']
  }
]

/**
 * 根据输入内容自动判断分类
 * @param {string} content
 * @returns {'task' | 'reminder' | 'shopping' | 'idea' | 'knowledge' | 'inbox'}
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
    task: '待办',
    reminder: '提醒',
    shopping: '购物',
    idea: '想法',
    knowledge: '知识',
    inbox: '收集箱'
  }
  return labels[type] || '其他'
}

/**
 * 获取分类对应的图标 emoji
 */
export function getTypeIcon(type) {
  const icons = {
    task: '📋',
    reminder: '⏰',
    shopping: '🛒',
    idea: '💡',
    knowledge: '📖',
    inbox: '📥'
  }
  return icons[type] || '📝'
}
