import { useEffect, useState, useRef } from 'react'
import './SplashScreen.css'

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime

      if (elapsed >= 2400) {
        clearInterval(interval)
        onFinishRef.current()
        return
      }
      if (elapsed >= 2200) {
        setExiting(true)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`splash-overlay${exiting ? ' splash-exit' : ''}`}>
      <div className="splash-scene">
        <div className="splash-visual">
          {/* Time ring — behind the note */}
          <div className="splash-ring-container">
            <div className="splash-ring">
              <span className="splash-ring-mark splash-ring-mark--top" />
              <span className="splash-ring-mark splash-ring-mark--right" />
              <span className="splash-ring-mark splash-ring-mark--bottom" />
              <span className="splash-ring-mark splash-ring-mark--left" />
            </div>
            <div className="splash-hand" />
          </div>

          {/* Note card — rises, lifts, then settles into drawer */}
          <div className="splash-note-wrapper">
            <div className="splash-note">
              <div className="splash-note-content">
                <div className="splash-note-line" />
                <div className="splash-note-line splash-note-line--short" />
                <div className="splash-note-dot" />
              </div>
            </div>
          </div>

          {/* Drawer / 收纳盒 — clearly visible */}
          <div className="splash-drawer">
            <div className="splash-drawer-body" />
            <div className="splash-drawer-cover" />
          </div>
        </div>

        {/* Product name & tagline */}
        <div className="splash-text">
          <h1 className="splash-title">拾遗</h1>
          <p className="splash-subtitle">把容易忘的，轻轻捡回</p>
        </div>
      </div>
    </div>
  )
}
