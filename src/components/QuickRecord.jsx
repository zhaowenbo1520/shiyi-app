import { useState } from 'react'

export default function QuickRecord({ onSave }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSave(trimmed)
    setText('')
  }

  const hasText = text.trim().length > 0

  return (
    <div className="quick-record-card">
      <h3 className="quick-record-title">先记下来</h3>
      <textarea
        className="quick-record-input"
        placeholder="想到什么，先放这里&#10;例如：明天晚上8点提醒我洗衣服"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
      />
      <button
        className="btn btn-primary btn-block"
        onClick={handleSubmit}
        disabled={!hasText}
      >
        先记下来
      </button>
    </div>
  )
}
