import { useState } from 'react'

export default function QuickRecord({ onSave }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    onSave(trimmed)
    setText('')
  }

  return (
    <div className="quick-record">
      <h2 className="section-title">📝 先记下来</h2>
      <form className="record-form" onSubmit={handleSubmit}>
        <textarea
          className="record-input"
          placeholder="想到什么就记下来…&#10;例如：明天晚上 8 点提醒我洗衣服"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!text.trim()}
        >
          先记下来
        </button>
      </form>
    </div>
  )
}
